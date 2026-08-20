/**
 * ============================================================
 * PORTFOLIO DATA — edit this file to update the whole site
 * ============================================================
 *
 * HOW TO ADD A NEW PROJECT
 * 1. Add an object to the `projects` array.
 * 2. Save a screenshot to assets/images/projects/
 * 3. Set websiteUrl to the REAL live website (or "" until it is live).
 *    The whole project card becomes a clickable link to that URL.
 * 4. Set githubUrl ONLY if a public repository exists. Otherwise null.
 * 5. Set featured: true to show it in Selected Work on the homepage.
 *
 * HOW TO ADD A CLIENT LOGO
 * 1. Save logos to assets/images/logos/ as c-logo1.jpg, c-logo2.jpg, c-logo3.jpg, c-logo4.jpg
 *    in this order:
 *    1 Girls Can Malawi
 *    2 GPC Malawi
 *    3 YAISK Garden
 *    4 Sir Harry Johnston International School
 * 2. If the organisation has a live website, add websiteUrl so the logo is clickable.
 *
 * RULES
 * - Never invent a GitHub repository. Use null if there is none.
 * - Never invent a live website URL. Use null until you have the real one.
 * - GitHub and Live Demo buttons hide automatically when the URL is null.
 */

const SITE = {
    name: "Yakobo Web Development Firm",
    shortName: "Yakobo",
    monogram: "Y",
    role: "Web Development Firm",
    title: "Web Development Firm",
    location: "Malawi",
    /**
     * REPLACE the three values below with your real contact details.
     * Leave github / linkedin as null to hide those footer links.
     */
    email: "jmhamuzah@gmail.com",
    whatsapp: "https://wa.me/265990705194",
    github: null,
    linkedin: null,
    logo: "assets/images/logo.png"
};

const CATEGORY_META = {
    corporate: {
        label: "Corporate Website",
        plural: "Corporate Websites",
        page: "corporate.html",
        tagline: "A selection of corporate websites we've designed and developed."
    },
    business: {
        label: "Business Website",
        plural: "Business Websites",
        page: "business.html",
        tagline: "A selection of business websites we've designed and developed."
    },
    organisations: {
        label: "Organisation Website",
        plural: "Organisation Websites",
        page: "organisations.html",
        tagline: "A selection of organisation websites we've designed and developed."
    },
    schools: {
        label: "School Website",
        plural: "School Websites",
        page: "schools.html",
        tagline: "A selection of school websites we've designed and developed."
    },
    "web-applications": {
        label: "Web Application",
        plural: "Web Applications",
        page: "web-applications.html",
        tagline: "A selection of web applications we've designed and developed."
    },
    ecommerce: {
        label: "E-commerce Website",
        plural: "E-commerce Websites",
        page: "ecommerce.html",
        tagline: "A selection of e-commerce websites we've designed and developed."
    },
    portfolio: {
        label: "Personal / Portfolio Website",
        plural: "Personal / Portfolio Websites",
        page: "portfolio-sites.html",
        tagline: "A selection of personal and portfolio websites we've designed and developed."
    },
    events: {
        label: "Event Website",
        plural: "Event Websites",
        page: "events.html",
        tagline: "A selection of event websites we've designed and developed."
    },
    booking: {
        label: "Booking System",
        plural: "Booking Systems",
        page: "booking.html",
        tagline: "A selection of booking systems we've designed and developed."
    },
    management: {
        label: "Management System",
        plural: "Management Systems",
        page: "management.html",
        tagline: "A selection of management systems we've designed and developed."
    }
};

/**
 * Organisation / business logos shown on the homepage.
 * websiteUrl: real live URL, or null until you have it.
 */
const clients = [
    {
        name: "Girls Can Malawi",
        logo: "assets/images/logos/c-logo1.jpg",
        websiteUrl: "https://girlscanmw.vercel.app/"
    },
    {
        name: "GPC Malawi",
        logo: "assets/images/logos/c-logo2.jpg",
        websiteUrl: "https://gpc-xi.vercel.app/"
    },
    {
        name: "YAISK Garden",
        logo: "assets/images/logos/c-logo3.jpg",
        websiteUrl: "https://yaisk-slot.vercel.app/"
    },
    {
        name: "Sir Harry Johnston International School",
        logo: "assets/images/logos/c-logo4.jpg",
        websiteUrl: "https://sirharryszomba.com/"
    }
];

/**
 * All portfolio projects. Category pages filter this list automatically.
 *
 * category must be one of:
 *   "corporate" | "business" | "organisations" | "schools" | "web-applications"
 *   "ecommerce" | "portfolio" | "events" | "booking" | "management"
 *
 * websiteUrl  — paste the real live site here, e.g. "https://example.com"
 * githubUrl   — real public repo, or null
 */
const projects = [
    {
        name: "Sir Harry Johnston International School",
        category: "schools",
        description: "A professional school website designed to present programmes, admissions, campus life and institutional information with clarity and authority.",
        image: "assets/images/projects/shj.svg",
        technologies: ["HTML", "CSS", "JavaScript", "WordPress", "PHP"],
        websiteUrl: "https://sirharryszomba.com/",
        githubUrl: null,
        featured: true
    },
    {
        name: "Latoya Insurance Company",
        category: "corporate",
        description: "A corporate insurance website built for a Malawi-based provider, presenting products, trust and service information in a refined, institutional layout.",
        image: "assets/images/projects/latoya.svg",
        technologies: ["HTML", "CSS", "JavaScript"],
        websiteUrl: "https://latoya-insurance-company.vercel.app/",
        githubUrl: null,
        featured: true
    },
    {
        name: "Malawi Trust Bank",
        category: "corporate",
        description: "A corporate banking website designed to present services, trust and a clear institutional presence for customers and partners.",
        image: "assets/images/projects/malawi-trust-bank.svg",
        technologies: ["HTML", "CSS", "JavaScript"],
        websiteUrl: "https://malawi-trust-bank.vercel.app/",
        githubUrl: null,
        featured: true
    },
    {
        name: "GPC Malawi",
        category: "organisations",
        description: "A women-led organisation website focused on programmes, impact and community work for adolescent girls and young women across Malawi.",
        image: "assets/images/projects/gpc.svg",
        technologies: ["HTML", "CSS", "JavaScript"],
        websiteUrl: "https://gpc-xi.vercel.app/",
        githubUrl: null,
        featured: true
    },
    {
        name: "Aopanji Farm",
        category: "business",
        description: "A business website for a chicken farm, built to present products, farm identity and a clear online presence for customers.",
        image: "assets/images/projects/aopanji.svg",
        technologies: ["HTML", "CSS", "JavaScript"],
        websiteUrl: "https://aopanjichickenfarm.vercel.app/",
        githubUrl: null,
        featured: true
    },
    {
        name: "Girls Can Malawi",
        category: "organisations",
        description: "An organisation website presenting programmes, impact and community work for girls and young women across Malawi.",
        image: "assets/images/projects/girlscan.svg",
        technologies: ["HTML", "CSS", "JavaScript"],
        websiteUrl: "https://girlscanmw.vercel.app/",
        githubUrl: null,
        featured: true
    },
    {
        name: "Dwangwa & Partners",
        category: "corporate",
        description: "A professional law-firm website designed to present practice areas, credibility and a composed digital presence for a Malawian legal practice.",
        image: "assets/images/projects/dwangwa.svg",
        technologies: ["HTML", "CSS", "JavaScript"],
        websiteUrl: "https://dwangwa.vercel.app/",
        githubUrl: null,
        featured: true
    },
    {
        name: "YAISK Garden",
        category: "business",
        description: "A venue presentation and pricelist experience designed to display event packages with clarity for clients and bookings teams.",
        image: "assets/images/projects/yaisk.svg",
        technologies: ["HTML", "CSS", "JavaScript"],
        websiteUrl: "https://yaisk-slot.vercel.app/",
        githubUrl: null,
        featured: true
    }
];
