import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  PlusCircle, 
  Gauge, 
  Car as CarIcon, 
  Upload, 
  Image, 
  PenSquare, 
  AlertCircle,
  Fuel,
  Settings,
  Armchair,
  CircleDot
} from 'lucide-react';
import Dropzone from 'react-dropzone';
import { CarDetails, MANUFACTURERS, CAR_MODELS, FUEL_TYPES, TRANSMISSIONS, BODY_TYPES } from '../types';

interface PredictionFormProps {
  onSubmit: (data: CarDetails) => void;
  onImageUpload: (formData: FormData) => void;
  loading: boolean;
  formData: CarDetails;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  uploadedImage: string | null;
  setUploadedImage: React.Dispatch<React.SetStateAction<string | null>>;
  switchToManualMode: () => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({
  onSubmit,
  onImageUpload,
  loading,
  formData,
  onInputChange,
  uploadedImage,
  setUploadedImage,
  switchToManualMode,
}) => {
  const [inputMode, setInputMode] = useState<'manual' | 'image' | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Get available models for the selected manufacturer
  const availableModels = formData.manufacturer ? (CAR_MODELS[formData.manufacturer] || []) : [];

  // Check if we're in image mode and the model has been detected
  const imageModelDetected = inputMode === 'image' && formData.model;

  // Condition to show the full form fields
  const showFormFields = inputMode === 'manual' || (inputMode === 'image' && formData.model);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.manufacturer) {
      newErrors.manufacturer = 'Please select a manufacturer.';
    }
    if (!formData.model) {
      newErrors.model = 'Please select a model.';
    }
    if (!formData.mileage) {
      newErrors.mileage = 'Please enter the mileage to proceed with prediction.';
    }
    if (!formData.fuel_type) {
      newErrors.fuel_type = 'Please select a fuel type.';
    }
    if (!formData.transmission) {
      newErrors.transmission = 'Please select a transmission type.';
    }
    if (!formData.body_type) {
      newErrors.body_type = 'Please select a body type.';
    }
    
    setValidationErrors(newErrors);
    
    // Only submit if there are no validation errors
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
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
      imageFormData.append('file', file);
      
      // Reset mileage field to empty when image is uploaded
      onInputChange({
        target: { name: 'mileage', value: '' }
      } as React.ChangeEvent<HTMLInputElement>);
      
      // Clear any previous validation errors
      setValidationErrors({});
      
      onImageUpload(imageFormData);
    }
  };

  const handleModeSelect = (mode: 'manual' | 'image') => {
    setInputMode(mode);
    if (mode === 'manual') {
      setUploadedImage(null);
    }
  };

  // Handle manufacturer change - reset model when manufacturer changes
  const handleManufacturerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onInputChange(e);
    // Reset model when manufacturer changes
    onInputChange({
      target: { name: 'model', value: '' }
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  if (!inputMode) {
    return (
      <motion.div 
        className="glass-card p-6 md:p-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl md:text-2xl font-racing mb-6 text-center">
          SELECT INPUT <span className="text-racing-red-500">METHOD</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.button
            onClick={() => handleModeSelect('manual')}
            className="p-8 rounded-lg bg-dark-800 hover:bg-dark-700 transition-all duration-300 flex flex-col items-center space-y-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PenSquare className="w-12 h-12 text-racing-red-500" />
            <div>
              <h3 className="text-lg font-racing mb-2">MANUAL ENTRY</h3>
              <p className="text-sm text-dark-300">Enter vehicle details manually</p>
              <p className="text-xs text-dark-400 mt-1">Supports 60+ manufacturers</p>
            </div>
          </motion.button>

          <motion.button
            onClick={() => handleModeSelect('image')}
            className="p-8 rounded-lg bg-dark-800 hover:bg-dark-700 transition-all duration-300 flex flex-col items-center space-y-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Image className="w-12 h-12 text-racing-red-500" />
            <div>
              <h3 className="text-lg font-racing mb-2">IMAGE RECOGNITION</h3>
              <p className="text-sm text-dark-300">Upload a photo of your vehicle</p>
              <p className="text-xs text-dark-400 mt-1">Currently supports Toyota only</p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const canSubmit = formData.manufacturer && formData.model && formData.mileage && 
                    formData.fuel_type && formData.transmission && formData.body_type;

  return (
    <motion.div 
      className="glass-card p-6 md:p-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-racing flex items-center">
          <CarIcon className="mr-2 text-racing-red-500" />
          <span>PREDICT <span className="text-racing-red-500">CAR</span> VALUE</span>
        </h2>
        <button
          onClick={() => setInputMode(null)}
          className="text-sm text-dark-400 hover:text-white transition-colors"
        >
          Change Method
        </button>
      </div>

      {/* IMAGE MODE LAYOUT */}
      {inputMode === 'image' && (
        <div className="space-y-6">
          {/* Step 1: Disabled Manufacturer Field (Always Visible in Image Mode) */}
          <div>
            <label htmlFor="manufacturer-image" className="block text-dark-300 mb-2 text-sm">
              Manufacturer
            </label>
            <input
              type="text"
              id="manufacturer-image"
              value="Toyota (Only available option currently)"
              className="input-field opacity-50 cursor-not-allowed"
              disabled
            />
          </div>

          {/* Vehicle Recognition Upload Box */}
          <div>
            <h3 className="text-lg font-racing mb-2 flex items-center">
              <Upload className="w-4 h-4 mr-1 text-racing-red-500" />
              VEHICLE RECOGNITION
            </h3>
            <p className="text-sm text-dark-300 mb-2">
              Upload an image of a Toyota vehicle to automatically identify the model
            </p>
            <p className="text-xs text-dark-400 mb-4">
              Note: Image recognition currently only supports Toyota vehicles.
              After detection, fill in the remaining details to get the price prediction.
            </p>

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

          {/* Step 2: Show detected model and remaining fields ONLY after model is detected */}
          {imageModelDetected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Detected Model Field (Disabled) */}
              <div className="mb-5">
                <label htmlFor="model-detected" className="block text-dark-300 mb-2 text-sm">
                  Detected Model
                </label>
                <input
                  type="text"
                  id="model-detected"
                  value={formData.model}
                  className="input-field opacity-50 cursor-not-allowed"
                  disabled
                />
              </div>

              {/* Remaining Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Year Slider */}
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

                {/* Mileage Input */}
                <div>
                  <label htmlFor="mileage" className="block text-dark-300 mb-2 text-sm flex items-center">
                    <Gauge className="w-4 h-4 mr-1" />
                    Mileage (km) <span className="text-racing-red-500 ml-1">*</span>
                  </label>
                  <input 
                    type="number"
                    id="mileage"
                    name="mileage"
                    value={formData.mileage || ''}
                    onChange={(e) => {
                      onInputChange(e);
                      if (validationErrors.mileage && e.target.value) {
                        setValidationErrors(prev => ({ ...prev, mileage: '' }));
                      }
                    }}
                    className={`input-field ${validationErrors.mileage ? 'border-racing-red-500' : ''}`}
                    min="0"
                    step="1000"
                    disabled={loading}
                    placeholder="Enter mileage"
                    required
                  />
                  {validationErrors.mileage && (
                    <div className="text-racing-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {validationErrors.mileage}
                    </div>
                  )}
                </div>

                {/* Fuel Type */}
                <div>
                  <label htmlFor="fuel_type" className="block text-dark-300 mb-2 text-sm flex items-center">
                    <Fuel className="w-4 h-4 mr-1" />
                    Fuel Type <span className="text-racing-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="fuel_type"
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={onInputChange}
                    className={`input-field ${validationErrors.fuel_type ? 'border-racing-red-500' : ''}`}
                    disabled={loading}
                  >
                    <option value="">Select fuel type</option>
                    {FUEL_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {validationErrors.fuel_type && (
                    <div className="text-racing-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {validationErrors.fuel_type}
                    </div>
                  )}
                </div>

                {/* Transmission */}
                <div>
                  <label htmlFor="transmission" className="block text-dark-300 mb-2 text-sm flex items-center">
                    <Settings className="w-4 h-4 mr-1" />
                    Transmission <span className="text-racing-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={onInputChange}
                    className={`input-field ${validationErrors.transmission ? 'border-racing-red-500' : ''}`}
                    disabled={loading}
                  >
                    <option value="">Select transmission</option>
                    {TRANSMISSIONS.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {validationErrors.transmission && (
                    <div className="text-racing-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {validationErrors.transmission}
                    </div>
                  )}
                </div>

                {/* Body Type */}
                <div>
                  <label htmlFor="body_type" className="block text-dark-300 mb-2 text-sm flex items-center">
                    <CarIcon className="w-4 h-4 mr-1" />
                    Body Type <span className="text-racing-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="body_type"
                    name="body_type"
                    value={formData.body_type}
                    onChange={onInputChange}
                    className={`input-field ${validationErrors.body_type ? 'border-racing-red-500' : ''}`}
                    disabled={loading}
                  >
                    <option value="">Select body type</option>
                    {BODY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {validationErrors.body_type && (
                    <div className="text-racing-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {validationErrors.body_type}
                    </div>
                  )}
                </div>

                {/* Cylinder */}
                <div>
                  <label htmlFor="cylinder" className="block text-dark-300 mb-2 text-sm flex items-center">
                    <CircleDot className="w-4 h-4 mr-1" />
                    Cylinders
                  </label>
                  <input 
                    type="number"
                    id="cylinder"
                    name="cylinder"
                    value={formData.cylinder}
                    onChange={onInputChange}
                    className="input-field"
                    min="2"
                    max="16"
                    disabled={loading}
                  />
                </div>

                {/* Seats */}
                <div>
                  <label htmlFor="seats" className="block text-dark-300 mb-2 text-sm flex items-center">
                    <Armchair className="w-4 h-4 mr-1" />
                    Seats
                  </label>
                  <input 
                    type="number"
                    id="seats"
                    name="seats"
                    value={formData.seats}
                    onChange={onInputChange}
                    className="input-field"
                    min="2"
                    max="9"
                    disabled={loading}
                  />
                </div>

                {/* Future Year */}
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
                  disabled={loading || !canSubmit}
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
            </motion.div>
          )}
        </div>
      )}

      {/* MANUAL MODE LAYOUT */}
      {inputMode === 'manual' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Manufacturer Dropdown */}
              <div>
                <label htmlFor="manufacturer" className="block text-dark-300 mb-2 text-sm">
                  Manufacturer <span className="text-racing-red-500">*</span>
                </label>
                <select 
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleManufacturerChange}
                  className={`input-field ${validationErrors.manufacturer ? 'border-racing-red-500' : ''}`}
                  disabled={loading}
                >
                  <option value="">Select manufacturer</option>
                  {MANUFACTURERS.map(manufacturer => (
                    <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
                  ))}
                </select>
                {validationErrors.manufacturer && (
                  <div className="text-racing-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {validationErrors.manufacturer}
                  </div>
                )}
              </div>

              {/* Model Dropdown - Cascading */}
              <div>
                <label htmlFor="model" className="block text-dark-300 mb-2 text-sm">
                  Model <span className="text-racing-red-500">*</span>
                </label>
                <select 
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={onInputChange}
                  className={`input-field ${validationErrors.model ? 'border-racing-red-500' : ''} ${!formData.manufacturer ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading || !formData.manufacturer}
                >
                  <option value="">
                    {!formData.manufacturer ? 'Select manufacturer first' : 'Select model'}
                  </option>
                  {availableModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
                {validationErrors.model && (
                  <div className="text-racing-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {validationErrors.model}
                  </div>
                )}
              </div>

              {/* Year Slider */}
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

              {/* Mileage Input */}
              <div>
                <label htmlFor="mileage" className="block text-dark-300 mb-2 text-sm flex items-center">
                  <Gauge className="w-4 h-4 mr-1" />
                  Mileage (km) <span className="text-racing-red-500 ml-1">*</span>
                </label>
                <input 
                  type="number"
                  id="mileage"
                  name="mileage"
                  value={formData.mileage || ''}
                  onChange={(e) => {
                    onInputChange(e);
                    if (validationErrors.mileage && e.target.value) {
                      setValidationErrors(prev => ({ ...prev, mileage: '' }));
                    }
                  }}
                  className={`input-field ${validationErrors.mileage ? 'border-racing-red-500' : ''}`}
                  min="0"
                  step="1000"
                  disabled={loading}
                  placeholder="Enter mileage"
                  required
                />
                {validationErrors.mileage && (
                  <div className="text-racing-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {validationErrors.mileage}
                  </div>
                )}
              </div>

              {/* Fuel Type */}
              <div>
                <label htmlFor="fuel_type" className="block text-dark-300 mb-2 text-sm flex items-center">
                  <Fuel className="w-4 h-4 mr-1" />
                  Fuel Type <span className="text-racing-red-500 ml-1">*</span>
                </label>
                <select
                  id="fuel_type"
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={onInputChange}
                  className={`input-field ${validationErrors.fuel_type ? 'border-racing-red-500' : ''}`}
                  disabled={loading}
                >
                  <option value="">Select fuel type</option>
                  {FUEL_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {validationErrors.fuel_type && (
                  <div className="text-racing-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {validationErrors.fuel_type}
                  </div>
                )}
              </div>

              {/* Transmission */}
              <div>
                <label htmlFor="transmission" className="block text-dark-300 mb-2 text-sm flex items-center">
                  <Settings className="w-4 h-4 mr-1" />
                  Transmission <span className="text-racing-red-500 ml-1">*</span>
                </label>
                <select
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={onInputChange}
                  className={`input-field ${validationErrors.transmission ? 'border-racing-red-500' : ''}`}
                  disabled={loading}
                >
                  <option value="">Select transmission</option>
                  {TRANSMISSIONS.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {validationErrors.transmission && (
                  <div className="text-racing-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {validationErrors.transmission}
                  </div>
                )}
              </div>

              {/* Body Type */}
              <div>
                <label htmlFor="body_type" className="block text-dark-300 mb-2 text-sm flex items-center">
                  <CarIcon className="w-4 h-4 mr-1" />
                  Body Type <span className="text-racing-red-500 ml-1">*</span>
                </label>
                <select
                  id="body_type"
                  name="body_type"
                  value={formData.body_type}
                  onChange={onInputChange}
                  className={`input-field ${validationErrors.body_type ? 'border-racing-red-500' : ''}`}
                  disabled={loading}
                >
                  <option value="">Select body type</option>
                  {BODY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {validationErrors.body_type && (
                  <div className="text-racing-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {validationErrors.body_type}
                  </div>
                )}
              </div>

              {/* Cylinder */}
              <div>
                <label htmlFor="cylinder" className="block text-dark-300 mb-2 text-sm flex items-center">
                  <CircleDot className="w-4 h-4 mr-1" />
                  Cylinders
                </label>
                <input 
                  type="number"
                  id="cylinder"
                  name="cylinder"
                  value={formData.cylinder}
                  onChange={onInputChange}
                  className="input-field"
                  min="2"
                  max="16"
                  disabled={loading}
                />
              </div>

              {/* Seats */}
              <div>
                <label htmlFor="seats" className="block text-dark-300 mb-2 text-sm flex items-center">
                  <Armchair className="w-4 h-4 mr-1" />
                  Seats
                </label>
                <input 
                  type="number"
                  id="seats"
                  name="seats"
                  value={formData.seats}
                  onChange={onInputChange}
                  className="input-field"
                  min="2"
                  max="9"
                  disabled={loading}
                />
              </div>

              {/* Future Year */}
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
                disabled={loading || !canSubmit}
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

          <div className="flex items-center justify-center">
            <div className="text-center text-dark-400">
              <CarIcon className="w-24 h-24 mx-auto mb-4 text-dark-600" />
              <p className="text-sm">Fill in the vehicle details to get an accurate price prediction</p>
              <p className="text-xs mt-2 text-dark-500">All required fields are marked with *</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PredictionForm;
