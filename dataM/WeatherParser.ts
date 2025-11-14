import { RawOpenMeteoResponse, RawSMHIResponse } from "./WeatherApi";

//Common model used by both APIs
export interface ForecastDay {
  date: string;        // e.g. "2021-11-01T14:00:00Z"
  temperature: number; // °C
  cloudCover: number;  // % (0–100)
}

// Parse SMHI / KTH forecast into a simpler array for the app 
export function mapSMHIToDays(raw: RawSMHIResponse): ForecastDay[] {
  if (!raw?.timeSeries) return []; // if no data available 

  const days: ForecastDay[] = [];

  for (const entry of raw.timeSeries) {
    const time = entry.validTime;

    // Find temperature ("t") and total cloud cover ("tcc_mean")
    const tParam = entry.parameters.find((p) => p.name === "t");
    const cParam = entry.parameters.find((p) => p.name === "tcc_mean");
    // Find more data hereas needed... for example wind speed: "ws", "wd", precipitation: "pmean", etc.

    if (!tParam || !cParam) continue;

    const temperature = tParam.values?.[0] ?? 0; 
    const cloudOctas = cParam.values?.[0] ?? 0;
    const cloudCover = Math.min(100, (cloudOctas / 8) * 100); // convert octas (0–8) → %

    days.push({ date: time, temperature, cloudCover });
  }

  console.log("Parsed SMHI entries:", days.length);
  return days;
}


//Parse Open-Meteo daily forecast into the same model
export function mapOpenMeteoToDays(raw: RawOpenMeteoResponse): ForecastDay[] {
  const d = raw?.daily ?? {};
  if (!d.time || !d.temperature_2m_max || !d.cloudcover_mean) return []; //if no data available 

  const days = d.time.map((t, i) => ({
    date: t,
    temperature: d.temperature_2m_max[i], // max temp
    cloudCover: d.cloudcover_mean[i],  // mean cloud cover
    // add more fields as needed 
  }));

  console.log("Parsed Open-Meteo entries:", days.length);
  return days;
}
