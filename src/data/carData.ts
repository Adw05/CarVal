// Master list of manufacturers supported by the CarVal backend.
export const MANUFACTURERS: string[] = [
  'Bestune', 'Mahindra', 'Haval', 'Ford', 'Smart', 'Maserati', 'Dodge', 'ZX',
  'Infiniti', 'Changan', 'Peugeot', 'HONGQI', 'RAM', 'ROX', 'Audi', 'Nio', 'MG',
  'Lexus', 'Ashok Leyland', 'Jetour', 'Jeep', 'Volvo', 'Cadillac', 'Suzuki',
  'Mitsubishi Fuso', 'Mitsubishi', 'BYD', 'Ferrari', 'Chrysler', 'Isuzu',
  'Exeed', 'GMC', 'Lincoln', 'GAC', 'Honda', 'Morgan', 'Chevrolet', 'Tata',
  'Porsche', 'Alfa Romeo', 'Rolls-Royce', 'Jaguar', 'Tesla', 'Renault', 'Mini',
  'Kia', 'Chery', 'BAW', 'Lamborghini', 'Mercedes-Benz', 'Land Rover', 'Geely',
  'Nissan', 'Genesis', 'Hyundai', 'Subaru', 'Mazda', 'Tank', 'BMW',
  'Volkswagen', 'Toyota', 'Dongfeng',
];

/**
 * A seed dictionary mapping a few brands to their popular models.
 * Brands not present here will fall back to a free-text input so users can
 * still type in any model name. Fill in the rest as needed.
 */
export const MODELS_BY_MANUFACTURER: Record<string, string[]> = {
  Toyota: [
    'Corolla', 'Camry', 'Land Cruiser', 'RAV4', 'Hilux', 'Yaris', 'Prado',
    'Fortuner', 'Highlander', 'Avalon', 'Supra', 'Prius', '86',
  ],
  Honda: [
    'Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot', 'Odyssey', 'City', 'Jazz',
  ],
  Nissan: [
    'Altima', 'Maxima', 'Sentra', 'Patrol', 'X-Trail', 'Sunny', 'Pathfinder',
    'GT-R', 'Z', 'Kicks',
  ],
  BMW: [
    '1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series',
    '7 Series', '8 Series', 'X1', 'X3', 'X5', 'X6', 'X7', 'M3', 'M5', 'i4', 'iX',
  ],
  'Mercedes-Benz': [
    'A-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLC',
    'GLE', 'GLS', 'G-Class', 'AMG GT', 'EQS', 'EQE',
  ],
  Audi: [
    'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'R8',
    'e-tron', 'RS6', 'RS7',
  ],
  Lexus: [
    'IS', 'ES', 'GS', 'LS', 'NX', 'RX', 'GX', 'LX', 'UX', 'LC', 'RC',
  ],
  Ford: [
    'Fiesta', 'Focus', 'Fusion', 'Mustang', 'Edge', 'Explorer', 'Expedition',
    'F-150', 'Ranger', 'Bronco', 'EcoSport',
  ],
  Chevrolet: [
    'Spark', 'Cruze', 'Malibu', 'Impala', 'Camaro', 'Corvette', 'Trax',
    'Equinox', 'Traverse', 'Tahoe', 'Suburban', 'Silverado',
  ],
  Hyundai: [
    'Accent', 'Elantra', 'Sonata', 'Azera', 'Veloster', 'Kona', 'Tucson',
    'Santa Fe', 'Palisade', 'Ioniq 5', 'Ioniq 6',
  ],
  Kia: [
    'Picanto', 'Rio', 'Cerato', 'K5', 'Stinger', 'Soul', 'Seltos', 'Sportage',
    'Sorento', 'Telluride', 'EV6',
  ],
  Tesla: ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck', 'Roadster'],
  Porsche: [
    '911', 'Cayman', 'Boxster', 'Panamera', 'Macan', 'Cayenne', 'Taycan',
  ],
};

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'] as const;
export const TRANSMISSIONS = ['Automatic', 'Manual'] as const;
export const BODY_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Truck'] as const;
