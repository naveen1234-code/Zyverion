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
    "Businesses that need stronger trust, better presentation, more inquiries, smoother operations, or scalable digital systems.",
  operatingStyle: [
    "Structured consultation before serious projects",
    "Scope clarification before major builds",
    "Solution-first recommendations rather than generic website selling",
    "Professional communication, agreements, and phased execution",
    "Support-minded delivery with business practicality",
  ],
  trustSignals: {
    en: [
      "Zyverion operates like a structured business solution provider, not a casual freelancer setup.",
      "Serious projects are guided through consultation, scope clarification, and proper execution planning.",
      "Zyverion supports both customer-facing websites and business-side systems or workflows when needed.",
      "The agency is positioned around long-term digital value, not just quick visual design.",
    ],
    si: [
      "Zyverion කියන්නේ casual freelancer setup එකක් නොව structured business solution provider එකක්.",
      "Serious projects consultation, scope clarification, සහ proper execution planning එක්ක handle කරනවා.",
      "Customer-facing websites වලට අමතරව business-side systems සහ workflows ද Zyverion විසින් build කරන්න පුළුවන්.",
      "Quick design එකකට වඩා long-term digital value එකට focus කරන agency එකක් තමයි Zyverion.",
    ],
    ta: [
      "Zyverion என்பது casual freelancer setup அல்ல, structured business solution provider ஆகும்.",
      "Serious projects consultation, scope clarification, மற்றும் proper execution planning மூலம் handle செய்யப்படும்.",
      "Customer-facing websites மட்டுமல்லாமல் business-side systems மற்றும் workflows க்கும் Zyverion உதவ முடியும்.",
      "Quick design மட்டும் அல்லாமல் long-term digital value மீது focus செய்யும் agency ஆகும்.",
    ],
  },
};

export const ZYVERION_SERVICE_BUCKETS = [
  {
    id: "business_websites",
    label: "Business Websites",
    summary:
      "Professional presentation websites designed to build trust, explain services clearly, and create business inquiries.",
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
      "New businesses that need a strong digital presence",
    ],
  },
  {
    id: "ecommerce_and_catalog",
    label: "E-commerce and Catalog Solutions",
    summary:
      "Product-oriented experiences for businesses that need online selling, product showcasing, or structured catalog browsing.",
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
      "Any product-based business",
    ],
  },
  {
    id: "booking_and_service_flows",
    label: "Booking and Service Flow Websites",
    summary:
      "Sites designed to convert visitors into bookings, requests, appointments, or service-based inquiries.",
    includes: [
      "Booking websites",
      "Appointment websites",
      "Inquiry-first service websites",
      "Consultation request websites",
      "Lead capture service flows",
    ],
    bestFor: [
      "Salons",
      "Clinics",
      "Coaches",
      "Service providers",
      "Professional appointment-based businesses",
    ],
  },
  {
    id: "portals_and_membership",
    label: "Portals and Membership Systems",
    summary:
      "Protected user-side systems for members, clients, students, or internal access flows.",
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
      "Internal tools for businesses that need better workflow handling, records, approvals, admin control, or operational visibility.",
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
      "Workflow thinking and automation-focused solutions that reduce manual handling and improve consistency.",
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
      "The user needs credibility first",
      "The business mainly needs presentation and trust",
      "The user is early-stage and does not need a complex system yet",
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
      "The business depends on consultation or quotation requests",
      "The user wants to improve conversion from visitors",
    ],
    zyverionFit:
      "This fits Zyverion's business websites, messaging structure, and digital lead flow services.",
  },
  {
    id: "booking_appointment",
    name: "Booking or Appointment Website",
    category: "website",
    purpose:
      "Help visitors understand services and take action through bookings, appointments, or service requests.",
    bestFor: [
      "Salons",
      "Spas",
      "Clinics",
      "Consultants",
      "Coaching businesses",
      "Service booking businesses",
    ],
    whenToRecommend: [
      "The business works on appointments",
      "Visitors need to request a slot or consultation",
      "The user needs more structured service conversion",
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
      "The user sells products",
      "The user wants direct ordering or cart-based browsing",
      "The business needs product-first digital flow",
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
      "The business mainly needs presentation plus inquiry flow",
    ],
    zyverionFit:
      "This fits Zyverion's staged build strategy and scalable site planning.",
  },
  {
    id: "portfolio_showcase",
    name: "Portfolio or Visual Showcase Website",
    category: "website",
    purpose:
      "Highlight visual work, projects, samples, and capability to attract serious clients.",
    bestFor: [
      "Designers",
      "Photographers",
      "Architects",
      "Creative studios",
      "Builders of visual work",
    ],
    whenToRecommend: [
      "The business sells through proof of work",
      "The strongest conversion factor is visual credibility",
    ],
    zyverionFit:
      "This fits Zyverion's premium presentation and trust-building approach.",
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
      "The user is running a campaign or a single offer",
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
      "Users need login or account-based access",
      "The site needs more than public presentation",
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
      "Organizations with public + internal digital needs",
    ],
    whenToRecommend: [
      "The business needs both presentation and operation support",
      "A normal website alone is not enough",
      "The user mentions both customers and internal handling",
    ],
    zyverionFit:
      "This is one of Zyverion's strongest premium solution directions because it blends digital presence with operational value.",
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
      "lead_generation",
      "catalog_showcase",
      "booking_appointment",
    ],
    recommendedGoals: ["visibility", "orders", "bookings", "trust"],
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
    recommendedGoals: ["bookings", "trust", "visual_credibility"],
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
    recommendedGoals: ["trust", "appointments", "clarity"],
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
    recommendedGoals: ["trust", "student_inquiries", "member_access"],
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
    recommendedGoals: ["sales", "product_browsing", "conversion"],
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
    recommendedGoals: ["trust", "visual_credibility", "clients"],
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
    recommendedGoals: ["trust", "project_inquiries", "credibility"],
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
    label: "Explain business clearly",
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

export const ZYVERION_DISCOVERY_QUESTION_BANK = {
  core: {
    en: [
      "What type of business is this for?",
      "What is the main result you want from this — more trust, more inquiries, more sales, bookings, or better internal operations?",
      "Do you need just a website, or do you also need admin tools, member access, or workflow support?",
      "Is this for a new business or an existing one?",
      "Do you already have branding, content, and images, or would the project need direction there too?",
    ],
    si: [
      "මේක කුමන business type එකකටද?",
      "ඔයාට මේකෙන් ප්‍රධානව අවශ්‍ය result එක මොකද්ද — trust, inquiries, sales, bookings, නැත්නම් better internal operations ද?",
      "ඔයාට website එක විතරක් ඕනද, නැත්නම් admin tools, member access, හෝ workflow support එකත් ඕනද?",
      "මේක new business එකකටද, නැත්නම් existing business එකක් upgrade කරන්නද?",
      "Branding, content, සහ images දැනට තිබෙනවද, නැත්නම් ඒ පැත්තෙත් direction අවශ්‍යද?",
    ],
    ta: [
      "இது எந்த business type க்காக?",
      "இதிலிருந்து உங்களுக்கு முக்கியமாக வேண்டியது என்ன — trust, inquiries, sales, bookings, அல்லது better internal operations ஆ?",
      "உங்களுக்கு website மட்டும் வேண்டுமா, அல்லது admin tools, member access, workflow support கூட வேண்டுமா?",
      "இது new business க்கா அல்லது existing business upgrade க்கா?",
      "Branding, content, மற்றும் images ஏற்கனவே உள்ளதா, அல்லது அதற்கும் direction வேண்டுமா?",
    ],
  },
  businessSpecific: {
    gym_fitness: {
      en: [
        "Is this mainly for attracting new members, managing members, or both?",
        "Do you need just a public website, or also member-side or admin-side functionality?",
      ],
      si: [
        "මේක mainly new members ගන්නද, current members manage කරන්නද, නැත්නම් දෙකමද?",
        "Public website එක විතරක් ඕනද, නැත්නම් member-side හෝ admin-side functionality එකත් ඕනද?",
      ],
      ta: [
        "இது mainly new members வாங்குவதற்கா, current members manage செய்வதற்கா, அல்லது இரண்டிற்குமா?",
        "Public website மட்டும் போதுமா, அல்லது member-side அல்லது admin-side functionality கூட வேண்டுமா?",
      ],
    },
    ecommerce_retail: {
      en: [
        "Do you want full online selling, or mainly product showcasing with inquiry flow first?",
        "How many products or categories do you expect to manage?",
      ],
      si: [
        "Full online selling එකද ඕන, නැත්නම් product showcase + inquiry flow එකෙන් start කරන්නද?",
        "Products හෝ categories roughly කීයක් manage කරන්න බලාපොරොත්තු වෙනවද?",
      ],
      ta: [
        "Full online selling வேண்டுமா, அல்லது product showcase + inquiry flow கொண்டு ஆரம்பிக்க வேண்டுமா?",
        "Products அல்லது categories சுமார் எவ்வளவு இருக்கும்?",
      ],
    },
    salon_spa_beauty: {
      en: [
        "Is your biggest need more bookings, stronger presentation, or both?",
        "Do you want appointment requests or a more advanced booking flow?",
      ],
      si: [
        "ඔයාගේ biggest need එක bookings ද, stronger presentation ද, නැත්නම් දෙකමද?",
        "Appointment requests විතරක්ද ඕන, නැත්නම් advanced booking flow එකක්ද?",
      ],
      ta: [
        "உங்கள் biggest need bookings ஆ, stronger presentation ஆ, அல்லது இரண்டுமா?",
        "Appointment requests மட்டும் போதுமா, அல்லது advanced booking flow வேண்டுமா?",
      ],
    },
    medical_clinic: {
      en: [
        "Do patients mainly need information, bookings, or both?",
        "Would a trust-focused clinic website be enough first, or do you need a structured appointment flow too?",
      ],
      si: [
        "Patientsලාට mainly information ද ඕන, bookings ද, නැත්නම් දෙකමද?",
        "Trust-focused clinic website එකක් first stage එකට enough ද, නැත්නම් structured appointment flow එකත් ඕනද?",
      ],
      ta: [
        "Patients க்கு mainly information வேண்டுமா, bookings வேண்டுமா, அல்லது இரண்டுமா?",
        "Trust-focused clinic website first stage க்கு போதுமா, அல்லது structured appointment flow கூட வேண்டுமா?",
      ],
    },
  },
};

export const ZYVERION_OBJECTION_HANDLING = {
  why_zyverion: {
    en: "Zyverion is positioned around structured digital solutions, not just surface-level website design. The agency focuses on building business value through trust, presentation, operations, and scalable digital direction.",
    si: "Zyverion කියන්නේ surface-level website design විතරක් කරන එකක් නොව structured digital solutions agency එකක්. Trust, presentation, operations, සහ scalable digital direction එකට value build කිරීම තමයි මේකේ focus එක.",
    ta: "Zyverion என்பது surface-level website design மட்டும் செய்யும் ஒன்று அல்ல. Trust, presentation, operations, மற்றும் scalable digital direction மூலம் business value உருவாக்கும் structured digital solutions agency ஆகும்.",
  },
  only_websites: {
    en: "No. Zyverion is not limited to presentation websites. It can also support systems, dashboards, portals, workflows, and hybrid solutions when the business situation needs more than a simple site.",
    si: "නැහැ. Zyverion presentation websites වලට විතරක් සීමා වෙන්නේ නැහැ. Business situation එක simple site එකකට වඩා වැඩි solution එකක් ඉල්ලනවා නම් systems, dashboards, portals, workflows, සහ hybrid solutions ද support කරන්න පුළුවන්.",
    ta: "இல்லை. Zyverion presentation websites மட்டும் செய்யாது. Business situation simple site ஐ விட அதிக solution கேட்கிறால் systems, dashboards, portals, workflows, மற்றும் hybrid solutions க்கும் உதவ முடியும்.",
  },
  trust_business: {
    en: "Zyverion presents itself as a structured business solution provider, with consultation-first thinking and a stronger focus on serious projects rather than random one-off design work.",
    si: "Zyverion තමන්ව present කරන්නේ consultation-first structured business solution provider එකක් විදිහට. Random one-off design work එකකට වඩා serious projects වලට strong focus එකක් තියෙනවා.",
    ta: "Zyverion consultation-first structured business solution provider ஆக தன்னை நிறுத்துகிறது. Random one-off design work ஐ விட serious projects மீது அதிக focus உள்ளது.",
  },
  meetings: {
    en: "For serious work, the process can be handled in a structured professional way, including consultation and proper scope discussion before moving forward.",
    si: "Serious work සඳහා process එක structured professional way එකකින් handle කරන්න පුළුවන්, consultation සහ proper scope discussion එක්ක.",
    ta: "Serious work க்கு process structured professional way யில் handle செய்யலாம், consultation மற்றும் proper scope discussion உடன்.",
  },
  support_after_launch: {
    en: "Zyverion's positioning supports long-term business value, so post-launch support and practical continuity are part of the mindset, not just the visual launch itself.",
    si: "Zyverion long-term business value mindset එකක් තියෙන නිසා post-launch support සහ practical continuity කියන දෙක launch එකෙන් පස්සේ අමතක කරන දේවල් නෙවෙයි.",
    ta: "Zyverion long-term business value mindset உடையதால் post-launch support மற்றும் practical continuity என்பது launch க்கு பிறகு மறக்கும் விஷயங்கள் அல்ல.",
  },
  pricing_concern: {
    en: "Pricing depends on the type of build, the amount of functionality, the level of design, and whether the project is website-only or includes systems and workflow logic.",
    si: "Pricing එක depend වෙන්නේ build type එක, functionality amount එක, design level එක, සහ project එක website-only ද නැත්නම් systems සහ workflow logic එකත් ඇතුළත් ද කියන දේවල් මතයි.",
    ta: "Pricing என்பது build type, functionality அளவு, design level, மற்றும் project website-only ஆ அல்லது systems மற்றும் workflow logic உடன் வருகிறதா என்பதன் மீது பொருந்தும்.",
  },
};

export const ZYVERION_CTA_RULES = {
  estimator: {
    when: [
      "pricing questions",
      "budget direction questions",
      "early cost estimation needs",
      "users who want a practical next step without full consultation yet",
    ],
    label: "Open Estimator",
    href: "estimator.html",
  },
  contact: {
    when: [
      "high intent lead",
      "ready to start",
      "needs direct consultation",
      "complex project discussion",
      "serious business inquiry",
    ],
    label: "Contact Zyverion",
    href: "contact.html",
  },
  work: {
    when: [
      "portfolio questions",
      "proof questions",
      "example questions",
      "build something similar questions",
    ],
    label: "View Our Work",
    href: "projects.html",
  },
  none: {
    when: [
      "the answer itself is enough for now",
    ],
    label: "",
    href: "",
  },
};

export const ZYVERION_CONSULTATION_STAGES = [
  {
    id: "understand_business",
    purpose: "Understand the type of business and stage of the business.",
  },
  {
    id: "understand_goal",
    purpose: "Understand what the business actually wants to achieve.",
  },
  {
    id: "understand_solution_scope",
    purpose: "Understand whether a website alone is enough or whether a system is needed too.",
  },
  {
    id: "recommend_solution_type",
    purpose: "Recommend the right website or system type based on the situation.",
  },
  {
    id: "explain_reasoning",
    purpose: "Explain why the suggested solution fits the user's current situation.",
  },
  {
    id: "guide_next_step",
    purpose: "Move the user to Estimator, Contact, or Work naturally only after giving value.",
  },
];
export const ZYVERION_RESPONSE_STYLES = {
  en: {
    consultantTone:
      "Premium, calm, intelligent, trustworthy, and consultative.",
    answerRule:
      "Answer properly first, then guide to the best next step only after giving value.",
    recommendationIntro:
      "Based on your situation, the strongest direction would be",
    reasoningIntro:
      "That makes sense because",
    nextStepIntro:
      "The best next step from here would be",
    followUpIntro:
      "To guide you properly, I would first want to understand",
  },
  si: {
    consultantTone:
      "Premium, calm, intelligent, trustworthy, and consultative tone එකක්.",
    answerRule:
      "මුලින් proper answer එක දෙන්න, ඊට පස්සේ value දීලා best next step එක guide කරන්න.",
    recommendationIntro:
      "ඔයාගේ situation එක බලද්දී strongest direction එක වෙන්නේ",
    reasoningIntro:
      "ඒකට හේතුව මෙන්න",
    nextStepIntro:
      "මෙතැනින් best next step එක වෙන්නේ",
    followUpIntro:
      "Properly guide කරන්න නම් මට මුලින් තේරුම් ගන්න ඕනේ",
  },
  ta: {
    consultantTone:
      "Premium, calm, intelligent, trustworthy, and consultative tone.",
    answerRule:
      "முதலில் proper answer கொடுத்து, அதன் பிறகு value கொடுத்து best next step க்கு guide செய்யவும்.",
    recommendationIntro:
      "உங்கள் situation பார்த்தால் strongest direction என்பது",
    reasoningIntro:
      "அதற்கான காரணம் இதுதான்",
    nextStepIntro:
      "இங்கிருந்து best next step என்பது",
    followUpIntro:
      "Properly guide செய்ய நான் முதலில் புரிந்துகொள்ள வேண்டியது",
  },
};

export const ZYVERION_SITUATION_PROMPTS = {
  unsure_need: {
    en: "The user is unsure what they need. Move into discovery mode before recommending a solution.",
    si: "Userට තමන්ට ඕනේ exact solution එක clear නැහැ. Recommendation එකට කලින් discovery mode එකට යන්න.",
    ta: "Userக்கு என்ன solution வேண்டும் என்பது clear இல்லை. Recommendation க்கு முன் discovery mode க்கு செல்லவும்.",
  },
  website_only_might_be_enough: {
    en: "A website-only solution may be enough at this stage. Do not overbuild unless the situation clearly requires systems.",
    si: "මේ stage එකේ website-only solution එකක් enough වෙන්න පුළුවන්. Situation එක clearly systems ඉල්ලනවා නම් විතරක් bigger solution recommend කරන්න.",
    ta: "இந்த stage இல் website-only solution போதுமானதாக இருக்கலாம். Situation தெளிவாக systems கேட்கிறால் மட்டுமே bigger solution recommend செய்யவும்.",
  },
  website_not_enough: {
    en: "A simple website alone may not be enough. Consider hybrid website + system direction.",
    si: "Simple website එකක් විතරක් enough නොවෙන්න පුළුවන්. Hybrid website + system direction එක consider කරන්න.",
    ta: "Simple website மட்டும் போதாமல் இருக்கலாம். Hybrid website + system direction ஐ consider செய்யவும்.",
  },
  early_stage_business: {
    en: "This looks like an early-stage business. Prioritize clarity, trust, and a practical first build.",
    si: "මේක early-stage business එකක් වගේ. Clarity, trust, සහ practical first build එක prioritize කරන්න.",
    ta: "இது early-stage business போல தெரிகிறது. Clarity, trust, மற்றும் practical first build ஐ prioritize செய்யவும்.",
  },
  existing_business_upgrade: {
    en: "This looks like an existing business upgrade. Focus on improvement, digital maturity, and stronger conversion or operations.",
    si: "මේක existing business upgrade එකක් වගේ. Improvement, digital maturity, සහ stronger conversion හෝ operations වලට focus කරන්න.",
    ta: "இது existing business upgrade போல தெரிகிறது. Improvement, digital maturity, மற்றும் stronger conversion அல்லது operations மீது focus செய்யவும்.",
  },
};

function normalizeLanguage(value) {
  return value === "si" || value === "ta" || value === "en" ? value : "en";
}

function normalizeText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function uniqueArray(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function includesAny(text, words) {
  const value = normalizeText(text);
  return words.some((word) => value.includes(normalizeText(word)));
}

function scoreIndicators(text, indicators) {
  const value = normalizeText(text);
  let score = 0;

  indicators.forEach((indicator) => {
    if (value.includes(normalizeText(indicator))) {
      score += 1;
    }
  });

  return score;
}

function getWebsiteTypeById(id) {
  return ZYVERION_WEBSITE_TYPES.find((item) => item.id === id) || null;
}

function getBusinessTypeById(id) {
  return ZYVERION_BUSINESS_TYPES.find((item) => item.id === id) || null;
}

function getGoalById(id) {
  return ZYVERION_GOAL_SIGNALS.find((item) => item.id === id) || null;
}

function getCapabilityById(id) {
  return ZYVERION_CAPABILITY_SIGNALS.find((item) => item.id === id) || null;
}

function getStageById(id) {
  return ZYVERION_STAGE_SIGNALS.find((item) => item.id === id) || null;
}

export function detectBusinessType(text) {
  const ranked = ZYVERION_BUSINESS_TYPES.map((type) => ({
    id: type.id,
    score: scoreIndicators(text, type.indicators),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!ranked.length) {
    return {
      primary: "general_service_business",
      confidence: "low",
      ranked: [],
    };
  }

  return {
    primary: ranked[0].id,
    confidence: ranked[0].score >= 2 ? "medium" : "low",
    ranked,
  };
}

export function detectGoals(text) {
  const ranked = ZYVERION_GOAL_SIGNALS.map((goal) => ({
    id: goal.id,
    score: scoreIndicators(text, goal.indicators),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return ranked.map((item) => item.id);
}

export function detectCapabilities(text) {
  const ranked = ZYVERION_CAPABILITY_SIGNALS.map((capability) => ({
    id: capability.id,
    score: scoreIndicators(text, capability.indicators),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return ranked.map((item) => item.id);
}

export function detectBusinessStage(text) {
  const ranked = ZYVERION_STAGE_SIGNALS.map((stage) => ({
    id: stage.id,
    score: scoreIndicators(text, stage.indicators),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!ranked.length) {
    return "unknown";
  }

  return ranked[0].id;
}

export function detectIntentMode(text) {
  const value = normalizeText(text);

  if (
    includesAny(value, [
      "what do i need",
      "what kind of website",
      "what type of website",
      "which website",
      "not sure",
      "i need guidance",
      "project guidance",
      "help me decide",
      "මොන website එකද",
      "මට sure නැහැ",
      "guidance",
      "எந்த website",
      "எது சரி",
      "help decide",
    ])
  ) {
    return "discovery";
  }

  if (
    includesAny(value, [
      "price",
      "cost",
      "quote",
      "budget",
      "estimate",
      "මිල",
      "ගාණ",
      "விலை",
      "காசு",
      "கட்டணம்",
    ])
  ) {
    return "pricing";
  }

  if (
    includesAny(value, [
      "can you build",
      "can you make",
      "need a website",
      "need a system",
      "start a project",
      "build for my business",
      "website for my business",
      "system for my business",
      "website එකක් ඕනේ",
      "system එකක් ඕනේ",
      "ஒரு website வேண்டும்",
      "ஒரு system வேண்டும்",
    ])
  ) {
    return "recommendation";
  }

  return "general";
}

export function isHighIntentLead(text) {
  return includesAny(text, [
    "how much",
    "price",
    "cost",
    "quote",
    "start project",
    "can you build",
    "need a website",
    "need a system",
    "contact",
    "consultation",
    "meeting",
    "let's start",
    "මිල",
    "project එක start",
    "website එකක් ඕනේ",
    "system එකක් ඕනේ",
    "விலை",
    "தொடங்கலாம்",
    "website வேண்டும்",
    "system வேண்டும்",
  ]);
}

export function isUnsureUser(text) {
  return includesAny(text, [
    "not sure",
    "don't know",
    "help me decide",
    "what should i build",
    "what do i need",
    "which website",
    "i need guidance",
    "මට sure නැහැ",
    "මට තේරෙන්නෙ නැහැ",
    "எனக்கு தெரியவில்லை",
    "எதை தேர்வு செய்வது",
    "guide me",
  ]);
}

export function inferSituationProfile(text, options = {}) {
  const language = normalizeLanguage(options.language);
  const businessTypeResult = detectBusinessType(text);
  const goals = detectGoals(text);
  const capabilities = detectCapabilities(text);
  const stage = detectBusinessStage(text);
  const intentMode = detectIntentMode(text);

  const businessType = getBusinessTypeById(businessTypeResult.primary);
  const recommendedTypeIds = businessType
    ? [...businessType.recommendedWebsiteTypes]
    : ["business_profile", "lead_generation"];

  if (goals.includes("sales")) {
    recommendedTypeIds.push("ecommerce_store", "catalog_showcase");
  }

  if (goals.includes("bookings")) {
    recommendedTypeIds.push("booking_appointment");
  }

  if (goals.includes("operations")) {
    recommendedTypeIds.push("admin_dashboard", "hybrid_website_system");
  }

  if (goals.includes("member_management")) {
    recommendedTypeIds.push("membership_portal", "hybrid_website_system");
  }

  if (capabilities.includes("website_plus_system")) {
    recommendedTypeIds.push("hybrid_website_system", "admin_dashboard");
  }

  if (capabilities.includes("user_accounts")) {
    recommendedTypeIds.push("membership_portal");
  }

  if (capabilities.includes("admin_tools")) {
    recommendedTypeIds.push("admin_dashboard");
  }

  if (capabilities.includes("ecommerce")) {
    recommendedTypeIds.push("ecommerce_store");
  }

  if (capabilities.includes("booking_flow")) {
    recommendedTypeIds.push("booking_appointment");
  }

  if (stage === "idea_stage") {
    recommendedTypeIds.push("business_profile", "lead_generation");
  }

  const rankedWebsiteTypes = rankWebsiteTypes({
    businessTypeId: businessTypeResult.primary,
    goals,
    capabilities,
    stage,
    seedTypeIds: uniqueArray(recommendedTypeIds),
  });

  return {
    language,
    businessTypeId: businessTypeResult.primary,
    businessTypeConfidence: businessTypeResult.confidence,
    businessType,
    goals,
    capabilities,
    stage,
    intentMode,
    highIntent: isHighIntentLead(text),
    unsureUser: isUnsureUser(text),
    rankedWebsiteTypes,
    topWebsiteType: rankedWebsiteTypes[0] || null,
    discoveredSignals: {
      businessTypeRanked: businessTypeResult.ranked,
      goals,
      capabilities,
      stage,
      intentMode,
    },
  };
}

export function rankWebsiteTypes(profile) {
  const scores = new Map();

  function addScore(id, value) {
    scores.set(id, (scores.get(id) || 0) + value);
  }

  (profile.seedTypeIds || []).forEach((id) => addScore(id, 2));

  if (profile.businessTypeId) {
    const businessType = getBusinessTypeById(profile.businessTypeId);
    if (businessType) {
      businessType.recommendedWebsiteTypes.forEach((id, index) => {
        addScore(id, index === 0 ? 5 : 3);
      });
    }
  }

  (profile.goals || []).forEach((goalId) => {
    if (goalId === "trust") {
      addScore("business_profile", 4);
      addScore("portfolio_showcase", 2);
      addScore("lead_generation", 2);
    }
    if (goalId === "leads") {
      addScore("lead_generation", 5);
      addScore("business_profile", 2);
      addScore("landing_page", 2);
    }
    if (goalId === "sales") {
      addScore("ecommerce_store", 6);
      addScore("catalog_showcase", 3);
      addScore("landing_page", 2);
    }
    if (goalId === "bookings") {
      addScore("booking_appointment", 6);
      addScore("lead_generation", 2);
    }
    if (goalId === "operations") {
      addScore("admin_dashboard", 6);
      addScore("hybrid_website_system", 5);
    }
    if (goalId === "member_management") {
      addScore("membership_portal", 6);
      addScore("hybrid_website_system", 5);
    }
    if (goalId === "visibility") {
      addScore("business_profile", 3);
      addScore("lead_generation", 2);
      addScore("portfolio_showcase", 2);
    }
    if (goalId === "clarity") {
      addScore("business_profile", 4);
      addScore("lead_generation", 2);
    }
    if (goalId === "growth") {
      addScore("hybrid_website_system", 3);
      addScore("lead_generation", 2);
      addScore("business_profile", 2);
    }
  });

  (profile.capabilities || []).forEach((capabilityId) => {
    if (capabilityId === "just_website") {
      addScore("business_profile", 3);
      addScore("lead_generation", 2);
    }
    if (capabilityId === "website_plus_system") {
      addScore("hybrid_website_system", 6);
      addScore("admin_dashboard", 4);
      addScore("membership_portal", 3);
    }
    if (capabilityId === "user_accounts") {
      addScore("membership_portal", 5);
      addScore("hybrid_website_system", 4);
    }
    if (capabilityId === "booking_flow") {
      addScore("booking_appointment", 5);
    }
    if (capabilityId === "ecommerce") {
      addScore("ecommerce_store", 5);
      addScore("catalog_showcase", 3);
    }
    if (capabilityId === "admin_tools") {
      addScore("admin_dashboard", 5);
      addScore("hybrid_website_system", 4);
    }
  });

  if (profile.stage === "idea_stage") {
    addScore("business_profile", 2);
    addScore("lead_generation", 2);
  }

  if (profile.stage === "digital_upgrade") {
    addScore("hybrid_website_system", 2);
    addScore("lead_generation", 2);
    addScore("admin_dashboard", 2);
  }

  return Array.from(scores.entries())
    .map(([id, score]) => ({
      id,
      score,
      data: getWebsiteTypeById(id),
    }))
    .filter((item) => item.data)
    .sort((a, b) => b.score - a.score);
}

export function getDiscoveryQuestions(profile, language = "en", limit = 3) {
  const lang = normalizeLanguage(language);
  const questions = [...(ZYVERION_DISCOVERY_QUESTION_BANK.core[lang] || [])];

  if (profile?.businessTypeId) {
    const specific = ZYVERION_DISCOVERY_QUESTION_BANK.businessSpecific[profile.businessTypeId];
    if (specific && specific[lang]) {
      questions.push(...specific[lang]);
    }
  }

  const filtered = [];
  questions.forEach((question) => {
    if (!filtered.includes(question)) {
      filtered.push(question);
    }
  });

  return filtered.slice(0, limit);
}

export function getRecommendedWebsiteTypes(profile, limit = 3) {
  return (profile?.rankedWebsiteTypes || [])
    .slice(0, limit)
    .map((item) => item.data);
}

export function getServiceBucketRecommendations(profile) {
  const buckets = [];

  const goalSet = new Set(profile?.goals || []);
  const capabilitySet = new Set(profile?.capabilities || []);

  if (goalSet.has("trust") || goalSet.has("leads") || goalSet.has("clarity") || goalSet.has("visibility")) {
    buckets.push("business_websites");
  }

  if (goalSet.has("sales") || capabilitySet.has("ecommerce")) {
    buckets.push("ecommerce_and_catalog");
  }

  if (goalSet.has("bookings") || capabilitySet.has("booking_flow")) {
    buckets.push("booking_and_service_flows");
  }

  if (goalSet.has("member_management") || capabilitySet.has("user_accounts")) {
    buckets.push("portals_and_membership");
  }

  if (goalSet.has("operations") || capabilitySet.has("admin_tools") || capabilitySet.has("website_plus_system")) {
    buckets.push("admin_and_operations");
    buckets.push("automation_and_process_design");
  }

  if (!buckets.length) {
    buckets.push("business_websites");
  }

  return uniqueArray(buckets)
    .map((id) => ZYVERION_SERVICE_BUCKETS.find((item) => item.id === id))
    .filter(Boolean);
}

export function getConsultationSignals(profile) {
  const signals = [];

  if (profile?.unsureUser) signals.push("unsure_need");
  if (profile?.stage === "idea_stage") signals.push("early_stage_business");
  if (profile?.stage === "existing_business" || profile?.stage === "digital_upgrade") {
    signals.push("existing_business_upgrade");
  }

  const capabilitySet = new Set(profile?.capabilities || []);
  const goalSet = new Set(profile?.goals || []);

  if (
    capabilitySet.has("website_plus_system") ||
    capabilitySet.has("user_accounts") ||
    capabilitySet.has("admin_tools") ||
    goalSet.has("operations") ||
    goalSet.has("member_management")
  ) {
    signals.push("website_not_enough");
  } else {
    signals.push("website_only_might_be_enough");
  }

  return uniqueArray(signals);
}

export function getConsultationGuidance(profile, language = "en") {
  const lang = normalizeLanguage(language);
  return getConsultationSignals(profile)
    .map((id) => ZYVERION_SITUATION_PROMPTS[id]?.[lang])
    .filter(Boolean);
}

export function getTrustLines(language = "en", limit = 2) {
  const lang = normalizeLanguage(language);
  return (ZYVERION_BRAND.trustSignals[lang] || ZYVERION_BRAND.trustSignals.en).slice(0, limit);
}

export function getObjectionAnswer(key, language = "en") {
  const lang = normalizeLanguage(language);
  const item = ZYVERION_OBJECTION_HANDLING[key];
  if (!item) return "";
  return item[lang] || item.en || "";
}

export function chooseSuggestedAction(profile, text = "") {
  const value = normalizeText(text);
  const intentMode = profile?.intentMode || "general";
  const highIntent = !!profile?.highIntent;

  if (
    includesAny(value, [
      "price",
      "cost",
      "quote",
      "budget",
      "estimate",
      "estimator",
      "මිල",
      "ගාණ",
      "விலை",
      "காசு",
      "கட்டணம்",
    ])
  ) {
    return { type: "estimator", ...ZYVERION_CTA_RULES.estimator };
  }

  if (
    includesAny(value, [
      "work",
      "portfolio",
      "examples",
      "sample",
      "can you build something like",
      "similar",
      "වැඩ",
      "போர்ட்ஃபோலியோ",
      "உதாரணம்",
    ])
  ) {
    return { type: "work", ...ZYVERION_CTA_RULES.work };
  }

  if (highIntent || intentMode === "recommendation") {
    return { type: "contact", ...ZYVERION_CTA_RULES.contact };
  }

  return { type: "none", ...ZYVERION_CTA_RULES.none };
}

export function buildKnowledgeSnapshot(profile, language = "en") {
  const lang = normalizeLanguage(language);
  const businessType = profile?.businessType || getBusinessTypeById(profile?.businessTypeId);
  const topTypes = getRecommendedWebsiteTypes(profile, 3);
  const buckets = getServiceBucketRecommendations(profile);
  const questions = getDiscoveryQuestions(profile, lang, 3);
  const guidance = getConsultationGuidance(profile, lang);
  const trustLines = getTrustLines(lang, 2);
  const responseStyle = ZYVERION_RESPONSE_STYLES[lang] || ZYVERION_RESPONSE_STYLES.en;

  return {
    brand: ZYVERION_BRAND,
    languageName: LANGUAGE_NAMES[lang] || LANGUAGE_NAMES.en,
    responseStyle,
    businessType: businessType
      ? {
          id: businessType.id,
          name: businessType.name,
          recommendedWebsiteTypes: businessType.recommendedWebsiteTypes,
          recommendedGoals: businessType.recommendedGoals,
        }
      : null,
    goals: (profile?.goals || []).map((id) => getGoalById(id)).filter(Boolean),
    capabilities: (profile?.capabilities || []).map((id) => getCapabilityById(id)).filter(Boolean),
    stage: getStageById(profile?.stage),
    recommendedWebsiteTypes: topTypes,
    recommendedServiceBuckets: buckets,
    discoveryQuestions: questions,
    consultationGuidance: guidance,
    trustLines,
    suggestedAction: chooseSuggestedAction(profile),
  };
}

export function buildSystemKnowledgePrompt(language = "en") {
  const lang = normalizeLanguage(language);
  const style = ZYVERION_RESPONSE_STYLES[lang] || ZYVERION_RESPONSE_STYLES.en;

  return `
Zyverion Knowledge Core

Brand:
- ${ZYVERION_BRAND.fullName}
- ${ZYVERION_BRAND.positioning}
- ${ZYVERION_BRAND.marketFocus}

Operating style:
- ${ZYVERION_BRAND.operatingStyle.join("\n- ")}

Service buckets:
${ZYVERION_SERVICE_BUCKETS.map(
  (item) => `- ${item.label}: ${item.summary}`
).join("\n")}

Website and solution types:
${ZYVERION_WEBSITE_TYPES.map(
  (item) => `- ${item.name}: ${item.purpose}`
).join("\n")}

Response style:
- Tone: ${style.consultantTone}
- Rule: ${style.answerRule}

Consultation rule:
- Learn the user's situation first when needed.
- Recommend the right website or system type based on business type, goal, complexity, and stage.
- Explain why the recommendation fits.
- Only then guide to Estimator, Contact, or Work if helpful.
- Keep every recommendation inside Zyverion's actual service scope.
`.trim();
}

export function buildRecommendationExplanation(profile, language = "en") {
  const lang = normalizeLanguage(language);
  const style = ZYVERION_RESPONSE_STYLES[lang] || ZYVERION_RESPONSE_STYLES.en;
  const top = profile?.topWebsiteType?.data || null;
  const goals = (profile?.goals || []).slice(0, 2);
  const businessType = profile?.businessType || getBusinessTypeById(profile?.businessTypeId);

  if (!top) {
    return "";
  }

  const goalLabels = goals
    .map((id) => getGoalById(id))
    .filter(Boolean)
    .map((item) => item.label);

  const reasonBits = [];

  if (businessType) {
    reasonBits.push(`${top.name} is a strong fit for ${businessType.name.toLowerCase()} situations`);
  }

  if (goalLabels.length) {
    reasonBits.push(`because your likely goals point toward ${goalLabels.join(" and ").toLowerCase()}`);
  }

  if (profile?.stage === "idea_stage") {
    reasonBits.push("and it keeps the first build practical without overcomplicating the project");
  }

  if (profile?.capabilities?.includes("website_plus_system")) {
    reasonBits.push("while still leaving room for a deeper website plus system direction if needed");
  }

  const reasonLine = reasonBits.join(" ");

  if (lang === "si") {
    return `${style.recommendationIntro} ${top.name} solution එකයි. ${style.reasoningIntro} ${reasonLine}.`;
  }

  if (lang === "ta") {
    return `${style.recommendationIntro} ${top.name}. ${style.reasoningIntro} ${reasonLine}.`;
  }

  return `${style.recommendationIntro} a ${top.name}. ${style.reasoningIntro} ${reasonLine}.`;
}

export function buildNextStepGuidance(profile, language = "en") {
  const lang = normalizeLanguage(language);
  const style = ZYVERION_RESPONSE_STYLES[lang] || ZYVERION_RESPONSE_STYLES.en;
  const action = chooseSuggestedAction(profile);

  if (action.type === "estimator") {
    if (lang === "si") {
      return `${style.nextStepIntro} Estimator එකෙන් price direction එක check කරන එකයි.`;
    }
    if (lang === "ta") {
      return `${style.nextStepIntro} Estimator மூலம் price direction பெறுவது.`;
    }
    return `${style.nextStepIntro} using the Estimator for price direction.`;
  }

  if (action.type === "contact") {
    if (lang === "si") {
      return `${style.nextStepIntro} Zyverion එක්ක direct consultation එකකට Contact page එකෙන් details share කරන එකයි.`;
    }
    if (lang === "ta") {
      return `${style.nextStepIntro} Zyverion உடன் direct consultation க்கு Contact page மூலம் details share செய்வது.`;
    }
    return `${style.nextStepIntro} sharing your details through the Contact page for direct consultation.`;
  }

  if (action.type === "work") {
    if (lang === "si") {
      return `${style.nextStepIntro} Work page එකෙන් proof සහ project direction examples බලන එකයි.`;
    }
    if (lang === "ta") {
      return `${style.nextStepIntro} Work page இல் proof மற்றும் project direction examples பார்க்கும்து.`;
    }
    return `${style.nextStepIntro} reviewing the Work page for proof and project direction examples.`;
  }

  return "";
}

export function buildDiscoveryPrompt(profile, language = "en", limit = 2) {
  const lang = normalizeLanguage(language);
  const style = ZYVERION_RESPONSE_STYLES[lang] || ZYVERION_RESPONSE_STYLES.en;
  const questions = getDiscoveryQuestions(profile, lang, limit);

  if (!questions.length) return "";

  if (lang === "si") {
    return `${style.followUpIntro}: ${questions.join(" ")}`;
  }

  if (lang === "ta") {
    return `${style.followUpIntro}: ${questions.join(" ")}`;
  }

  return `${style.followUpIntro}: ${questions.join(" ")}`;
}

export function createSituationBlueprint(text, options = {}) {
  const profile = inferSituationProfile(text, options);
  const language = normalizeLanguage(options.language);
  const snapshot = buildKnowledgeSnapshot(profile, language);

  return {
    profile,
    snapshot,
    recommendationExplanation: buildRecommendationExplanation(profile, language),
    nextStepGuidance: buildNextStepGuidance(profile, language),
    discoveryPrompt: buildDiscoveryPrompt(profile, language, 2),
    suggestedAction: chooseSuggestedAction(profile, text),
  };
}

const knowledge = {
  LANGUAGE_NAMES,
  ZYVERION_BRAND,
  ZYVERION_SERVICE_BUCKETS,
  ZYVERION_WEBSITE_TYPES,
  ZYVERION_BUSINESS_TYPES,
  ZYVERION_GOAL_SIGNALS,
  ZYVERION_CAPABILITY_SIGNALS,
  ZYVERION_STAGE_SIGNALS,
  ZYVERION_DISCOVERY_QUESTION_BANK,
  ZYVERION_OBJECTION_HANDLING,
  ZYVERION_CTA_RULES,
  ZYVERION_CONSULTATION_STAGES,
  ZYVERION_RESPONSE_STYLES,
  ZYVERION_SITUATION_PROMPTS,
  detectBusinessType,
  detectGoals,
  detectCapabilities,
  detectBusinessStage,
  detectIntentMode,
  isHighIntentLead,
  isUnsureUser,
  inferSituationProfile,
  rankWebsiteTypes,
  getDiscoveryQuestions,
  getRecommendedWebsiteTypes,
  getServiceBucketRecommendations,
  getConsultationSignals,
  getConsultationGuidance,
  getTrustLines,
  getObjectionAnswer,
  chooseSuggestedAction,
  buildKnowledgeSnapshot,
  buildSystemKnowledgePrompt,
  buildRecommendationExplanation,
  buildNextStepGuidance,
  buildDiscoveryPrompt,
  createSituationBlueprint,
};

export default knowledge;