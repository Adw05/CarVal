import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, PlusCircle, Gauge, Car as CarIcon, Upload } from 'lucide-react';
import Dropzone from 'react-dropzone';
import { CarDetails } from '../types';
import { fetchCarModels } from '../services/carApi';

interface PredictionFormProps {
  onSubmit: (data: CarDetails) => void;
  onImageUpload: (formData: FormData) => void;
  loading: boolean;
  formData: CarDetails;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isImageMode: boolean;
  uploadedImage: string | null;
  setUploadedImage: React.Dispatch<React.SetStateAction<string | null>>;
}

const PredictionForm: React.FC<PredictionFormProps> = ({
  onSubmit,
  onImageUpload,
  loading,
  formData,
  onInputChange,
  isImageMode,
  uploadedImage,
  setUploadedImage,
}) => {
  const [models, setModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingModels(true);
        const modelsList = await fetchCarModels();
        setModels(modelsList || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load models:', err);
        setError('Failed to load models. Please try again later.');
      } finally {
        setLoadingModels(false);
      }
    };

    loadModels();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit: CarDetails = {
      ...formData,
      mileage: Number(formData.mileage) || 0,
    };
    onSubmit(dataToSubmit);
  };

  const handleImageDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      
      reader.readAsDataURL(file);
      
      const imageFormData = new FormData();
      imageFormData.append('image', file);
      
      onImageUpload(imageFormData);
    }
  };

  return (
    <motion.div 
      className="glass-card p-6 md:p-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl md:text-2xl font-racing mb-6 flex items-center">
        <CarIcon className="mr-2 text-racing-red-500" />
        <span>PREDICT <span className="text-racing-red-500">TOYOTA</span> VALUE</span>
      </h2>

      {error && (
        <div className="bg-racing-red-900/50 border border-racing-red-700 text-white p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-dark-300 mb-2 text-sm">Manufacturer</label>
              <div className="input-field opacity-75 cursor-not-allowed bg-dark-700/50">
                Toyota (Only available option currently)
              </div>
            </div>

            <div>
              <label htmlFor="model" className="block text-dark-300 mb-2 text-sm">Model</label>
              <select 
                id="model"
                name="model"
                value={formData.model}
                onChange={onInputChange}
                className="input-field"
                disabled={loadingModels || isImageMode}
              >
                {loadingModels ? (
                  <option>Loading models...</option>
                ) : isImageMode && !formData.model ? (
                  <option>Detecting model from image...</option>
                ) : isImageMode && formData.model ? (
                   <option key={formData.model} value={formData.model}>{formData.model}</option>
                ) : (
                  models.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-dark-300 mb-2 text-sm flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Manufacturing Year
              </label>
              <input 
                type="range"
                id="year"
                name="year"
                min="1990"
                max="2025"
                value={formData.year}
                onChange={onInputChange}
                className="w-full"
                disabled={loading}
              />
              <div className="flex justify-between text-sm text-dark-400 mt-1">
                <span>1990</span>
                <span className="text-white font-semibold">{formData.year}</span>
                <span>2025</span>
              </div>
            </div>

            <div>
              <label htmlFor="mileage" className="block text-dark-300 mb-2 text-sm flex items-center">
                <Gauge className="w-4 h-4 mr-1" />
                Mileage (km)
              </label>
              <input 
                type="number"
                id="mileage"
                name="mileage"
                value={formData.mileage}
                onChange={onInputChange}
                className="input-field"
                min="0"
                step="1000"
                disabled={loading}
                placeholder="Enter mileage"
              />
            </div>

            <div>
              <label htmlFor="future_year" className="block text-dark-300 mb-2 text-sm flex items-center">
                <PlusCircle className="w-4 h-4 mr-1" />
                Prediction Year
              </label>
              <select
                id="future_year"
                name="future_year"
                value={formData.future_year}
                onChange={onInputChange}
                className="input-field"
                disabled={loading}
              >
                {Array.from({ length: 6 }, (_, i) => 2025 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <motion.button
              type="submit"
              className="btn-primary w-full flex justify-center items-center"
              disabled={loading || (isImageMode && !formData.model)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Calculate Price'
              )}
            </motion.button>
          </form>
        </div>

        <div>
          <div className="mb-4">
            <h3 className="text-lg font-racing mb-2 flex items-center">
              <Upload className="w-4 h-4 mr-1 text-racing-red-500" />
              VEHICLE RECOGNITION
            </h3>
            <p className="text-sm text-dark-300 mb-4">
              Upload an image of a vehicle to automatically identify the model
            </p>
          </div>

          <Dropzone onDrop={handleImageDrop} accept={{ 'image/*': [] }} disabled={loading}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 h-52 flex items-center justify-center ${
                  isDragActive ? 'border-racing-red-500 bg-racing-red-900/20' : 'border-dark-700 hover:border-racing-red-600'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} disabled={loading} />
                
                {uploadedImage ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded vehicle" 
                      className="w-full h-full object-contain"
                    />
                    {loading && (
                      <div className="absolute inset-0 bg-dark-900/70 flex items-center justify-center">
                        <div className="text-white text-sm">Analyzing image...</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-dark-400">
                    {isDragActive ? (
                      <p>Drop the image here...</p>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto mb-2 text-racing-red-500" />
                        <p>Drag & drop an image here, or click to select</p>
                        <p className="text-xs mt-2 text-dark-500">
                          JPG, PNG or GIF format
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </Dropzone>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictionForm;