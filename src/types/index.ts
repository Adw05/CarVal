export interface CarDetails {
  model: string;
  year: number;
  mileage: number;
  future_year: number;
}

export interface PredictionResultType {
  model: string;
  year: number;
  future_year: number;
  lower_bound: number;
  upper_bound: number;
}