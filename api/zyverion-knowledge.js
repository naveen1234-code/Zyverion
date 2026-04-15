const LANGUAGE_NAMES = {
  en: "English",
  si: "Sinhala",
  ta: "Tamil",
};

export const ZYVERION_BRAND = {
  name: "Zyverion",
  fullName: "Zyverion Solutions",
  positioning:
    "A premium digital business agency focused on websites, software systems, automation workflows, and operational digital solutions.",
  marketFocus:
    "Businesses that need stronger trust, clearer presentation, more inquiries, smoother operations, or scalable digital systems.",
  operatingStyle: [
    "Structured consultation before serious projects",
    "Scope clarification before major builds",
    "Situation-first recommendations instead of generic website selling",
    "Professional communication, agreements, and phased execution",
    "Support-minded delivery with business practicality",
  ],
  trustSignals: {
    en: [
      "Zyverion operates like a structured business solution provider, not a casual freelancer setup.",
      "Serious projects are guided through consultation, scope clarification, and practical execution planning.",
      "Zyverion supports both customer-facing websites and business-side systems when the situation actually needs more than presentation alone.",
      "The agency is positioned around long-term digital value, not just surface-level design output.",
    ],
    si: [
      "Zyverion කියන්නේ casual freelancer setup එකක් නොව structured business solution provider එකක්.",
      "Serious projects consultation, scope clarification, සහ practical execution planning එක්ක handle කරනවා.",
      "Customer-facing websites වලට අමතරව business-side systems ද situation එකට fit වුනොත් Zyverion විසින් build කරන්න පුළුවන්.",
      "Surface-level design එකකට වඩා long-term digital value එකට focus කරන agency එකක් තමයි Zyverion.",
    ],
    ta: [
      "Zyverion என்பது casual freelancer setup அல்ல, structured business solution provider ஆகும்.",
      "Serious projects consultation, scope clarification, மற்றும் practical execution planning மூலம் handle செய்யப்படும்.",
      "Customer-facing websites மட்டுமல்லாமல், situation சரியானால் business-side systems க்கும் Zyverion உதவ முடியும்.",
      "Surface-level design மட்டும் அல்லாமல் long-term digital value மீது focus செய்யும் agency ஆகும்.",
    ],
  },
};

export const ZYVERION_SERVICE_BUCKETS = [
  {
    id: "business_websites",
    label: "Business Websites",
    summary:
      "Professional presentation websites designed to build trust, explain services clearly, and generate serious inquiries.",
    includes: [
      "Business profile websites",
      "Corporate websites",
      "Service websites",
      "Lead generation sites",
      "Brand trust websites",
      "Company information pages",
    ],
    bestFor: [
      "Companies",
      "Agencies",
      "Service businesses",
      "Professional brands",
      "New businesses that need a strong digital base",
    ],
  },
  {
    id: "ecommerce_and_catalog",
    label: "E-commerce and Catalog Solutions",
    summary:
      "Product-oriented solutions for businesses that need online selling, product showcasing, or structured catalog browsing.",
    includes: [
      "Online stores",
      "Catalog websites",
      "Product detail pages",
      "Order-focused websites",
      "Future-ready storefronts",
    ],
    bestFor: [
      "Retail brands",
      "Fashion",
      "Beauty products",
      "Gift businesses",
      "Product-based businesses",
    ],
  },
  {
    id: "booking_and_service_flows",
    label: "Booking and Service Flow Websites",
    summary:
      "Sites designed to move visitors into bookings, appointments, consultation requests, or service-based inquiries.",
    includes: [
      "Booking websites",
      "Appointment websites",
      "Inquiry-first service websites",
      "Consultation request websites",
      "Lead-capture service flows",
    ],
    bestFor: [
      "Salons",
      "Clinics",
      "Coaches",
      "Consultants",
      "Appointment-based businesses",
    ],
  },
  {
    id: "portals_and_membership",
    label: "Portals and Membership Systems",
    summary:
      "Protected user-side systems for members, clients, students, or repeat-access workflows.",
    includes: [
      "Member portals",
      "Client portals",
      "Student portals",
      "Protected access systems",
      "Account-based dashboards",
    ],
    bestFor: [
      "Gyms",
      "Institutes",
      "Organizations",
      "Subscription businesses",
      "Communities",
    ],
  },
  {
    id: "admin_and_operations",
    label: "Admin and Operations Systems",
    summary:
      "Internal tools for businesses that need stronger workflow handling, records, approvals, admin control, or operational visibility.",
    includes: [
      "Admin dashboards",
      "Record management systems",
      "Lead handling systems",
      "Internal workflow tools",
      "Operations support systems",
      "Reporting and management tools",
    ],
    bestFor: [
      "Growing businesses",
      "Operationally busy companies",
      "Member-based businesses",
      "Businesses with internal staff processes",
      "Businesses replacing manual work",
    ],
  },
  {
    id: "automation_and_process_design",
    label: "Automation and Process Design",
    summary:
      "Workflow and automation thinking that reduces manual handling and improves consistency.",
    includes: [
      "Workflow design",
      "Automation ideas",
      "Operational simplification",
      "Lead handling logic",
      "Process optimization recommendations",
    ],
    bestFor: [
      "Businesses with repetitive manual work",
      "Teams losing time to poor process flow",
      "Companies that need more efficiency",
    ],
  },
];

export const ZYVERION_WEBSITE_TYPES = [
  {
    id: "business_profile",
    name: "Business Profile Website",
    category: "website",
    purpose:
      "Build trust, present the business clearly, explain services, and make it easy for people to contact the brand.",
    bestFor: [
      "Companies",
      "Agencies",
      "Construction",
      "Consultants",
      "Corporate brands",
      "Service providers",
    ],
    whenToRecommend: [
      "The business mainly needs credibility and clarity",
      "A strong first-stage website is enough for now",
      "The project does not clearly require system logic yet",
    ],
    zyverionFit:
      "This fits Zyverion's website design and business presentation services.",
  },
  {
    id: "lead_generation",
    name: "Lead Generation Website",
    category: "website",
    purpose:
      "Turn visitors into inquiries through strong trust, clear service explanation, and conversion-focused flow.",
    bestFor: [
      "Service businesses",
      "Clinics",
      "Real estate",
      "Consultants",
      "Education providers",
      "Agencies",
    ],
    whenToRecommend: [
      "The main goal is more inquiries",
      "The business depends on quotation or consultation requests",
      "The user wants stronger conversion from visitors",
    ],
    zyverionFit:
      "This fits Zyverion's business websites, messaging structure, and lead-flow support.",
  },
  {
    id: "booking_appointment",
    name: "Booking or Appointment Website",
    category: "website",
    purpose:
      "Help visitors understand services and take action through bookings, appointments, or structured requests.",
    bestFor: [
      "Salons",
      "Spas",
      "Clinics",
      "Consultants",
      "Coaches",
      "Service booking businesses",
    ],
    whenToRecommend: [
      "The business works through appointments",
      "Visitors need to request a slot or consultation",
      "The site needs a stronger booking-style flow",
    ],
    zyverionFit:
      "This fits Zyverion's service-flow design and operational website support.",
  },
  {
    id: "ecommerce_store",
    name: "E-commerce Website",
    category: "website",
    purpose:
      "Support product browsing, product detail views, ordering flow, and online selling.",
    bestFor: [
      "Retail brands",
      "Fashion",
      "Beauty",
      "Gift stores",
      "Product businesses",
    ],
    whenToRecommend: [
      "The user sells products directly",
      "The business wants ordering or cart-based browsing",
      "The digital flow is product-first",
    ],
    zyverionFit:
      "This fits Zyverion's e-commerce frontend and storefront solution direction.",
  },
  {
    id: "catalog_showcase",
    name: "Catalog or Product Showcase Website",
    category: "website",
    purpose:
      "Present products cleanly without needing full online checkout from day one.",
    bestFor: [
      "Businesses that want to showcase products first",
      "Brands not ready for full e-commerce yet",
      "Businesses that sell through inquiry or WhatsApp",
    ],
    whenToRecommend: [
      "The user has products but is not ready for full checkout",
      "The business needs presentation plus inquiry flow",
    ],
    zyverionFit:
      "This fits Zyverion's staged build strategy and scalable site planning.",
  },
  {
    id: "portfolio_showcase",
    name: "Portfolio or Visual Showcase Website",
    category: "website",
    purpose:
      "Highlight visual work, projects, samples, and proof of capability to attract serious clients.",
    bestFor: [
      "Designers",
      "Photographers",
      "Architects",
      "Creative studios",
      "Builders of visual work",
    ],
    whenToRecommend: [
      "The business sells through proof of work",
      "The strongest conversion factor is visual trust",
    ],
    zyverionFit:
      "This fits Zyverion's premium presentation and proof-first approach.",
  },
  {
    id: "landing_page",
    name: "Landing Page or Campaign Page",
    category: "website",
    purpose:
      "Support one focused offer, campaign, launch, or conversion action.",
    bestFor: [
      "Promotions",
      "Single offers",
      "Campaigns",
      "Launches",
      "Ad traffic conversion",
    ],
    whenToRecommend: [
      "The business needs one focused conversion flow",
      "The user is running a campaign or single offer",
    ],
    zyverionFit:
      "This fits Zyverion's conversion-focused digital strategy support.",
  },
  {
    id: "membership_portal",
    name: "Membership Portal",
    category: "system",
    purpose:
      "Provide protected member-side access, user-specific information, and structured portal behavior.",
    bestFor: [
      "Gyms",
      "Institutes",
      "Communities",
      "Organizations",
      "Client-account businesses",
    ],
    whenToRecommend: [
      "The business has repeat users or members",
      "Users need login or account access",
      "A public website alone is not enough",
    ],
    zyverionFit:
      "This fits Zyverion's portal, dashboard, and member-system capability.",
  },
  {
    id: "admin_dashboard",
    name: "Admin Dashboard System",
    category: "system",
    purpose:
      "Give the business internal visibility, management controls, record handling, and workflow oversight.",
    bestFor: [
      "Operational businesses",
      "Gyms",
      "Institutes",
      "Service operations",
      "Teams managing records or leads",
    ],
    whenToRecommend: [
      "The business has internal handling pain",
      "Manual work is slowing operations",
      "The user mentions staff-side or admin-side control needs",
    ],
    zyverionFit:
      "This fits Zyverion's software systems and operational solution services.",
  },
  {
    id: "hybrid_website_system",
    name: "Hybrid Website and System Solution",
    category: "hybrid",
    purpose:
      "Combine a public-facing business website with internal or user-side system logic for stronger digital operations.",
    bestFor: [
      "Gyms",
      "Growing businesses",
      "Businesses needing both trust and workflow support",
      "Organizations with public and internal digital needs",
    ],
    whenToRecommend: [
      "The business needs both presentation and operations support",
      "A normal website alone is not enough",
      "The user mentions both customers and internal handling",
    ],
    zyverionFit:
      "This is one of Zyverion's strongest premium directions because it blends digital presence with operational value.",
  },
];

export const ZYVERION_BUSINESS_TYPES = [
  {
    id: "general_service_business",
    name: "General Service Business",
    indicators: [
      "service",
      "services",
      "consulting",
      "agency",
      "business",
      "company",
      "provider",
      "solution",
    ],
    recommendedWebsiteTypes: [
      "business_profile",
      "lead_generation",
      "hybrid_website_system",
    ],
    recommendedGoals: ["trust", "leads", "clarity"],
  },
  {
    id: "gym_fitness",
    name: "Gym or Fitness Business",
    indicators: [
      "gym",
      "fitness",
      "workout",
      "trainer",
      "membership",
      "qr",
      "check in",
      "access control",
    ],
    recommendedWebsiteTypes: [
      "business_profile",
      "membership_portal",
      "admin_dashboard",
      "hybrid_website_system",
    ],
    recommendedGoals: ["trust", "member_management", "operations", "growth"],
  },
  {
    id: "restaurant_cafe",
    name: "Restaurant or Cafe",
    indicators: [
      "restaurant",
      "cafe",
      "coffee",
      "food",
      "menu",
      "dining",
      "takeaway",
      "delivery",
    ],
    recommendedWebsiteTypes: [
      "business_profile",
      "booking_appointment",
      "catalog_showcase",
      "lead_generation",
    ],
    recommendedGoals: ["visibility", "bookings", "trust", "leads"],
  },
  {
    id: "salon_spa_beauty",
    name: "Salon, Spa, or Beauty Business",
    indicators: [
      "salon",
      "spa",
      "beauty",
      "hair",
      "makeup",
      "nails",
      "bridal",
      "skincare",
    ],
    recommendedWebsiteTypes: [
      "booking_appointment",
      "business_profile",
      "portfolio_showcase",
      "lead_generation",
    ],
    recommendedGoals: ["bookings", "trust", "leads"],
  },
  {
    id: "medical_clinic",
    name: "Clinic or Medical Service",
    indicators: [
      "clinic",
      "doctor",
      "medical",
      "hospital",
      "channeling",
      "appointment",
      "health",
      "dental",
    ],
    recommendedWebsiteTypes: [
      "booking_appointment",
      "business_profile",
      "lead_generation",
    ],
    recommendedGoals: ["trust", "bookings", "clarity"],
  },
  {
    id: "education_training",
    name: "Education or Training Business",
    indicators: [
      "school",
      "class",
      "course",
      "academy",
      "tuition",
      "institute",
      "training",
      "student",
    ],
    recommendedWebsiteTypes: [
      "business_profile",
      "lead_generation",
      "membership_portal",
      "hybrid_website_system",
    ],
    recommendedGoals: ["trust", "leads", "member_management", "clarity"],
  },
  {
    id: "ecommerce_retail",
    name: "Retail or Product Business",
    indicators: [
      "shop",
      "store",
      "product",
      "sell",
      "ecommerce",
      "retail",
      "cart",
      "checkout",
    ],
    recommendedWebsiteTypes: [
      "ecommerce_store",
      "catalog_showcase",
      "landing_page",
    ],
    recommendedGoals: ["sales", "visibility", "leads"],
  },
  {
    id: "creative_portfolio",
    name: "Creative or Portfolio-Based Business",
    indicators: [
      "designer",
      "photographer",
      "artist",
      "creative",
      "portfolio",
      "architect",
      "studio",
    ],
    recommendedWebsiteTypes: [
      "portfolio_showcase",
      "business_profile",
      "lead_generation",
    ],
    recommendedGoals: ["trust", "leads", "visibility"],
  },
  {
    id: "construction_real_estate",
    name: "Construction or Real Estate Business",
    indicators: [
      "construction",
      "builder",
      "property",
      "real estate",
      "developer",
      "engineering",
      "interior",
    ],
    recommendedWebsiteTypes: [
      "business_profile",
      "lead_generation",
      "portfolio_showcase",
    ],
    recommendedGoals: ["trust", "leads", "clarity"],
  },
  {
    id: "corporate_professional",
    name: "Corporate or Professional Brand",
    indicators: [
      "corporate",
      "company",
      "firm",
      "professional",
      "legal",
      "finance",
      "accounting",
      "consultancy",
    ],
    recommendedWebsiteTypes: [
      "business_profile",
      "lead_generation",
      "landing_page",
    ],
    recommendedGoals: ["trust", "clarity", "leads"],
  },
];

export const ZYVERION_GOAL_SIGNALS = [
  {
    id: "trust",
    label: "Build trust and credibility",
    indicators: [
      "trust",
      "professional",
      "brand",
      "look serious",
      "credibility",
      "presentation",
      "online presence",
    ],
  },
  {
    id: "leads",
    label: "Get more inquiries or leads",
    indicators: [
      "more customers",
      "more clients",
      "inquiries",
      "leads",
      "messages",
      "contact us",
      "quotation requests",
    ],
  },
  {
    id: "sales",
    label: "Sell products or increase sales",
    indicators: [
      "sell",
      "sales",
      "orders",
      "buy",
      "checkout",
      "cart",
      "products online",
    ],
  },
  {
    id: "bookings",
    label: "Get bookings or appointments",
    indicators: [
      "booking",
      "appointment",
      "reserve",
      "schedule",
      "slots",
      "consultation booking",
    ],
  },
  {
    id: "operations",
    label: "Improve internal operations",
    indicators: [
      "system",
      "dashboard",
      "admin",
      "workflow",
      "manage",
      "records",
      "automation",
      "operations",
      "staff",
    ],
  },
  {
    id: "member_management",
    label: "Handle users, members, or client accounts",
    indicators: [
      "member",
      "members",
      "portal",
      "login",
      "accounts",
      "student access",
      "client access",
    ],
  },
  {
    id: "visibility",
    label: "Improve visibility and awareness",
    indicators: [
      "be visible",
      "online visibility",
      "show online",
      "website presence",
      "awareness",
      "exposure",
    ],
  },
  {
    id: "clarity",
    label: "Explain the business clearly",
    indicators: [
      "explain services",
      "clear information",
      "show what we do",
      "business info",
      "details",
      "service explanation",
    ],
  },
  {
    id: "growth",
    label: "Build a stronger long-term digital base",
    indicators: [
      "grow",
      "scale",
      "long term",
      "future",
      "expand",
      "upgrade later",
      "scalable",
    ],
  },
];

export const ZYVERION_CAPABILITY_SIGNALS = [
  {
    id: "just_website",
    label: "Website only",
    indicators: [
      "just website",
      "website only",
      "simple website",
      "company website",
      "business website",
    ],
  },
  {
    id: "website_plus_system",
    label: "Website plus system",
    indicators: [
      "website and system",
      "dashboard",
      "admin panel",
      "portal",
      "workflow",
      "website plus system",
    ],
  },
  {
    id: "user_accounts",
    label: "User or member accounts",
    indicators: [
      "login",
      "member",
      "members",
      "account",
      "portal",
      "user side",
      "student login",
      "client login",
    ],
  },
  {
    id: "booking_flow",
    label: "Booking or appointment flow",
    indicators: [
      "bookings",
      "appointment",
      "schedule",
      "reserve",
      "booking system",
    ],
  },
  {
    id: "ecommerce",
    label: "Product selling flow",
    indicators: [
      "cart",
      "checkout",
      "sell online",
      "ecommerce",
      "shop",
      "products",
    ],
  },
  {
    id: "admin_tools",
    label: "Admin or staff-side tools",
    indicators: [
      "admin",
      "staff",
      "manage",
      "management system",
      "records",
      "reporting",
      "control panel",
    ],
  },
];

export const ZYVERION_STAGE_SIGNALS = [
  {
    id: "idea_stage",
    label: "Idea or very early stage",
    indicators: [
      "just starting",
      "new business",
      "planning",
      "idea",
      "not launched",
      "starting soon",
    ],
  },
  {
    id: "existing_business",
    label: "Existing business improving presence",
    indicators: [
      "already have business",
      "existing business",
      "running business",
      "already operating",
      "need upgrade",
    ],
  },
  {
    id: "digital_upgrade",
    label: "Digital upgrade or replacement stage",
    indicators: [
      "upgrade",
      "redesign",
      "replace",
      "improve current site",
      "need better system",
      "current system is bad",
    ],
  },
];
const WEBSITE_TYPE_MAP = new Map(
  ZYVERION_WEBSITE_TYPES.map((item) => [item.id, item])
);

const BUSINESS_TYPE_MAP = new Map(
  ZYVERION_BUSINESS_TYPES.map((item) => [item.id, item])
);

const GOAL_SIGNAL_MAP = new Map(
  ZYVERION_GOAL_SIGNALS.map((item) => [item.id, item])
);

const CAPABILITY_SIGNAL_MAP = new Map(
  ZYVERION_CAPABILITY_SIGNALS.map((item) => [item.id, item])
);

const STAGE_SIGNAL_MAP = new Map(
  ZYVERION_STAGE_SIGNALS.map((item) => [item.id, item])
);

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueStrings(values) {
  return Array.from(
    new Set(
      (values || [])
        .filter((item) => typeof item === "string" && item.trim())
        .map((item) => item.trim())
    )
  );
}

function scoreIndicators(text, indicators) {
  const value = normalizeText(text);
  if (!value || !Array.isArray(indicators) || !indicators.length) return 0;

  let score = 0;

  indicators.forEach((indicator) => {
    const clean = normalizeText(indicator);
    if (!clean) return;

    if (value === clean) {
      score += 5;
      return;
    }

    if (value.includes(clean)) {
      score += clean.includes(" ") ? 4 : 2;
    }
  });

  return score;
}

function getBusinessTypeById(id) {
  return BUSINESS_TYPE_MAP.get(id) || BUSINESS_TYPE_MAP.get("general_service_business");
}

function getWebsiteTypeById(id) {
  return WEBSITE_TYPE_MAP.get(id) || null;
}

function getGoalSignalById(id) {
  return GOAL_SIGNAL_MAP.get(id) || null;
}

function getCapabilitySignalById(id) {
  return CAPABILITY_SIGNAL_MAP.get(id) || null;
}

function getStageSignalById(id) {
  return STAGE_SIGNAL_MAP.get(id) || null;
}

function getLanguageName(language) {
  return LANGUAGE_NAMES[language] || LANGUAGE_NAMES.en;
}

function scoreBusinessType(text, businessType) {
  let score = scoreIndicators(text, businessType.indicators || []);

  const normalized = normalizeText(text);

  if (businessType.id === "gym_fitness") {
    if (normalized.includes("member")) score += 2;
    if (normalized.includes("qr")) score += 2;
  }

  if (businessType.id === "ecommerce_retail") {
    if (normalized.includes("product")) score += 2;
    if (normalized.includes("checkout")) score += 2;
  }

  if (businessType.id === "education_training") {
    if (normalized.includes("student")) score += 2;
    if (normalized.includes("course")) score += 2;
  }

  return score;
}

function detectBusinessType(text) {
  const scored = ZYVERION_BUSINESS_TYPES.map((type) => ({
    id: type.id,
    score: scoreBusinessType(text, type),
    type,
  }))
    .sort((a, b) => b.score - a.score);

  const top = scored[0];

  if (!top || top.score <= 0) {
    return getBusinessTypeById("general_service_business");
  }

  return top.type;
}

function detectGoalIds(text, businessType) {
  const value = normalizeText(text);

  const scored = ZYVERION_GOAL_SIGNALS.map((goal) => ({
    id: goal.id,
    score: scoreIndicators(value, goal.indicators || []),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.id);

  const recommended = Array.isArray(businessType?.recommendedGoals)
    ? businessType.recommendedGoals
    : [];

  const boosted = uniqueStrings([
    ...scored,
    ...recommended.filter((goalId) => scored.includes(goalId)),
  ]);

  return boosted.slice(0, 4);
}

function detectCapabilityIds(text, businessType) {
  const value = normalizeText(text);

  const detected = ZYVERION_CAPABILITY_SIGNALS.map((capability) => ({
    id: capability.id,
    score: scoreIndicators(value, capability.indicators || []),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.id);

  const businessTypeId = businessType?.id || "";

  if (
    businessTypeId === "gym_fitness" &&
    (value.includes("member") || value.includes("qr") || value.includes("portal"))
  ) {
    detected.push("website_plus_system", "user_accounts", "admin_tools");
  }

  if (
    businessTypeId === "education_training" &&
    (value.includes("student") || value.includes("portal") || value.includes("login"))
  ) {
    detected.push("user_accounts", "website_plus_system");
  }

  if (
    businessTypeId === "ecommerce_retail" &&
    (value.includes("sell") || value.includes("cart") || value.includes("checkout"))
  ) {
    detected.push("ecommerce");
  }

  return uniqueStrings(detected).slice(0, 4);
}

function detectStageId(text) {
  const scored = ZYVERION_STAGE_SIGNALS.map((stage) => ({
    id: stage.id,
    score: scoreIndicators(text, stage.indicators || []),
  }))
    .sort((a, b) => b.score - a.score);

  const top = scored[0];
  if (!top || top.score <= 0) return "unknown";
  return top.id;
}

function inferIntentMode({ goals, capabilities, stage, text }) {
  const value = normalizeText(text);

  if (
    value.includes("what should i build") ||
    value.includes("what do i need") ||
    value.includes("which website") ||
    value.includes("what kind of website")
  ) {
    return "recommendation";
  }

  if (
    value.includes("price") ||
    value.includes("pricing") ||
    value.includes("cost") ||
    value.includes("budget") ||
    value.includes("estimate")
  ) {
    return "pricing";
  }

  if (!goals.length && !capabilities.length) {
    return "discovery";
  }

  if (stage === "idea_stage" && goals.length <= 1 && capabilities.length === 0) {
    return "discovery";
  }

  if (capabilities.includes("website_plus_system")) {
    return "recommendation";
  }

  if (capabilities.includes("user_accounts") || capabilities.includes("admin_tools")) {
    return "recommendation";
  }

  if (goals.length >= 2) {
    return "recommendation";
  }

  return "discovery";
}

function inferHighIntent({ text, goals, capabilities }) {
  const value = normalizeText(text);

  if (
    value.includes("need now") ||
    value.includes("ready to start") ||
    value.includes("let's build") ||
    value.includes("want to start") ||
    value.includes("contact")
  ) {
    return true;
  }

  if (capabilities.includes("website_plus_system")) return true;
  if (goals.includes("sales") && goals.includes("trust")) return true;
  if (goals.includes("member_management") && capabilities.length > 0) return true;

  return false;
}

function inferUnsureUser({ text, goals, capabilities }) {
  const value = normalizeText(text);

  if (
    value.includes("not sure") ||
    value.includes("don't know") ||
    value.includes("do not know") ||
    value.includes("confused") ||
    value.includes("help me decide")
  ) {
    return true;
  }

  if (!goals.length && !capabilities.length) return true;

  return false;
}
function pickLang(language, en, si, ta) {
  if (language === "si") return si;
  if (language === "ta") return ta;
  return en;
}

function hasGoal(profile, goalId) {
  return Array.isArray(profile?.goals) && profile.goals.includes(goalId);
}

function hasCapability(profile, capabilityId) {
  return (
    Array.isArray(profile?.capabilities) &&
    profile.capabilities.includes(capabilityId)
  );
}

function hasEnoughDetailForRecommendation(profile) {
  if (!profile) return false;

  if (hasCapability(profile, "website_plus_system")) return true;
  if (hasCapability(profile, "user_accounts")) return true;
  if (hasCapability(profile, "admin_tools")) return true;
  if (hasCapability(profile, "booking_flow")) return true;
  if (hasCapability(profile, "ecommerce")) return true;

  if ((profile.goals || []).length >= 2 && !profile.unsureUser) return true;

  if (
    profile.intentMode === "recommendation" &&
    ((profile.goals || []).length > 0 || (profile.capabilities || []).length > 0)
  ) {
    return true;
  }

  return false;
}

function scoreWebsiteTypeForProfile(profile, websiteType) {
  let score = 0;

  if (!profile || !websiteType) return score;

  const businessType = profile.businessTypeId || "general_service_business";

  if ((profile.businessType?.recommendedWebsiteTypes || []).includes(websiteType.id)) {
    score += 4;
  }

  if (websiteType.id === "business_profile") {
    if (hasGoal(profile, "trust")) score += 4;
    if (hasGoal(profile, "clarity")) score += 4;
    if (hasGoal(profile, "visibility")) score += 2;
    if (businessType === "corporate_professional") score += 2;
  }

  if (websiteType.id === "lead_generation") {
    if (hasGoal(profile, "leads")) score += 5;
    if (hasGoal(profile, "trust")) score += 1;
  }

  if (websiteType.id === "booking_appointment") {
    if (hasGoal(profile, "bookings")) score += 5;
    if (hasCapability(profile, "booking_flow")) score += 4;
  }

  if (websiteType.id === "ecommerce_store") {
    if (hasGoal(profile, "sales")) score += 5;
    if (hasCapability(profile, "ecommerce")) score += 5;
  }

  if (websiteType.id === "catalog_showcase") {
    if (hasGoal(profile, "sales")) score += 2;
    if (businessType === "ecommerce_retail") score += 2;
  }

  if (websiteType.id === "portfolio_showcase") {
    if (businessType === "creative_portfolio") score += 4;
    if (hasGoal(profile, "trust")) score += 1;
    if (hasGoal(profile, "visibility")) score += 2;
  }

  if (websiteType.id === "membership_portal") {
    if (hasGoal(profile, "member_management")) score += 5;
    if (hasCapability(profile, "user_accounts")) score += 5;
  }

  if (websiteType.id === "admin_dashboard") {
    if (hasGoal(profile, "operations")) score += 5;
    if (hasCapability(profile, "admin_tools")) score += 5;
  }

  if (websiteType.id === "hybrid_website_system") {
    if (hasCapability(profile, "website_plus_system")) score += 6;
    if (hasCapability(profile, "user_accounts")) score += 3;
    if (hasCapability(profile, "admin_tools")) score += 3;
    if (hasGoal(profile, "member_management")) score += 2;
    if (hasGoal(profile, "operations")) score += 2;
  }

  if (websiteType.id === "landing_page") {
    if (hasGoal(profile, "leads")) score += 2;
    if (hasGoal(profile, "sales")) score += 1;
  }

  return score;
}

function rankWebsiteTypes(profile) {
  if (!profile) return [];

  const enoughDetail = hasEnoughDetailForRecommendation(profile);

  if (!enoughDetail && profile.intentMode === "discovery") {
    return [];
  }

  const scored = ZYVERION_WEBSITE_TYPES.map((websiteType) => ({
    websiteType,
    score: scoreWebsiteTypeForProfile(profile, websiteType),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.websiteType);

  const fallbackIds = Array.isArray(profile.businessType?.recommendedWebsiteTypes)
    ? profile.businessType.recommendedWebsiteTypes
    : [];

  const merged = uniqueStrings([
    ...scored.map((item) => item.id),
    ...fallbackIds,
  ])
    .map((id) => getWebsiteTypeById(id))
    .filter(Boolean);

  return merged.slice(0, enoughDetail ? 3 : 1);
}

function buildServiceBuckets(profile, recommendedWebsiteTypes) {
  const bucketIds = [];

  (recommendedWebsiteTypes || []).forEach((item) => {
    if (!item) return;

    if (
      item.id === "business_profile" ||
      item.id === "lead_generation" ||
      item.id === "portfolio_showcase" ||
      item.id === "landing_page"
    ) {
      bucketIds.push("business_websites");
    }

    if (item.id === "ecommerce_store" || item.id === "catalog_showcase") {
      bucketIds.push("ecommerce_and_catalog");
    }

    if (item.id === "booking_appointment") {
      bucketIds.push("booking_and_service_flows");
    }

    if (item.id === "membership_portal") {
      bucketIds.push("portals_and_membership");
    }

    if (item.id === "admin_dashboard" || item.id === "hybrid_website_system") {
      bucketIds.push("admin_and_operations");
    }
  });

  if (hasGoal(profile, "operations")) {
    bucketIds.push("automation_and_process_design");
  }

  return uniqueStrings(bucketIds)
    .map((id) => ZYVERION_SERVICE_BUCKETS.find((item) => item.id === id))
    .filter(Boolean)
    .slice(0, 3);
}

function buildDiscoveryQuestions(profile, language) {
  const businessTypeId = profile?.businessTypeId || "general_service_business";
  const enoughDetail = hasEnoughDetailForRecommendation(profile);

  if (businessTypeId === "gym_fitness") {
    if (!hasGoal(profile, "leads") && !hasGoal(profile, "member_management")) {
      return [
        pickLang(
          language,
          "Do you mainly want more new members, better current member handling, or both?",
          "ඔයාට වැඩියෙන් ඕනේ new members ගන්න එකද, current members manage කරන එකද, නැත්නම් දෙකමද?",
          "உங்களுக்கு அதிகம் வேண்டியது new members வாங்குவதா, current members manage செய்வதா, அல்லது இரண்டுமா?"
        ),
        pickLang(
          language,
          "Do you need only a website first, or member or admin features too?",
          "ඔයාට website එකක් විතරක් first stage එකට ඕනේද, නැත්නම් member හෝ admin features ද ඕනේ?",
          "உங்களுக்கு website மட்டும் போதுமா, அல்லது member அல்லது admin features வேண்டுமா?"
        ),
      ].slice(0, enoughDetail ? 1 : 2);
    }

    if (hasGoal(profile, "member_management") && !hasCapability(profile, "user_accounts")) {
      return [
        pickLang(
          language,
          "Do you need member login, QR check-in, admin dashboard access, or a full member system?",
          "ඔයාට member login, QR check-in, admin dashboard access, නැත්නම් full member system එකක්ද ඕනේ?",
          "உங்களுக்கு member login, QR check-in, admin dashboard access, அல்லது full member system வேண்டுமா?"
        ),
      ];
    }

    if (hasGoal(profile, "leads") && !hasCapability(profile, "website_plus_system")) {
      return [
        pickLang(
          language,
          "Should the first stage focus on trust and inquiries only, or should it leave room for member features later?",
          "First stage එක trust සහ inquiries වලට focus කරන එකක්ද, නැත්නම් later member features වලට room තියෙන direction එකක්ද?",
          "First stage trust மற்றும் inquiries க்கு மட்டும் focus செய்ய வேண்டுமா, அல்லது later member features க்கும் இடம் இருக்க வேண்டுமா?"
        ),
      ];
    }
  }

  if (businessTypeId === "salon_spa_beauty") {
    return [
      pickLang(
        language,
        "Is the main goal more bookings, stronger visual presentation, or both?",
        "Main goal එක bookings ද, stronger visual presentation ද, නැත්නම් දෙකමද?",
        "Main goal bookings ஆ, stronger visual presentation ஆ, அல்லது இரண்டுமா?"
      ),
    ];
  }

  if (businessTypeId === "restaurant_cafe") {
    return [
      pickLang(
        language,
        "Do you mainly need menu presentation, reservations, online orders, or a mix of those?",
        "ඔයාට වැඩියෙන් ඕනේ menu presentation එකද, reservations ද, online orders ද, නැත්නම් mixed direction එකක්ද?",
        "உங்களுக்கு முக்கியமானது menu presentation ஆ, reservations ஆ, online orders ஆ, அல்லது mixed direction ஆ?"
      ),
    ];
  }

  if (businessTypeId === "medical_clinic") {
    return [
      pickLang(
        language,
        "Do patients mainly need clear information, appointment booking, or both?",
        "Patientsලාට වැඩියෙන් ඕනේ clear information ද, appointment booking ද, නැත්නම් දෙකමද?",
        "Patients க்கு முக்கியமானது clear information ஆ, appointment booking ஆ, அல்லது இரண்டுமா?"
      ),
    ];
  }

  if (businessTypeId === "education_training") {
    return [
      pickLang(
        language,
        "Is the main goal more student inquiries, a student portal, or both?",
        "Main goal එක student inquiries ද, student portal ද, නැත්නම් දෙකමද?",
        "Main goal student inquiries ஆ, student portal ஆ, அல்லது இரண்டுமா?"
      ),
    ];
  }

  if (businessTypeId === "ecommerce_retail") {
    return [
      pickLang(
        language,
        "Do you want full online selling, or do you want to start with product showcase and inquiry flow first?",
        "ඔයාට full online selling එකද ඕනේ, නැත්නම් product showcase + inquiry flow එකෙන් first stage එක start කරන්නද?",
        "உங்களுக்கு full online selling வேண்டுமா, அல்லது product showcase + inquiry flow மூலம் முதலில் தொடங்க வேண்டுமா?"
      ),
    ];
  }

  return [
    pickLang(
      language,
      "What matters most right now: trust, more inquiries, bookings, sales, or system features?",
      "දැනට වැඩියෙන් වැදගත් මොකද්ද: trust ද, more inquiries ද, bookings ද, sales ද, නැත්නම් system features ද?",
      "இப்போது முக்கியமானது என்ன: trust ஆ, more inquiries ஆ, bookings ஆ, sales ஆ, அல்லது system features ஆ?"
    ),
  ];
}

function chooseSuggestedAction(profile, recommendedWebsiteTypes) {
  if (!profile) {
    return { type: "none", label: "", href: "" };
  }

  if (profile.intentMode === "pricing") {
    return {
      type: "estimator",
      label: "Open Estimator",
      href: "estimator.html",
    };
  }

  if (profile.intentMode === "discovery") {
    return { type: "none", label: "", href: "" };
  }

  if (!hasEnoughDetailForRecommendation(profile)) {
    return { type: "none", label: "", href: "" };
  }

  if (profile.highIntent && (recommendedWebsiteTypes || []).length) {
    return {
      type: "contact",
      label: "Contact Zyverion",
      href: "contact.html",
    };
  }

  return { type: "none", label: "", href: "" };
}

function buildConsultationGuidance(profile, language) {
  const businessTypeName = profile?.businessType?.name || "Business";

  return pickLang(
    language,
    `${businessTypeName} situations should be guided by the business need first, then matched to the right website or system direction.`,
    `${businessTypeName} වගේ situations වලදී first business need එක clear කරලා, ඊට පස්සේ right website හෝ system direction එකට match කරන එක තමයි best approach එක.`,
    `${businessTypeName} போன்ற situations இல் first business need ஐ clear பண்ணி, அதன் பிறகு சரியான website அல்லது system direction க்கு match செய்வதே best approach.`
  );
}

function inferSituationProfile(text, { language = "en" } = {}) {
  const businessType = detectBusinessType(text);
  const goals = detectGoalIds(text, businessType);
  const capabilities = detectCapabilityIds(text, businessType);
  const stage = detectStageId(text);

  const profile = {
    language,
    languageName: getLanguageName(language),
    businessTypeId: businessType.id,
    businessType,
    goals,
    capabilities,
    stage,
    intentMode: inferIntentMode({
      goals,
      capabilities,
      stage,
      text,
    }),
    highIntent: inferHighIntent({
      text,
      goals,
      capabilities,
    }),
    unsureUser: inferUnsureUser({
      text,
      goals,
      capabilities,
    }),
  };

  return profile;
}

function buildKnowledgeSnapshot(profile, language) {
  const recommendedWebsiteTypes = rankWebsiteTypes(profile);
  const serviceBuckets = buildServiceBuckets(profile, recommendedWebsiteTypes);
  const discoveryQuestions = buildDiscoveryQuestions(profile, language);
  const suggestedAction = chooseSuggestedAction(profile, recommendedWebsiteTypes);
  const consultationGuidance = buildConsultationGuidance(profile, language);

  return {
    recommendedWebsiteTypes,
    serviceBuckets,
    discoveryQuestions,
    suggestedAction,
    consultationGuidance,
    enoughDetailForRecommendation: hasEnoughDetailForRecommendation(profile),
  };
}

function createBlueprint(text, { language = "en" } = {}) {
  const profile = inferSituationProfile(text, { language });
  const snapshot = buildKnowledgeSnapshot(profile, language);

  return {
    profile,
    snapshot,
  };
}
const OBJECTION_ANSWERS = {
  why_zyverion: {
    en: "Zyverion is built for businesses that need more than a generic website. The approach is to understand the situation first, then recommend the right website or system direction based on actual business needs.",
    si: "Zyverion කියන්නේ generic website එකක් විකුණන setup එකක් නොවේ. First situation එක තේරුම්ගෙන, business need එකට fit වෙන website හෝ system direction එක recommend කරන approach එකක්.",
    ta: "Zyverion என்பது generic website விற்கும் setup அல்ல. முதலில் situation ஐ புரிந்து கொண்டு, business need க்கு பொருந்தும் website அல்லது system direction ஐ recommend செய்வதே இதன் approach.",
  },
  only_websites: {
    en: "No. Zyverion can support business websites, portals, dashboards, workflow systems, and hybrid website-plus-system solutions when the situation needs more than presentation alone.",
    si: "නැහැ. Situation එකට normal presentation එකකට වඩා දේවල් ඕනේ නම්, business websites වලට අමතරව portals, dashboards, workflow systems, සහ hybrid website-plus-system solutions ද Zyverion handle කරන්න පුළුවන්.",
    ta: "இல்லை. Situation க்கு சாதாரண presentation ஐ விட அதிகம் தேவைப்பட்டால், business websites மட்டுமல்லாமல் portals, dashboards, workflow systems, மற்றும் hybrid website-plus-system solutions களையும் Zyverion handle செய்ய முடியும்.",
  },
};

export function createSituationBlueprint(text, { language = "en" } = {}) {
  return createBlueprint(text, { language });
}

export function getTrustLines(language = "en") {
  return ZYVERION_BRAND.trustSignals[language] || ZYVERION_BRAND.trustSignals.en;
}

export function getObjectionAnswer(key, language = "en") {
  const entry = OBJECTION_ANSWERS[key];
  if (!entry) return "";
  return entry[language] || entry.en || "";
}

export function buildSystemKnowledgePrompt(language = "en") {
  const trustLines = getTrustLines(language);
  const serviceNames = ZYVERION_SERVICE_BUCKETS.map((item) => item.label).join(", ");

  return pickLang(
    language,
    `
You are Zyverion AI, a business-focused digital consultation assistant for Zyverion Solutions.

Your job:
- Understand the user's business situation before recommending a solution.
- Keep the guidance inside Zyverion's real scope: websites, e-commerce fronts, portals, dashboards, workflows, automation-minded digital solutions, and hybrid website-plus-system builds.
- Prefer practical consultation over generic marketing language.
- Ask the next specific question when the user has not given enough detail.
- Recommend only when enough detail exists or the user directly asks what they should build.
- Avoid pushing Contact, Work, or Estimator too early.
- Never act like a generic website menu bot.
- Never pretend Zyverion offers unrelated services.

Brand trust context:
${trustLines.map((line) => `- ${line}`).join("\n")}

Service buckets Zyverion operates across:
- ${serviceNames}

Response style:
- Human
- Practical
- Clear
- Slightly premium, but not overdramatic
- Strong on business fit
- Strong on narrowing the next step
`.trim(),
    `
ඔබ Zyverion Solutions සඳහා build කරපු business-focused digital consultation assistant කෙනෙක්.

ඔබගේ job එක:
- First userගේ business situation එක තේරුම් ගන්න.
- Guidance එක Zyverionගේ real scope එක ඇතුළෙ තබා ගන්න: websites, e-commerce fronts, portals, dashboards, workflows, automation-minded digital solutions, සහ hybrid website-plus-system builds.
- Generic marketing language වලට වඩා practical consultation එකට priority දෙන්න.
- Detail මදි නම් next specific question එක අහන්න.
- Enough detail තියෙන වෙලාවට හෝ user direct ලෙස "what should I build" වගේ දෙයක් අහන වෙලාවට විතරක් recommendation දෙන්න.
- Contact, Work, හෝ Estimator ඉක්මනින් push කරන්න එපා.
- Generic website menu bot එකක් වගේ හැසිරෙන්න එපා.
- Zyverion unrelated services දෙනවා වගේ act කරන්න එපා.

Brand trust context:
${trustLines.map((line) => `- ${line}`).join("\n")}

Zyverion වැඩ කරන service buckets:
- ${serviceNames}

Response style:
- Human
- Practical
- Clear
- Slightly premium, but not overdramatic
- Strong on business fit
- Strong on narrowing the next step
`.trim(),
    `
நீங்கள் Zyverion Solutions க்கான business-focused digital consultation assistant.

உங்கள் job:
- முதலில் user இன் business situation ஐ புரிந்துகொள்ள வேண்டும்.
- Guidance ஐ Zyverion இன் real scope குள் வைத்திருக்க வேண்டும்: websites, e-commerce fronts, portals, dashboards, workflows, automation-minded digital solutions, மற்றும் hybrid website-plus-system builds.
- Generic marketing language ஐ விட practical consultation க்கு priority கொடுக்க வேண்டும்.
- Detail போதவில்லை என்றால் next specific question கேட்க வேண்டும்.
- Enough detail இருக்கும் போது அல்லது user நேரடியாக "what should I build" என்று கேட்டால் மட்டுமே recommendation கொடுக்க வேண்டும்.
- Contact, Work, அல்லது Estimator ஐ மிக சீக்கிரம் push செய்யக்கூடாது.
- Generic website menu bot போல நடக்கக்கூடாது.
- Zyverion unrelated services வழங்குகிறது போல நடிக்கக்கூடாது.

Brand trust context:
${trustLines.map((line) => `- ${line}`).join("\n")}

Zyverion செயல்படும் service buckets:
- ${serviceNames}

Response style:
- Human
- Practical
- Clear
- Slightly premium, but not overdramatic
- Strong on business fit
- Strong on narrowing the next step
`.trim()
  );
}