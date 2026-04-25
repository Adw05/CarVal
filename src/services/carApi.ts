import { PredictionPayload, ApiPredictionResponse, ImageRecognitionResponse } from '../types';

const API_URL = 'https://adw01-carval-api.hf.space';

export const predictCarPrice = async (data: PredictionPayload): Promise<ApiPredictionResponse> => {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();
    console.log('predictCarPrice response:', text, 'Status:', response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        throw new Error(`API error: ${response.status}, Response: ${text}`);
      }
      throw new Error(errorData.error || errorData.detail || `API error: ${response.status}`);
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Error predicting car price:', error);
    throw error;
  }
};

export const predictFromImage = async (
  formData: FormData
): Promise<ImageRecognitionResponse> => {
  try {
    const response = await fetch(`${API_URL}/predict_image`, {
      method: 'POST',
      body: formData,
    });

    const text = await response.text();
    console.log('predictFromImage response:', text, 'Status:', response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        throw new Error(`API error: ${response.status}, Response: ${text}`);
      }
      throw new Error(errorData.error || errorData.detail || `API error: ${response.status}`);
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Error predicting from image:', error);
    throw error;
  }
};

// Helper function to calculate depreciation on the client side
export const calculateDepreciation = (
  basePrice: number,
  lowPrice: number,
  highPrice: number,
  futureYear: number
): { predicted_price: number; lower_bound: number; upper_bound: number } => {
  const currentYear = new Date().getFullYear();
  const yearsAhead = Math.max(0, futureYear - currentYear);
  
  // 7% annual depreciation rate
  const depreciationFactor = Math.pow(0.93, yearsAhead);
  
  return {
    predicted_price: Math.round(basePrice * depreciationFactor),
    lower_bound: Math.round(lowPrice * depreciationFactor),
    upper_bound: Math.round(highPrice * depreciationFactor),
  };
};
