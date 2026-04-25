import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  PlusCircle,
  Gauge,
  Car as CarIcon,
  Upload,
  Image as ImageIcon,
  PenSquare,
  AlertCircle,
  Fuel,
  Settings,
  Users,
  Cog,
  Layers,
} from 'lucide-react';
import Dropzone from 'react-dropzone';
import { CarDetails, InputMode } from '../types';
import {
  MANUFACTURERS,
  MODELS_BY_MANUFACTURER,
  FUEL_TYPES,
  TRANSMISSIONS,
  BODY_TYPES,
} from '../data/carData';

interface PredictionFormProps {
  inputMode: InputMode;
  formData: CarDetails;
  uploadedImage: string | null;
  loading: boolean;
  onModeChange: (mode: InputMode) => void;
  onFormDataChange: (updates: Partial<CarDetails>) => void;
  onSubmit: () => void;
  onImageUpload: (file: File) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({
  inputMode,
  formData,
  uploadedImage,
  loading,
  onModeChange,
  onFormDataChange,
  onSubmit,
  onImageUpload,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // ── Mode picker ────────────────────────────────────────────────────────
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
            type="button"
            onClick={() => onModeChange('manual')}
            className="p-8 rounded-lg bg-dark-800 hover:bg-dark-700 transition-all duration-300 flex flex-col items-center gap-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PenSquare className="w-12 h-12 text-racing-red-500" />
            <div>
              <h3 className="text-lg font-racing mb-2">MANUAL ENTRY</h3>
              <p className="text-sm text-dark-300">
                Enter vehicle details manually
              </p>
            </div>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => onModeChange('image')}
            className="p-8 rounded-lg bg-dark-800 hover:bg-dark-700 transition-all duration-300 flex flex-col items-center gap-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ImageIcon className="w-12 h-12 text-racing-red-500" />
            <div>
              <h3 className="text-lg font-racing mb-2">IMAGE RECOGNITION</h3>
              <p className="text-sm text-dark-300">
                Upload a photo of your vehicle
              </p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  const availableModels = useMemo(() => {
    if (!formData.manufacturer) return [];
    return MODELS_BY_MANUFACTURER[formData.manufacturer] ?? [];
  }, [formData.manufacturer]);

  const hasModelDictionary = availableModels.length > 0;
  const isImageMode = inputMode === 'image';
  const showFullForm = inputMode === 'manual' || (isImageMode && !!formData.model);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.manufacturer) errs.manufacturer = 'Select a manufacturer';
    if (!formData.model) errs.model = 'Select or enter a model';
    if (!formData.mileage && formData.mileage !== 0)
      errs.mileage = 'Please enter the mileage to proceed';
    if (!formData.fuel_type) errs.fuel_type = 'Select a fuel type';
    if (!formData.transmission) errs.transmission = 'Select a transmission';
    if (!formData.body_type) errs.body_type = 'Select a body type';
    if (!formData.cylinder) errs.cylinder = 'Enter cylinder count';
    if (!formData.seats) errs.seats = 'Enter seat count';
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit();
  };

  const handleImageDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setValidationErrors({});
    onImageUpload(acceptedFiles[0]);
  };

  const futureYears = Array.from({ length: 6 }, (_, i) => 2025 + i);

  // ── Active form view ───────────────────────────────────────────────────
  return (
    <motion.div
      className="glass-card p-6 md:p-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-racing flex items-center">
          <CarIcon className="mr-2 text-racing-red-500" />
          <span>
            PREDICT <span className="text-racing-red-500">VEHICLE</span> VALUE
          </span>
        </h2>
        <button
          type="button"
          onClick={() => onModeChange(null)}
          className="text-sm text-dark-400 hover:text-white transition-colors"
        >
          Change Method
        </button>
      </div>

      {/* IMAGE MODE: image-first flow ===================================== */}
      {isImageMode && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-dark-300 mb-2 text-sm">
                Manufacturer
              </label>
              <div className="input-field opacity-75 cursor-not-allowed bg-dark-700/50">
                Toyota (Only available option currently)
              </div>
            </div>

            <div>
              <label className="block text-dark-300 mb-2 text-sm">
                Detected Model
              </label>
              <div className="input-field bg-dark-700/30 text-white">
                {formData.model || 'Awaiting image upload…'}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-racing mb-2 flex items-center">
              <Upload className="w-4 h-4 mr-1 text-racing-red-500" />
              VEHICLE RECOGNITION
            </h3>
            <p className="text-sm text-dark-300 mb-4">
              Upload an image of your vehicle to automatically identify the
              model.
            </p>

            <Dropzone
              onDrop={handleImageDrop}
              accept={{ 'image/*': [] }}
              disabled={loading}
              multiple={false}
            >
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 h-64 flex items-center justify-center ${
                    isDragActive
                      ? 'border-racing-red-500 bg-racing-red-900/20'
                      : 'border-dark-700 hover:border-racing-red-600'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input {...getInputProps()} disabled={loading} />

                  {uploadedImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={uploadedImage || '/placeholder.svg'}
                        alt="Uploaded vehicle"
                        className="w-full h-full object-contain"
                      />
                      {loading && (
                        <div className="absolute inset-0 bg-dark-900/70 flex items-center justify-center">
                          <div className="text-white text-sm">
                            Analyzing image…
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-dark-400">
                      {isDragActive ? (
                        <p>Drop the image here…</p>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto mb-2 text-racing-red-500" />
                          <p>Drag &amp; drop an image here, or click to select</p>
                          <p className="text-xs mt-2 text-dark-500">
                            JPG, PNG or WebP format
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
      )}

      {/* MANUAL MODE: manufacturer + cascading model ===================== */}
      {inputMode === 'manual' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
          <div>
            <label
              htmlFor="manufacturer"
              className="block text-dark-300 mb-2 text-sm"
            >
              Manufacturer
            </label>
            <select
              id="manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={e =>
                onFormDataChange({ manufacturer: e.target.value, model: '' })
              }
              className={`input-field ${
                validationErrors.manufacturer ? 'border-racing-red-500' : ''
              }`}
              disabled={loading}
            >
              <option value="">Select a manufacturer</option>
              {MANUFACTURERS.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {validationErrors.manufacturer && (
              <FieldError message={validationErrors.manufacturer} />
            )}
          </div>

          <div>
            <label htmlFor="model" className="block text-dark-300 mb-2 text-sm">
              Model
            </label>
            {hasModelDictionary ? (
              <select
                id="model"
                name="model"
                value={formData.model}
                onChange={e => onFormDataChange({ model: e.target.value })}
                className={`input-field ${
                  validationErrors.model ? 'border-racing-red-500' : ''
                }`}
                disabled={loading || !formData.manufacturer}
              >
                <option value="">
                  {formData.manufacturer
                    ? 'Select a model'
                    : 'Select a manufacturer first'}
                </option>
                {availableModels.map(model => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="model"
                name="model"
                type="text"
                placeholder={
                  formData.manufacturer
                    ? 'Enter model name'
                    : 'Select a manufacturer first'
                }
                value={formData.model}
                onChange={e => onFormDataChange({ model: e.target.value })}
                className={`input-field ${
                  validationErrors.model ? 'border-racing-red-500' : ''
                }`}
                disabled={loading || !formData.manufacturer}
              />
            )}
            {validationErrors.model && (
              <FieldError message={validationErrors.model} />
            )}
          </div>
        </div>
      )}

      {/* SHARED: rest of the form (revealed only when allowed) =========== */}
      {showFullForm && (
        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Year slider */}
            <div className="md:col-span-2">
              <label
                htmlFor="year"
                className="text-dark-300 mb-2 text-sm flex items-center"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Manufacturing Year
              </label>
              <input
                type="range"
                id="year"
                name="year"
                min={1990}
                max={2026}
                value={formData.year}
                onChange={e =>
                  onFormDataChange({ year: Number(e.target.value) })
                }
                className="w-full"
                disabled={loading}
              />
              <div className="flex justify-between text-sm text-dark-400 mt-1">
                <span>1990</span>
                <span className="text-white font-semibold">{formData.year}</span>
                <span>2026</span>
              </div>
            </div>

            {/* Mileage */}
            <div>
              <label
                htmlFor="mileage"
                className="text-dark-300 mb-2 text-sm flex items-center"
              >
                <Gauge className="w-4 h-4 mr-1" />
                Mileage (km){' '}
                <span className="text-racing-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                min={0}
                step={1000}
                value={formData.mileage}
                onChange={e =>
                  onFormDataChange({
                    mileage: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className={`input-field ${
                  validationErrors.mileage ? 'border-racing-red-500' : ''
                }`}
                disabled={loading}
                placeholder="Enter mileage"
              />
              {validationErrors.mileage && (
                <FieldError message={validationErrors.mileage} />
              )}
            </div>

            {/* Fuel Type */}
            <div>
              <label
                htmlFor="fuel_type"
                className="text-dark-300 mb-2 text-sm flex items-center"
              >
                <Fuel className="w-4 h-4 mr-1" />
                Fuel Type
              </label>
              <select
                id="fuel_type"
                name="fuel_type"
                value={formData.fuel_type}
                onChange={e =>
                  onFormDataChange({
                    fuel_type: e.target.value as CarDetails['fuel_type'],
                  })
                }
                className={`input-field ${
                  validationErrors.fuel_type ? 'border-racing-red-500' : ''
                }`}
                disabled={loading}
              >
                <option value="">Select fuel type</option>
                {FUEL_TYPES.map(f => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              {validationErrors.fuel_type && (
                <FieldError message={validationErrors.fuel_type} />
              )}
            </div>

            {/* Transmission */}
            <div>
              <label
                htmlFor="transmission"
                className="text-dark-300 mb-2 text-sm flex items-center"
              >
                <Settings className="w-4 h-4 mr-1" />
                Transmission
              </label>
              <select
                id="transmission"
                name="transmission"
                value={formData.transmission}
                onChange={e =>
                  onFormDataChange({
                    transmission: e.target
                      .value as CarDetails['transmission'],
                  })
                }
                className={`input-field ${
                  validationErrors.transmission ? 'border-racing-red-500' : ''
                }`}
                disabled={loading}
              >
                <option value="">Select transmission</option>
                {TRANSMISSIONS.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {validationErrors.transmission && (
                <FieldError message={validationErrors.transmission} />
              )}
            </div>

            {/* Body Type */}
            <div>
              <label
                htmlFor="body_type"
                className="text-dark-300 mb-2 text-sm flex items-center"
              >
                <Layers className="w-4 h-4 mr-1" />
                Body Type
              </label>
              <select
                id="body_type"
                name="body_type"
                value={formData.body_type}
                onChange={e =>
                  onFormDataChange({
                    body_type: e.target.value as CarDetails['body_type'],
                  })
                }
                className={`input-field ${
                  validationErrors.body_type ? 'border-racing-red-500' : ''
                }`}
                disabled={loading}
              >
                <option value="">Select body type</option>
                {BODY_TYPES.map(b => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {validationErrors.body_type && (
                <FieldError message={validationErrors.body_type} />
              )}
            </div>

            {/* Cylinders */}
            <div>
              <label
                htmlFor="cylinder"
                className="text-dark-300 mb-2 text-sm flex items-center"
              >
                <Cog className="w-4 h-4 mr-1" />
                Cylinders
              </label>
              <input
                type="number"
                id="cylinder"
                name="cylinder"
                min={2}
                max={16}
                value={formData.cylinder}
                onChange={e =>
                  onFormDataChange({
                    cylinder:
                      e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className={`input-field ${
                  validationErrors.cylinder ? 'border-racing-red-500' : ''
                }`}
                disabled={loading}
                placeholder="2 - 16"
              />
              {validationErrors.cylinder && (
                <FieldError message={validationErrors.cylinder} />
              )}
            </div>

            {/* Seats */}
            <div>
              <label
                htmlFor="seats"
                className="text-dark-300 mb-2 text-sm flex items-center"
              >
                <Users className="w-4 h-4 mr-1" />
                Seats
              </label>
              <input
                type="number"
                id="seats"
                name="seats"
                min={2}
                max={9}
                value={formData.seats}
                onChange={e =>
                  onFormDataChange({
                    seats:
                      e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className={`input-field ${
                  validationErrors.seats ? 'border-racing-red-500' : ''
                }`}
                disabled={loading}
                placeholder="2 - 9"
              />
              {validationErrors.seats && (
                <FieldError message={validationErrors.seats} />
              )}
            </div>

            {/* Prediction Year */}
            <div className="md:col-span-2">
              <label
                htmlFor="future_year"
                className="text-dark-300 mb-2 text-sm flex items-center"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Prediction Year
              </label>
              <select
                id="future_year"
                name="future_year"
                value={formData.future_year}
                onChange={e =>
                  onFormDataChange({ future_year: Number(e.target.value) })
                }
                className="input-field"
                disabled={loading}
              >
                {futureYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn-primary w-full flex justify-center items-center"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing…
              </>
            ) : (
              'Calculate Price'
            )}
          </motion.button>
        </form>
      )}
    </motion.div>
  );
};

const FieldError: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-racing-red-500 text-sm mt-1 flex items-center">
    <AlertCircle className="w-3 h-3 mr-1" />
    {message}
  </div>
);

export default PredictionForm;
