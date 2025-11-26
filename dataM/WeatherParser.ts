// dataM/WeatherParser.ts
import {
  ForecastBundle,
  ForecastCurrent,
  ForecastDaily,
  ForecastHourly,
} from "./WeatherModels";

//  Raw SMHI JSON type 

export interface RawSMHIResponse {
  timeSeries: {
    validTime: string;
    parameters: {
      name: string;
      values: number[];
    }[];
  }[];
}

//  Helpers 

// Convert Float32Array | Float64Array | BigInt64Array → number[]
const toNums = (arr: any): number[] => {
  const out: number[] = [];
  for (let i = 0; i < arr.length; i++) out.push(Number(arr[i]));
  return out;
};

// Generate timestamps for Open-Meteo
const range = (start: any, end: any, step: any): number[] => {
  const s = Number(start);
  const e = Number(end);
  const st = Number(step);
  const out: number[] = [];
  for (let t = s; t < e; t += st) out.push(t);
  return out;
};

//
// ----------- OPEN-METEO PARSER -----------
// 
export function parseOpenMeteo(raw: any): ForecastBundle {
  console.log("Raw Open-Meteo response:", raw);

  const utc = Number(raw.utc_offset_seconds ?? 0);

  // CURRENT
  const c = raw.current ?? raw.current_weather;
  const current: ForecastCurrent | null = c
    ? {
        time: new Date((new Date(c.time).getTime() / 1000 + utc) * 1000),
        temperature: Number(c.temperature_2m ?? c.temperature),
        weatherCode: Number(c.weather_code ?? c.weathercode),
        windSpeed: Number(c.wind_speed_10m ?? c.windspeed),
        windDirection: Number(c.wind_direction_10m ?? c.winddirection),
      }
    : null;

  // HOURLY
  const hourly: ForecastHourly[] = [];
  if (raw.hourly) {
    const times = raw.hourly.time.map((t: string) =>
      new Date((new Date(t).getTime() / 1000 + utc) * 1000)
    );

    const temps = raw.hourly.temperature_2m ?? [];
    const prec = raw.hourly.precipitation ?? [];

    for (let i = 0; i < times.length; i++) {
      hourly.push({
        time: times[i],
        temperature: temps[i],
        precipitation: prec[i],
      });
    }
  }

  // DAILY
  const daily: ForecastDaily[] = [];
  if (raw.daily) {
    const times = raw.daily.time.map((t: string) =>
      new Date((new Date(t).getTime() / 1000 + utc) * 1000)
    );

    const codes = raw.daily.weather_code ?? [];
    const maxes = raw.daily.temperature_2m_max ?? [];
    const mins = raw.daily.temperature_2m_min ?? [];

    for (let i = 0; i < times.length; i++) {
      daily.push({
        time: times[i],
        weatherCode: codes[i],
        tempMax: maxes[i],
        tempMin: mins[i],
      });
    }
  }

  return { current, hourly, daily };
}

//
// ------------- SMHI PARSER ------------- 
//
export function parseSMHI(raw: RawSMHIResponse): ForecastBundle {
  const ts = raw.timeSeries;
  if (!ts || ts.length === 0) {
    return {
      current: null,
      hourly: [],
      daily: [],
    };
  }

  // Helper to read SMHI parameters
  const get = (entry: any, name: string) =>
    entry.parameters.find((p: any) => p.name === name)?.values?.[0] ?? 0;

  // HOURLY
  const hourly: ForecastHourly[] = ts.map((entry) => ({
    time: new Date(entry.validTime),
    temperature: get(entry, "t"),
    precipitation: get(entry, "pmean"),
  }));

  // CURRENT = first hourly entry
  const first = ts[0];
  const current: ForecastCurrent = {
    time: new Date(first.validTime),
    temperature: get(first, "t"),
    weatherCode: get(first, "Wsymb2"),
    windSpeed: get(first, "ws"),
    windDirection: get(first, "wd"),
  };

  // DAILY aggregation
  const buckets: Record<
    string,
    { temps: number[]; codes: number[]; first: Date }
  > = {};

  ts.forEach((e) => {
    const dateKey = e.validTime.split("T")[0];
    if (!buckets[dateKey]) {
      buckets[dateKey] = {
        temps: [],
        codes: [],
        first: new Date(e.validTime),
      };
    }
    buckets[dateKey].temps.push(get(e, "t"));
    buckets[dateKey].codes.push(get(e, "Wsymb2"));
  });

  const daily: ForecastDaily[] = Object.keys(buckets)
    .sort()
    .map((key) => {
      const b = buckets[key];
      return {
        time: b.first,
        tempMax: Math.max(...b.temps),
        tempMin: Math.min(...b.temps),
        weatherCode: b.codes[0] || 0,
      };
    });

  return {
    current,
    hourly,
    daily,
  };
}

//
// 
//          Extract hourly for one selected day
// 
//
export function extractHourlyForDay(
  bundle: ForecastBundle,
  dayIndex: number
): ForecastHourly[] {
  const day = bundle.daily[dayIndex];
  if (!day) return [];

  const key = day.time.toISOString().split("T")[0];

  return bundle.hourly.filter((h) =>
    h.time.toISOString().startsWith(key)
  );
}
