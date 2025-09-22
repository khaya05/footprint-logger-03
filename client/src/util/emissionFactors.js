export const EMISSION_FACTORS = {
  transport: {
    'Drive Car': {
      factor: 0.21,
      unit: 'km',
      description: 'Average petrol car',
    },
    'Bus Ride': { factor: 0.1, unit: 'km', description: 'Public bus' },
    Train: { factor: 0.06, unit: 'km', description: 'Electric train' },
    'Flight Domestic': {
      factor: 0.255,
      unit: 'km',
      description: 'Domestic flight',
    },
    'Flight International': {
      factor: 0.285,
      unit: 'km',
      description: 'International flight',
    },
    Motorcycle: { factor: 0.15, unit: 'km', description: 'Average motorcycle' },
  },
  food: {
    'Eat Beef': { factor: 27.0, unit: 'serving', description: '100g serving' },
    'Eat Chicken': {
      factor: 6.9,
      unit: 'serving',
      description: '100g serving',
    },
    'Eat Pork': { factor: 12.1, unit: 'serving', description: '100g serving' },
    'Eat Fish': { factor: 6.1, unit: 'serving', description: '100g serving' },
    'Eat Vegetables': {
      factor: 2.0,
      unit: 'serving',
      description: '100g serving',
    },
    'Drink Coffee': { factor: 0.7, unit: 'cup', description: 'Medium cup' },
    'Drink Beer': { factor: 1.3, unit: 'bottle', description: '330ml bottle' },
  },
  energy: {
    'Use Electricity': {
      factor: 0.92,
      unit: 'hour',
      description: 'Average household per hour',
    },
    'Electric Heater': {
      factor: 1.5,
      unit: 'hour',
      description: 'Space heater',
    },
    'Air Conditioning': {
      factor: 2.0,
      unit: 'hour',
      description: 'Central AC',
    },
    'Hot Shower': {
      factor: 1.0,
      unit: 'minute',
      description: 'Hot water shower',
    },
    Dishwasher: { factor: 1.44, unit: 'cycle', description: 'Full cycle' },
    'Washing Machine': {
      factor: 1.2,
      unit: 'cycle',
      description: 'Full cycle',
    },
  },
  digital: {
    'Video Streaming': {
      factor: 0.0036,
      unit: 'hour',
      description: 'HD streaming',
    },
    'Video Call': {
      factor: 0.005,
      unit: 'hour',
      description: 'Video conference',
    },
    Gaming: { factor: 0.012, unit: 'hour', description: 'Console gaming' },
  },
};

export const CATEGORIES = [
  {
    value: 'transport',
    label: 'Transportation',
    icon: '🚗',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    value: 'food',
    label: 'Food & Drinks',
    icon: '🍽️',
    color: 'bg-green-100 text-green-800',
  },
  {
    value: 'energy',
    label: 'Energy & Utilities',
    icon: '⚡',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    value: 'digital',
    label: 'Digital Usage',
    icon: '💻',
    color: 'bg-purple-100 text-purple-800',
  },
];

export const getActivityOptions = (formData) => {
  return Object.keys(EMISSION_FACTORS[formData.category] || {}).map((activity) => ({
    value: activity,
    label: activity,
  }));
};

export const getActivityDetails = (formData) => {
  if (!formData.category || !formData.activity) return null;
  return EMISSION_FACTORS[formData.category][formData.activity];
};

export const calculateEmissions = (formData) => {
  const details = getActivityDetails(formData);
  if (!details || !formData.amount) return 0;

  const amount = parseFloat(formData.amount);
  return (amount * details.factor).toFixed(3);
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'NEWEST_FIRST' },
  { value: 'oldest', label: 'OLDEST_FIRST' },
  { value: 'a-z', label: 'ASCENDING' },
  { value: 'z-a', label: 'DESCENDING' },
  { value: 'highest', label: 'HIGH_EMISSIONS' },
  { value: 'lowest', label: 'LOW_EMISSIONS' },
];
