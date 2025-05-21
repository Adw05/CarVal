import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import Footer from './components/Footer';
import { CarDetails, PredictionResultType } from './types';
import { predictCarPrice, predictFromImage } from './services/carApi';

function App() {
  const [predictionResult, setPredictionResult] = useState<PredictionResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CarDetails>({
    model: '',
    year: 2020,
    mileage: 0,
    future_year: 2025,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'model' ? value : Number(value),
    }));
  };

  const handleFormSubmit = async (data: CarDetails) => {
    try {
      setLoading(true);
      setError(null);
      const result = await predictCarPrice(data);
      setPredictionResult(result);
      scrollToResults();
      setUploadedImage(null); // Clear uploaded image display
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
      // Keep current form data for year and future_year, but reset mileage
      const currentFormData = { ...formData };
      // Append current form data to imageFormData
      imageFormData.set('year', String(currentFormData.year));
      imageFormData.set('future_year', String(currentFormData.future_year));

      const result = await predictFromImage(imageFormData);
      // Update form data with the predicted model and reset mileage to empty
      setFormData(prev => ({ 
        ...prev, 
        model: result.model,
        mileage: 0 // Reset mileage to empty
      }));
      
      // Don't show prediction result until user completes the form and clicks Calculate
      // setPredictionResult(result);
      // scrollToResults();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the image');
      console.error('Image processing error:', err);
      setUploadedImage(null); // Clear uploaded image display on error
    } finally {
      setLoading(false);
    }
  };

  const scrollToResults = () => {
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* To use GIF background, change class to "car-background gif-bg" */}
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
              PREDICT YOUR CAR'S <span className="text-racing-red-500">FUTURE VALUE</span>
            </h1>
            <p className="text-lg text-dark-300 max-w-3xl mx-auto">
              Use our advanced AI-powered tool to accurately estimate your car's market value 
              based on model, year, mileage, and future projections.
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