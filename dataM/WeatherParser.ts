// dataM/WeatherParser.ts
import {
  ForecastBundle,
  ForecastCurrent,
  ForecastDaily,
  ForecastHourly,
} from "./WeatherModels";

// ---------- Raw SMHI JSON type ----------

export interface RawSMHIResponse {
  timeSeries: {
    validTime: string;
    parameters: {
      name: string;
      values: number[];
    }[];
  }[];
}

// ---------- Helpers ----------

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
// ------------------------------------------------------------
//                    OPEN-METEO PARSER
// ------------------------------------------------------------
//
export function parseOpenMeteo(raw: any): ForecastBundle {
  const utc = Number(raw.utcOffsetSeconds());

  // CURRENT
  const c = raw.current();
  const current: ForecastCurrent | null = c
    ? {
        time: new Date((Number(c.time()) + utc) * 1000),
        temperature: Number(c.variables(0).value()),
        weatherCode: Number(c.variables(1).value()),
        windSpeed: Number(c.variables(2).value()),
        windDirection: Number(c.variables(3).value()),
      }
    : null;

  // HOURLY
  const h = raw.hourly();
  const hourly: ForecastHourly[] = [];

  if (h) {
    const times = range(h.time(), h.timeEnd(), h.interval()).map(
      (t) => new Date((t + utc) * 1000)
    );

    const temps = toNums(h.variables(0).valuesArray());
    const prec = toNums(h.variables(1).valuesArray());

    for (let i = 0; i < times.length; i++) {
      hourly.push({
        time: times[i],
        temperature: temps[i],
        precipitation: prec[i],
      });
    }
  }

  // DAILY
  const d = raw.daily();
  const daily: ForecastDaily[] = [];

  if (d) {
    const times = range(d.time(), d.timeEnd(), d.interval()).map(
      (t) => new Date((t + utc) * 1000)
    );

    const codes = toNums(d.variables(0).valuesArray());
    const maxes = toNums(d.variables(1).valuesArray());
    const mins = toNums(d.variables(2).valuesArray());

    for (let i = 0; i < times.length; i++) {
      daily.push({
        time: times[i],
        weatherCode: codes[i],
        tempMax: maxes[i],
        tempMin: mins[i],
      });
    }
  }

  return {
    current,
    hourly,
    daily,
  };
}

//
// ------------------------------------------------------------
//                    SMHI PARSER
// ------------------------------------------------------------
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
// ------------------------------------------------------------
//          Extract hourly for one selected day
// ------------------------------------------------------------
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
