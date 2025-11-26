// dataM/WeatherModels.ts for each different time intervals

export interface ForecastCurrent {
  time: Date;
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
}

export interface ForecastHourly {
  time: Date;
  temperature: number;
  precipitation: number;
}

export interface ForecastDaily {
  time: Date;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
}

export interface ForecastBundle {
  current: ForecastCurrent | null;
  hourly: ForecastHourly[];
  daily: ForecastDaily[];
}
