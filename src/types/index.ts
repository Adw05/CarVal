export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
export type Transmission = 'Automatic' | 'Manual';
export type BodyType = 'Sedan' | 'SUV' | 'Hatchback' | 'Coupe' | 'Truck';
export type InputMode = 'manual' | 'image' | null;

export interface CarDetails {
  manufacturer: string;
  model: string;
  year: number;
  mileage: number | '';
  fuel_type: FuelType | '';
  transmission: Transmission | '';
  body_type: BodyType | '';
  cylinder: number | '';
  seats: number | '';
  future_year: number;
}

// Payload sent to /predict (no future_year, server does not accept it)
export interface PredictionRequest {
  manufacturer: string;
  model: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  cylinder: number;
  seats: number;
}

// Response from /predict
export interface PredictionApiResponse {
  predicted_price_aed: number;
  price_range_low: number;
  price_range_high: number;
}

// Response from /predict_image
export interface ImagePredictionResponse {
  manufacturer: string;
  model: string;
}

// Final result rendered in the UI (after applying client-side depreciation)
export interface PredictionResultType {
  manufacturer: string;
  model: string;
  year: number;
  future_year: number;
  predicted_price_aed: number;
  price_range_low: number;
  price_range_high: number;
}
