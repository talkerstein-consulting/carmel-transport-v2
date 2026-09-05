/**
 * All Carmel copy in one place.
 * Text is taken verbatim from carmel-usa.com; additions are marked.
 */

export const company = {
  name: "Carmel Transport",
  tagline: "Drayage & Intermodal",
  eyebrow: "Leading Provider of Drayage Services",
  headline: "We Don't Just Deliver,",
  headlineAccent: "We Excel",
  intro:
    "Carmel USA brings 50 years of experience in Drayage trucking from it's owners. We always prioritized punctuality and tailored customer service.",
  address: "78 John Miller Way, Kearny, NJ 07032 unit #408",
  addressShort: "78 John Miller Way, Kearny, NJ 07032",
  phones: {
    emergency: { label: "Emergency", value: "(646) 808-7266", href: "tel:+16468087266", note: "(24/7)" },
    sales: { label: "Sales", value: "(201) 299-5416", href: "tel:+12012995416" },
    other: { label: "Other inquiries", value: "(201) 299-5417", href: "tel:+12012995417" },
  },
  email: "quotes@carmel-usa.com",
  hours: "We are open 24 / 7 / 365",
  copyright: "Carmel Transport © 2023. All Rights Reserved.",
};

export const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Company", href: "#company" },
  { label: "FAQ", href: "#faq" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "#contact" },
];

export const serviceLinks = [
  { label: "Drayage", href: "#services" },
  { label: "Refridgerated Containers", href: "#services" },
  { label: "Intermodal Trucking", href: "#services" },
  { label: "Storage Facility", href: "#services" },
];

/** Welcome to Carmel USA! — verbatim */
export const welcome = {
  eyebrow: "Welcome to Carmel USA!",
  title: "A Transportation Partner",
  titleMuted: "You Can Count On",
  paragraphs: [
    "We always prioritized punctuality and tailored customer service. Those principles shape our work in the Drayage industry.",
    "We aim to give precise quotes that will end up on the invoice without any 'surprises' nor any extra charges.",
    "Carmel Transport manages a robust fleet of 300 power units across North America and over 800 chassis. This diversity means we can cater to various container types and sizes, from 20', 40', 45', and including any kind of container delivery: dry, overweight, refrigerated, open top, flat rack.",
    "Our yards are close to major seaports and rail terminals which lets us offer Secured yard storage, perfect for both short-term and long-term needs.",
  ],
};

/** The headline figure, pulled out on its own. */
export const leadStat = {
  value: 50,
  suffix: "",
  label: "Years of experience",
  note: "In Drayage trucking, from it's owners.",
};

/** The supporting figures — a 2 x 2. All four are stated on the site. */
export const stats = [
  { value: 300, suffix: "", label: "Power units", note: "Across North America" },
  { value: 800, suffix: "+", label: "Chassis", note: "20', 40', 45' and Genset" },
  { value: 30, suffix: "", label: "Reefer slots", note: "Powered, simultaneous, on site" },
  { value: 24, suffix: "/7", label: "Open 365 days", note: "Dispatch and container tracking" },
];

/** Service blurbs — verbatim */
export const services = [
  {
    id: "drayage",
    title: "Drayage",
    blurb: "We provide a full range asset-based drayage and full transload services",
    image: "/img/drayage.jpg",
    tag: "Asset-based",
  },
  {
    id: "refrigerated",
    title: "Refrigerated Containers",
    blurb: "We offer all-encompassing storage and transit of refrigerated containers",
    image: "/img/refrigerated.jpg",
    tag: "Genset chassis",
  },
  {
    id: "intermodal",
    title: "Intermodal Trucking",
    blurb:
      "We operate to ocean and rail container terminals, ensuring your goods reach their destination",
    image: "/img/intermodal-trucking.jpg",
    tag: "Ocean & rail",
  },
  {
    id: "storage",
    title: "Storage Facility",
    blurb:
      "We provide an all-inclusive storage solution for all sizes of dry-box and refrigerated containers",
    image: "/img/storage-facility.jpg",
    tag: "24/7 secured",
  },
];

/** Why Carmel — bento. Long two verbatim, short cards drawn from site facts. */
export const whyCarmel = {
  eyebrow: "Why Carmel",
  title: "Built to Take the Whole Job",
  note: "Our own equipment, our own yards, our own drivers.",
  partner: {
    title: "A Transportation Partner You Can Count On",
    body: "As a trusted leader in logistics, we offer flexible and affordable solutions for large volumes of import and export containers. Our dedicated team diligently monitors every shipment round-the-clock, ensuring a seamless transition with services including transportation from regional terminals, pre-arranged rail reservations, and high-security bolt seals.",
  },
  specialized: {
    title: "Leading the Way in Specialized Transportation Services",
    body: "Skilled drivers and plentiful Genset chassis manage temperature-sensitive freight, while our logistics branch offers optimized storage facilities. We handle all documentation and border clearances for US shipments.",
    image: "/img/refrigerated.jpg",
  },
  dispatch: {
    title: "Round-the-Clock Dispatch",
    body: "We are open 24 / 7 / 365, with an emergency line answered at any hour.",
  },
  storage: {
    title: "Secured Yard Storage",
    body: "Our yards sit close to major seaports and rail terminals, under 24/7 surveillance — right for both short-term and long-term needs.",
  },
  containers: {
    title: "Every Container Type",
    body: "Dry, overweight, refrigerated, open top and flat rack — from 20', 40' and 45'.",
    image: "/img/containers-3.jpg",
  },
};

/** What we bring — verbatim */
export const whatWeBring = {
  eyebrow: "What we bring",
  title: "Your Partner in Efficient,",
  titleMuted: "Secure Logistics",
  lede: "At Carmel USA, we offer efficient, cost-effective solutions for your import and export needs, handling large volumes of cargo with ease. Our 24/7 customer service vigilantly tracks your containers, managing everything from transportation, rail reservations, to cross-border freight. We also ensure safety with our high-security bolt seals for export shipments. With us, experience transparent and efficient logistics solutions.",
  items: [
    {
      id: "temperature",
      title: "Temperature-Controlled Solutions",
      body: "Carmel USA expertly manages refrigerated container transport and storage with our skilled drivers and robust Genset chassis. We can accommodate 30 units concurrently, fulfilling your temperature-sensitive cargo needs.",
      image: "/img/refrigerated.jpg",
      tag: "30 units at once",
    },
    {
      id: "shipment",
      title: "Shipment Services",
      body: "As a nationally recognized Carrier, we offer comprehensive shipment services. Our team expertly handles essential documentation and expedites border clearances, extending our expertise to key states like New York, Michigan, Ohio, and Pennsylvania. Trust Carmel USA for efficient transport solutions.",
      image: "/img/intermodal-trucking.jpg",
      tag: "NY · MI · OH · PA",
    },
    {
      id: "careers",
      title: "Join the Carmel Team",
      body: "Carmel USA aims to exceed industry standards with exceptional service and operational excellence. Interested in joining our dedicated team? Visit our career page for more.",
      image: "/img/careers-truck.jpg",
      tag: "We're hiring",
    },
  ],
};

/** FAQ — questions added; every answer drawn from facts already on the site. */
export const faqs = [
  {
    q: "What container types and sizes can you handle?",
    a: "We cater to various container types and sizes, from 20', 40', 45', and including any kind of container delivery: dry, overweight, refrigerated, open top and flat rack.",
  },
  {
    q: "Which areas do you serve?",
    a: "We operate a fleet of 300 power units across North America, extending our expertise to key states like New York, Michigan, Ohio and Pennsylvania. We also handle all documentation and border clearances for US shipments.",
  },
  {
    q: "Do you handle refrigerated containers?",
    a: "Yes. Our drivers are proficiently trained in transporting refrigerated items and we hold a substantial number of Genset chassis. Our storage facility is outfitted to accommodate up to 30 refrigerated containers simultaneously.",
  },
  {
    q: "Where is your storage facility?",
    a: "Our yards are close to major seaports and rail terminals, conveniently near the NJ ports. The site is fully secured with 24/7 surveillance, offering peace of mind against cargo theft.",
  },
  {
    q: "Will the quote match the invoice?",
    a: "Yes. We aim to give precise quotes that will end up on the invoice without any 'surprises' nor any extra charges.",
  },
  {
    q: "Are you available outside business hours?",
    a: "We are open 24 / 7 / 365. Our emergency line is (646) 808-7266, answered around the clock, and our team monitors every shipment day and night.",
  },
  {
    q: "Do you handle overweight containers?",
    a: "Yes. Our chassis pool covers 20', 40' and 45', and we handle any kind of container delivery: dry, overweight, refrigerated, open top and flat rack.",
  },
  {
    q: "Do you handle cross-border freight?",
    a: "Yes. Our 24/7 customer service manages everything from transportation and rail reservations through to cross-border freight, and we handle all documentation and border clearances for US shipments.",
  },
  {
    q: "How are export shipments secured?",
    a: "We fit high-security bolt seals on export shipments, arrange rail reservations ahead of time, and our yards are fully secured with 24/7 surveillance.",
  },
];

/** We Are Here To Help — verbatim */
export const contact = {
  eyebrow: "We Are Here To Help",
  title: "Get in Touch",
  lede: "Reach out to one of our knowledgeable team members. If you have any queries or need assistance with directions, sales, or have questions regarding billing, don't hesitate to contact us right away!",
  body: "Contact us today to request a quote or click the link a custom freight quote online. We look forward to being the full-service company you trust for all of your transport needs.",
};

export const cta = {
  title: "Let's Move Your Freight.",
  titleMuted: "Request a Quote.",
  marks: ["Precise quotes, no extra charges", "Answered 24 / 7 / 365"],
};

export const containerTypes = [
  "20'",
  "40'",
  "45'",
  "Dry",
  "Overweight",
  "Refrigerated",
  "Open top",
  "Flat rack",
];

export const serviceOptions = [
  "Drayage",
  "Refrigerated Containers",
  "Intermodal Trucking",
  "Storage Facility",
];

/**
 * Six figures for the Tresmares-style sticky number grid (`component--gridnumbers`).
 * Every number is already stated elsewhere on the site; `display` is the
 * literal string so ranges and slashes survive, `count` drives the count-up
 * where a plain integer makes sense.
 */
export const scaleStats = [
  { display: "50", count: 50, label: "Years of experience", note: "In drayage trucking, from our owners" },
  { display: "300", count: 300, label: "Power units", note: "Across North America" },
  { display: "800+", count: 800, suffix: "+", label: "Chassis", note: "20', 40', 45' and Genset" },
  { display: "30", count: 30, label: "Reefers at once", note: "Genset capacity at the yard" },
  { display: "24/7", label: "Dispatch, 365 days", note: "Emergency line answered at any hour" },
  { display: "4", count: 4, label: "Core states", note: "New York, Michigan, Ohio, Pennsylvania" },
];
