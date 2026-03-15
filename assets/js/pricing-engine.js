const ZyverionPricing = {
  locationMultiplier: {
    sri_lanka: 1,
    international: 2.2
  },

  basePrices: {
    landing: 22000,
    business: 35000,
    ecommerce: 65000,
    booking: 50000
  },

  pagePrices: {
    "1-3": 0,
    "4-6": 7000,
    "7-10": 12000,
    "10+": 20000
  },

  features: {
    contact: 4000,
    booking_system: 15000,
    payment_gateway: 15000,
    admin_dashboard: 18000,
    seo_setup: 4000,
    analytics: 2500
  },

  aiLevels: {
    chatbot: 12000,
    assistant: 25000,
    custom_ai: 50000
  },

  timelineFees: {
    normal: 0,
    fast: 10000,
    urgent: 20000
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

  if (data.features && Array.isArray(data.features)) {
    data.features.forEach((feature) => {
      total += ZyverionPricing.features[feature] || 0;
    });
  }

  if (data.aiLevel) {
    total += ZyverionPricing.aiLevels[data.aiLevel] || 0;
  }

  total += ZyverionPricing.timelineFees[data.timeline] || 0;

  total = total * locationFactor;

  const min = Math.round(total * 0.88);
  const max = Math.round(total * 1.12);

  return {
    min,
    max,
    currency: data.location === "international" ? "USD" : "LKR"
  };
}

export { calculateProjectEstimate };