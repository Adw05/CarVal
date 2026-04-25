import {
  PredictionRequest,
  PredictionApiResponse,
  ImagePredictionResponse,
} from '../types';

const API_URL = 'https://adw01-carval-api.hf.space';

/**
 * POST /predict
 * Sends manufacturer, model, year, mileage, fuel_type, transmission, body_type,
 * cylinder, seats. NOTE: future_year is intentionally NOT sent.
 */
export const predictCarPrice = async (
  data: PredictionRequest
): Promise<PredictionApiResponse> => {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const text = await response.text();

  if (!response.ok) {
    let message = `API error: ${response.status}`;
    try {
      const parsed = JSON.parse(text);
      message = parsed.detail || parsed.error || parsed.message || message;
    } catch {
      // ignore parse error, fall through with generic message
    }
    throw new Error(message);
  }

  return JSON.parse(text) as PredictionApiResponse;
};

/**
 * POST /predict_image
 * Sends FormData with the file appended under the EXACT key "image".
 */
export const predictFromImage = async (
  file: File
): Promise<ImagePredictionResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_URL}/predict_image`, {
    method: 'POST',
    body: formData,
  });

  const text = await response.text();

  if (!response.ok) {
    let message = `API error: ${response.status}`;
    try {
      const parsed = JSON.parse(text);
      message = parsed.detail || parsed.error || parsed.message || message;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  return JSON.parse(text) as ImagePredictionResponse;
};
