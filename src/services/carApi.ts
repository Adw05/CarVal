//const API_URL = 'http://127.0.0.1:8080';
const API_URL = 'https://calval-backend.onrender.com';

export interface PredictionRequest {
  model: string;
  year: number;
  mileage: number;
  future_year: number;
}

export interface PredictionResponse {
  model: string;
  year: number;
  future_year: number;
  lower_bound: number;
  upper_bound: number;
}

export const fetchCarModels = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    // Log raw response for debugging
    const text = await response.text();
    console.log('fetchCarModels response:', text, 'Status:', response.status);

    if (response.status === 304) {
      // Retry with fresh request if 304 is received
      console.log('304 Not Modified, retrying...');
      const freshResponse = await fetch(`${API_URL}/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      const freshText = await freshResponse.text();
      console.log('Fresh response:', freshText, 'Status:', freshResponse.status);
      if (!freshResponse.ok) {
        throw new Error(`API error: ${freshResponse.status}, Response: ${freshText}`);
      }
      return JSON.parse(freshText);
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}, Response: ${text}`);
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Error fetching car models:', error);
    throw error;
  }
};

export const predictCarPrice = async (data: PredictionRequest): Promise<PredictionResponse> => {
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

    // Log raw response for debugging
    const text = await response.text();
    console.log('predictCarPrice response:', text, 'Status:', response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        throw new Error(`API error: ${response.status}, Response: ${text}`);
      }
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Error predicting car price:', error);
    throw error;
  }
};

export const predictFromImage = async (
  formData: FormData
): Promise<PredictionResponse> => {
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
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Error predicting from image:', error);
    throw error;
  }
};