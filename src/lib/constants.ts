export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/meal-plans', label: 'Meal Plans' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/dashboard', label: 'Dashboard' },
];

export const FOOTER_LINKS = {
  'Legal': [
    { href: '/terms-and-conditions', label: 'Terms and Conditions' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/return-policy', label: 'Return Policy' },
    { href: '/cooking-policy', label: 'Cooking Policy' },
  ],
  'Company': [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ]
};

export const COMPANY_INFO = {
  name: 'RISEWYNN LIMITED',
  number: '15799659',
  address: 'Academy House, 11 Dunraven Place, Bridgend, Mid Glamorgan, United Kingdom, CF31 1JF',
  contact: {
    name: 'Marika FARAONE',
    phone: '+44 7457 423001',
    email: 'info@qellum.co.uk',
  }
};

export const TOKEN_PACKAGES = [
  {
    id: 'sprout',
    name: 'Sprout',
    tokens: 500,
    priceGBP: 5.00,
    description: 'A great start to explore basic AI meal plans.',
    bonus: null,
  },
  {
    id: 'gourmet',
    name: 'Gourmet',
    tokens: 1200,
    priceGBP: 10.00,
    description: 'Perfect for regular users, with added flexibility.',
    bonus: '20% bonus tokens',
  },
  {
    id: 'epicurean',
    name: 'Epicurean',
    tokens: 3000,
    priceGBP: 20.00,
    description: 'The best value for a full culinary experience.',
    bonus: '50% bonus tokens',
  }
];

export const GBP_TO_EUR_RATE = 1.18;

export const TOKEN_COSTS = {
  AI_PLAN_BASE: 10,
  AI_PLAN_PER_DAY: 10,
  AI_OPTIONS: {
    ACTIVITY_LEVEL: 5,
    CALORIE_METHOD: 5,
    PROTEIN_TARGET: 5,
    MEAL_STRUCTURE: 5,
    DIET_TYPE: 5,
  },
  CHEF_PLAN: 500,
};

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
  { value: 'lightly_active', label: 'Lightly Active (light exercise/sports 1-3 days/week)' },
  { value: 'moderately_active', label: 'Moderately Active (moderate exercise/sports 3-5 days/week)' },
  { value: 'very_active', label: 'Very Active (hard exercise/sports 6-7 days a week)' },
  { value: 'extra_active', label: 'Extra Active (very hard exercise/sports & physical job)' },
];

export const CALORIE_METHODS = [
  { value: 'auto', label: 'Auto Calculate (based on profile)' },
  { value: 'maintain', label: 'Maintain Weight' },
  { value: 'lose', label: 'Weight Loss (20% deficit)' },
  { value: 'gain', label: 'Weight Gain (20% surplus)' },
];

export const PROTEIN_TARGETS = [
  { value: 'standard', label: 'Standard (0.8g per kg bodyweight)' },
  { value: 'moderate', label: 'Moderate (1.2g per kg bodyweight)' },
  { value: 'high', label: 'High (1.6g per kg bodyweight - for muscle gain)' },
  { value: 'extra_high', label: 'Extra High (2.2g per kg bodyweight - for athletes)' },
];

export const MEAL_STRUCTURES = [
    { value: '3_meals', label: '3 Meals' },
    { value: '3_meals_1_snack', label: '3 Meals + 1 Snack' },
    { value: '3_meals_2_snacks', label: '3 Meals + 2 Snacks' },
    { value: '5_small_meals', label: '5 Small Meals' },
    { value: 'intermittent_fasting_16_8', label: 'Intermittent Fasting (16:8)' },
];

export const DIET_TYPES = [
  { value: 'none', label: 'None / Standard' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'pescetarian', label: 'Pescetarian' },
  { value: 'keto', label: 'Ketogenic' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'low_fodmap', label: 'Low-FODMAP' },
  { value: 'gluten_free', label: 'Gluten-Free' },
  { value: 'dairy_free', label: 'Dairy-Free' },
];
