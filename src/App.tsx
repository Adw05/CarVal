import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import Footer from './components/Footer';
import {
  CarDetails,
  InputMode,
  PredictionRequest,
  PredictionResultType,
} from './types';
import { predictCarPrice, predictFromImage } from './services/carApi';

const CURRENT_YEAR = new Date().getFullYear();

const DEFAULT_FORM_DATA: CarDetails = {
  manufacturer: '',
  model: '',
  year: 2020,
  mileage: '',
  fuel_type: '',
  transmission: '',
  body_type: '',
  cylinder: '',
  seats: '',
  future_year: 2025,
};

function App() {
  // ── Master state (single source of truth) ───────────────────────────────
  const [formData, setFormData] = useState<CarDetails>(DEFAULT_FORM_DATA);
  const [predictionResult, setPredictionResult] =
    useState<PredictionResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Strict reset. Clears every piece of master state EXCEPT inputMode so the
   * next view is 100% clean. Called on mode switches and after the user clicks
   * "Change Method".
   */
  const resetState = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
    setPredictionResult(null);
    setError(null);
    setUploadedImage(null);
    setLoading(false);
  }, []);

  /** Switching mode always wipes prior view state. */
  const handleModeChange = useCallback(
    (mode: InputMode) => {
      resetState();
      setInputMode(mode);
      // For image mode, manufacturer is locked to Toyota.
      if (mode === 'image') {
        setFormData(prev => ({ ...prev, manufacturer: 'Toyota' }));
      }
    },
    [resetState]
  );

  const handleFormDataChange = useCallback(
    (updates: Partial<CarDetails>) => {
      setFormData(prev => ({ ...prev, ...updates }));
    },
    []
  );

  const scrollToResults = () => {
    setTimeout(() => {
      document
        .getElementById('results')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setPredictionResult(null);

      const payload: PredictionRequest = {
        manufacturer: formData.manufacturer,
        model: formData.model,
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        fuel_type: String(formData.fuel_type),
        transmission: String(formData.transmission),
        body_type: String(formData.body_type),
        cylinder: Number(formData.cylinder),
        seats: Number(formData.seats),
      };

      const apiResult = await predictCarPrice(payload);

      // Client-side depreciation for the chosen future year.
      const yearsAhead = Math.max(0, formData.future_year - CURRENT_YEAR);
      const depreciationFactor = Math.pow(0.93, yearsAhead);

      const finalResult: PredictionResultType = {
        manufacturer: formData.manufacturer,
        model: formData.model,
        year: formData.year,
        future_year: formData.future_year,
        predicted_price_aed: apiResult.predicted_price_aed * depreciationFactor,
        price_range_low: apiResult.price_range_low * depreciationFactor,
        price_range_high: apiResult.price_range_high * depreciationFactor,
      };

      setPredictionResult(finalResult);
      scrollToResults();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while predicting price'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      setPredictionResult(null);

      // Show local preview while we hit the API.
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);

      const result = await predictFromImage(file);

      // Auto-fill manufacturer + model only. The remaining fields will be
      // revealed in the form so the user can finish.
      setFormData(prev => ({
        ...prev,
        manufacturer: result.manufacturer || 'Toyota',
        model: result.model,
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while processing the image'
      );
      setUploadedImage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="car-background static-bg" />

      <Header />

      <main className="flex-grow">
        <motion.div
          className="container mx-auto px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <h1 className="text-3xl md:text-5xl font-racing mb-4 text-balance">
              PREDICT YOUR CAR&apos;S{' '}
              <span className="text-racing-red-500">FUTURE VALUE</span>
            </h1>
            <p className="text-lg text-dark-300 max-w-3xl mx-auto text-pretty">
              Use our advanced AI-powered tool to accurately estimate your
              car&apos;s market value based on model, year, mileage, and future
              projections.
            </p>
          </motion.div>

          {error && (
            <motion.div
              className="bg-racing-red-900/50 border border-racing-red-700 text-white p-4 rounded-md mb-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
            >
              {error}
            </motion.div>
          )}

          <PredictionForm
            inputMode={inputMode}
            formData={formData}
            uploadedImage={uploadedImage}
            loading={loading}
            onModeChange={handleModeChange}
            onFormDataChange={handleFormDataChange}
            onSubmit={handleSubmit}
            onImageUpload={handleImageUpload}
          />

          <div id="results">
            <PredictionResult result={predictionResult} />
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
