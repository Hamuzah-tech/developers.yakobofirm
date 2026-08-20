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
        websiteUrl: null
    },
    {
        name: "GPC Malawi",
        logo: "assets/images/logos/c-logo2.jpg",
        websiteUrl: null
    },
    {
        name: "YAISK Garden",
        logo: "assets/images/logos/c-logo3.jpg",
        websiteUrl: null
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
 *               Leave "" until you have it. The yellow button still appears.
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
        name: "Latoya Assurance Limited",
        category: "corporate",
        description: "A corporate insurance website built for a Malawi-based provider, presenting products, trust and service information in a refined, institutional layout.",
        image: "assets/images/projects/latoya.svg",
        technologies: ["HTML", "CSS", "JavaScript"],
        websiteUrl: "",
        githubUrl: null,
        featured: true
    },
    {
        name: "GPC Malawi",
        category: "organisations",
        description: "A women-led organisation website focused on programmes, impact and community work for adolescent girls and young women across Malawi.",
        image: "assets/images/projects/gpc.svg",
        technologies: ["HTML", "CSS", "JavaScript"],
        websiteUrl: "",
        githubUrl: null,
        featured: true
    },
    {
        name: "QuickFund Malawi",
        category: "business",
        description: "A modern finance website designed to communicate loan products, trust and accessibility for individuals and small businesses.",
        image: "assets/images/projects/quickfund.svg",
        technologies: ["HTML", "CSS", "JavaScript"],
        websiteUrl: "",
        githubUrl: null,
        featured: true
    },
    {
        name: "Kuwala Schools",
        category: "schools",
        description: "A distinctive education website built to express school identity, academic offering and a premium admissions presence.",
        image: "assets/images/projects/kuwala.svg",
        technologies: ["HTML", "CSS", "JavaScript"],
        websiteUrl: "",
        githubUrl: null,
        featured: true
    },
    {
        name: "School Library Management System",
        category: "web-applications",
        description: "A custom web-based library system for issuing, returning and tracking books across student and librarian roles.",
        image: "assets/images/projects/slms.svg",
        technologies: ["PHP", "JavaScript", "HTML", "CSS"],
        websiteUrl: "",
        githubUrl: null,
        featured: true
    },
    {
        name: "Dwangwa & Partners",
        category: "corporate",
        description: "A professional law-firm website designed to present practice areas, credibility and a composed digital presence for a Malawian legal practice.",
        image: "assets/images/projects/dwangwa.svg",
        technologies: ["HTML", "CSS", "JavaScript"],
        websiteUrl: "",
        githubUrl: null,
        featured: false
    },
    {
        name: "Tina Beauty",
        category: "business",
        description: "A refined brand website for a makeup artist, built to showcase services, packages and a booking-ready online presence.",
        image: "assets/images/projects/tina-beauty.svg",
        technologies: ["HTML", "CSS", "JavaScript"],
        websiteUrl: "",
        githubUrl: null,
        featured: false
    },
    {
        name: "YAISK Garden",
        category: "business",
        description: "A venue presentation and pricelist experience designed to display event packages with clarity for clients and bookings teams.",
        image: "assets/images/projects/yaisk.svg",
        technologies: ["HTML", "CSS", "JavaScript"],
        websiteUrl: "",
        githubUrl: null,
        featured: false
    },
    {
        name: "Point of Sale System",
        category: "web-applications",
        description: "A web-based POS application for sales, inventory and reporting — designed around everyday operational workflows.",
        image: "assets/images/projects/pos.svg",
        technologies: ["PHP", "MySQL", "JavaScript", "HTML", "CSS"],
        websiteUrl: "",
        githubUrl: null,
        featured: false
    },
    {
        name: "Exam Results Portal",
        category: "web-applications",
        description: "A results-checking application that lets students and administrators access academic outcomes through a structured, secure interface.",
        image: "assets/images/projects/results.svg",
        technologies: ["PHP", "MySQL", "JavaScript", "HTML", "CSS"],
        websiteUrl: "",
        githubUrl: null,
        featured: false
    }
];
