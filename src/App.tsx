import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import Footer from './components/Footer';
import { CarDetails, PredictionResultType, PredictionPayload } from './types';
import { predictCarPrice, predictFromImage, calculateDepreciation } from './services/carApi';

function App() {
  console.log("[v0] App component rendering");
  const [predictionResult, setPredictionResult] = useState<PredictionResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CarDetails>({
    manufacturer: '',
    model: '',
    year: 2020,
    mileage: 0,
    fuel_type: '',
    transmission: '',
    body_type: '',
    cylinder: 4,
    seats: 5,
    future_year: 2025,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['model', 'manufacturer', 'fuel_type', 'transmission', 'body_type'].includes(name) 
        ? value 
        : Number(value),
    }));
  };

  const handleFormSubmit = async (data: CarDetails) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare payload - strip out future_year as it's for client-side only
      const payload: PredictionPayload = {
        manufacturer: data.manufacturer,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        fuel_type: data.fuel_type,
        transmission: data.transmission,
        body_type: data.body_type,
        cylinder: data.cylinder,
        seats: data.seats,
      };
      
      const apiResponse = await predictCarPrice(payload);
      
      // Calculate depreciation on client side
      const { predicted_price, lower_bound, upper_bound } = calculateDepreciation(
        apiResponse.predicted_price_aed,
        apiResponse.price_range_low,
        apiResponse.price_range_high,
        data.future_year
      );
      
      // Build result with depreciation applied
      const result: PredictionResultType = {
        manufacturer: data.manufacturer,
        model: data.model,
        year: data.year,
        future_year: data.future_year,
        lower_bound,
        upper_bound,
        predicted_price,
      };
      
      setPredictionResult(result);
      scrollToResults();
      setUploadedImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while predicting price');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (imageFormData: FormData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await predictFromImage(imageFormData);
      
      // Update form data with the predicted manufacturer and model
      // Image recognition returns { manufacturer: "Toyota", model: "Predicted Model" }
      setFormData(prev => ({ 
        ...prev, 
        manufacturer: result.manufacturer,
        model: result.model,
        mileage: 0, // Reset mileage for user to fill in
      }));
      
      // Don't show prediction result - user needs to complete the form first
      // The form will automatically switch to manual mode for remaining fields
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the image');
      console.error('Image processing error:', err);
      setUploadedImage(null);
    } finally {
      setLoading(false);
    }
  };

  const switchToManualMode = () => {
    // This function is passed to PredictionForm to switch modes
    // The form component handles the mode switch internally
  };

  const handleResetState = () => {
    setPredictionResult(null);
    setError(null);
    setUploadedImage(null);
    setFormData({
      manufacturer: '',
      model: '',
      year: 2020,
      mileage: 0,
      fuel_type: '',
      transmission: '',
      body_type: '',
      cylinder: 4,
      seats: 5,
      future_year: 2025,
    });
  };

  const scrollToResults = () => {
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="car-background static-bg"></div>
      
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
            <h1 className="text-3xl md:text-5xl font-racing mb-4">
              PREDICT YOUR CAR&apos;S <span className="text-racing-red-500">FUTURE VALUE</span>
            </h1>
            <p className="text-lg text-dark-300 max-w-3xl mx-auto">
              Use our advanced AI-powered tool to accurately estimate your car&apos;s market value 
              based on manufacturer, model, year, mileage, and more. Now supporting 60+ brands!
            </p>
          </motion.div>
          
          {error && (
            <motion.div 
              className="bg-racing-red-900/50 border border-racing-red-700 text-white p-4 rounded-md mb-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
          
          <PredictionForm 
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleFormSubmit} 
            onImageUpload={handleImageUpload}
            loading={loading}
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
            switchToManualMode={switchToManualMode}
            onResetState={handleResetState}
          />
          
          {predictionResult && (
            <div id="results">
              <PredictionResult result={predictionResult} />
            </div>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
