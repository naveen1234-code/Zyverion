const ZyverionPricing = {

  locationMultiplier: {
    sri_lanka: 1,
    international: 3
  },

  basePrices: {
    landing: 30000,
    business: 45000,
    ecommerce: 85000,
    booking: 75000
  },

  pagePrices: {
    "1-3": 0,
    "4-6": 10000,
    "7-10": 20000,
    "10+": 35000
  },

  features: {
    contact: 5000,
    booking_system: 25000,
    payment_gateway: 20000,
    admin_dashboard: 30000,
    seo_setup: 10000,
    analytics: 5000
  },

  aiLevels: {
    chatbot: 20000,
    assistant: 45000,
    custom_ai: 90000
  },

  timelineMultiplier: {
    normal: 1,
    fast: 1.2,
    urgent: 1.4
  }

};

function calculateProjectEstimate(data) {

  let total = 0;

  const locationFactor =
    ZyverionPricing.locationMultiplier[data.location] || 1;

  const base =
    ZyverionPricing.basePrices[data.websiteType] || 0;

  total += base;

  total += ZyverionPricing.pagePrices[data.pages] || 0;

  if (data.features) {
    data.features.forEach(feature => {
      total += ZyverionPricing.features[feature] || 0;
    });
  }

  if (data.aiLevel) {
    total += ZyverionPricing.aiLevels[data.aiLevel] || 0;
  }

  total = total * locationFactor;

  const timelineFactor =
    ZyverionPricing.timelineMultiplier[data.timeline] || 1;

  total = total * timelineFactor;

  const min = Math.round(total * 0.9);
  const max = Math.round(total * 1.1);

  return {
    min,
    max,
    currency: data.location === "international" ? "USD" : "LKR"
  };

}

export { calculateProjectEstimate };