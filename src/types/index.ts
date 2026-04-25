export interface CarDetails {
  manufacturer: string;
  model: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  cylinder: number;
  seats: number;
  future_year: number; // For client-side depreciation calculation only
}

export interface PredictionPayload {
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

export interface PredictionResultType {
  manufacturer: string;
  model: string;
  year: number;
  future_year: number;
  lower_bound: number;
  upper_bound: number;
  predicted_price: number;
}

export interface ImageRecognitionResponse {
  manufacturer: string;
  model: string;
}

export interface ApiPredictionResponse {
  predicted_price_aed: number;
  price_range_low: number;
  price_range_high: number;
}

// Constants for form options
export const MANUFACTURERS = [
  "Audi", "Alfa Romeo", "Ashok Leyland", "BAW", "BMW", "BYD", "Bestune",
  "Cadillac", "Changan", "Chery", "Chevrolet", "Chrysler", "Dodge", "Dongfeng",
  "Exeed", "Ferrari", "Ford", "GAC", "GMC", "Geely", "Genesis", "HONGQI",
  "Haval", "Honda", "Hyundai", "Infiniti", "Isuzu", "Jaguar", "Jeep", "Jetour",
  "Kia", "Lamborghini", "Land Rover", "Lexus", "Lincoln", "Maserati", "Mazda",
  "Mahindra", "Mercedes-Benz", "Mini", "Mitsubishi", "Mitsubishi Fuso", "MG",
  "Morgan", "Nio", "Nissan", "Peugeot", "Porsche", "RAM", "ROX", "Renault",
  "Rolls-Royce", "Smart", "Subaru", "Suzuki", "Tank", "Tata", "Tesla", "Toyota",
  "Volkswagen", "Volvo", "ZX"
].sort();

export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];

export const TRANSMISSIONS = ["Automatic", "Manual"];

export const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Coupe", "Truck"];

// Mock car models mapping - expand as needed
export const CAR_MODELS: Record<string, string[]> = {
  "Bestune": ["T99", "T77", "T55"],
  "Toyota": ["Camry", "Corolla", "Land Cruiser", "RAV4", "Hilux", "Fortuner", "Yaris", "Prado", "Avalon", "Supra"],
  "Honda": ["Accord", "Civic", "CR-V", "Pilot", "HR-V", "City"],
  "Nissan": ["Altima", "Sentra", "Patrol", "X-Trail", "Maxima", "Kicks"],
  "BMW": ["3 Series", "5 Series", "7 Series", "X3", "X5", "X7", "M3", "M5"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "GLS", "A-Class"],
  "Audi": ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "RS6"],
  "Lexus": ["ES", "IS", "LS", "RX", "LX", "NX", "GX"],
  "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade", "Accent"],
  "Kia": ["Optima", "Sportage", "Sorento", "Telluride", "Carnival", "Cerato"],
  "Ford": ["Mustang", "F-150", "Explorer", "Expedition", "Edge", "Escape"],
  "Chevrolet": ["Camaro", "Tahoe", "Suburban", "Silverado", "Malibu", "Trailblazer"],
  "Mazda": ["CX-9", "CX-5", "CX-30", "Mazda3", "Mazda6", "MX-5"],
  "Volkswagen": ["Golf", "Passat", "Tiguan", "Touareg", "Arteon", "ID.4"],
  "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan"],
  "Land Rover": ["Range Rover", "Range Rover Sport", "Discovery", "Defender", "Evoque"],
  "Jaguar": ["F-Pace", "E-Pace", "XE", "XF", "F-Type"],
  "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Gladiator"],
  "Tesla": ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck"],
  "Volvo": ["XC90", "XC60", "XC40", "S90", "S60", "V60"],
  "Genesis": ["G70", "G80", "G90", "GV70", "GV80"],
  "Infiniti": ["Q50", "Q60", "QX50", "QX60", "QX80"],
  "Cadillac": ["Escalade", "CT5", "CT4", "XT5", "XT6"],
  "Lincoln": ["Navigator", "Aviator", "Nautilus", "Corsair"],
  "Maserati": ["Ghibli", "Quattroporte", "Levante", "GranTurismo"],
  "Ferrari": ["Roma", "Portofino", "F8 Tributo", "SF90 Stradale"],
  "Lamborghini": ["Huracán", "Urus", "Aventador"],
  "Rolls-Royce": ["Phantom", "Ghost", "Cullinan", "Wraith"],
  "Alfa Romeo": ["Giulia", "Stelvio", "Tonale"],
  "Mini": ["Cooper", "Countryman", "Clubman"],
  "Subaru": ["Outback", "Forester", "Crosstrek", "WRX", "Legacy"],
  "Mitsubishi": ["Pajero", "Outlander", "ASX", "L200", "Eclipse Cross"],
  "Suzuki": ["Jimny", "Vitara", "Swift", "Baleno"],
  "Renault": ["Duster", "Koleos", "Megane", "Captur"],
  "Peugeot": ["3008", "5008", "2008", "508"],
  "BYD": ["Tang", "Han", "Seal", "Dolphin", "Atto 3"],
  "MG": ["ZS", "HS", "RX5", "5", "6"],
  "Geely": ["Coolray", "Azkarra", "Emgrand"],
  "Chery": ["Tiggo 8", "Tiggo 7", "Tiggo 4", "Arrizo"],
  "Haval": ["H6", "Jolion", "Dargo", "H9"],
  "GMC": ["Yukon", "Sierra", "Terrain", "Acadia"],
  "Dodge": ["Charger", "Challenger", "Durango", "RAM"],
  "Chrysler": ["300", "Pacifica"],
  "RAM": ["1500", "2500", "3500"],
  "Isuzu": ["D-Max", "MU-X"],
  "Nio": ["ES8", "ES6", "ET7", "ET5"],
  "Tank": ["300", "500"],
  "Changan": ["CS75", "CS55", "Uni-K", "Uni-T"],
  "GAC": ["GS8", "GS4", "Empow"],
  "Jetour": ["X70", "X90", "Dashing"],
  "Exeed": ["TXL", "VX", "LX"],
  "HONGQI": ["H9", "HS5", "E-HS9"],
  "Smart": ["Fortwo", "#1", "#3"],
  "Morgan": ["Plus Four", "Plus Six"],
  "Tata": ["Nexon", "Harrier", "Safari"],
  "Mahindra": ["XUV700", "Scorpio", "Thar"],
  "Ashok Leyland": ["Dost", "Partner"],
  "Mitsubishi Fuso": ["Canter", "Fighter"],
  "Dongfeng": ["AX7", "580"],
  "BAW": ["BJ40", "BJ80"],
  "ROX": ["01", "03"],
  "ZX": ["Grand Tiger", "Terralord"]
};
