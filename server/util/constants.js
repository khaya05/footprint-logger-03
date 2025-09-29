export const CATEGORY_TYPES = ['transport', 'food', 'energy', 'digital']

export const TIPS = {
  transport: [
    "Try cycling twice this week instead of driving — save about 2kg CO₂.",
    "Use public transport once to cut your emissions.",
    "Combine errands into one trip to reduce driving.",
    "Try walking for trips under 1km this week."
  ],
  food: [
    "Replace one meat meal with a veggie meal — save ~1.5kg CO₂.",
    "Eat local produce this week to reduce transport emissions.",
    "Try meal planning to reduce food waste.",
    "Choose seasonal vegetables for lower carbon footprint."
  ],
  energy: [
    "Turn off lights for an hour a day — small habits add up.",
    "Unplug devices when not in use to cut phantom energy.",
    "Lower your thermostat by 1°C this week.",
    "Air dry clothes instead of using the dryer twice this week."
  ],
  digital: [
    "Stream in standard definition once this week — save data & CO₂.",
    "Clean up unused files in the cloud to lower server impact.",
    "Reduce video calls by 30 minutes this week.",
    "Delete old photos and videos from cloud storage."
  ]
};

export const TREND_TIPS = {
  transport: {
    up: 'Your transport emissions increased this week. Try combining trips or using public transport.',
    down: 'Great job reducing transport emissions! Keep up the good work.',
    stable:
      'Consider cycling or walking for short trips to reduce transport emissions.',
  },
  energy: {
    up: 'Energy usage is up this week. Try unplugging devices when not in use.',
    down: "Excellent energy conservation this week! You're making a difference.",
    stable: 'Lower your thermostat by 1°C to save energy and emissions.',
  },
  food: {
    up: 'Food emissions increased. Consider more plant-based meals this week.',
    down: 'Your food choices are getting more sustainable. Keep it up!',
    stable: 'Try meal planning to reduce food waste and emissions.',
  },
  digital: {
    up: 'Digital emissions are higher this week. Consider reducing streaming time.',
    down: 'Nice work reducing your digital footprint this week!',
    stable:
      'Clean up cloud storage to reduce your digital carbon footprint.',
  },
};