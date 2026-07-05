"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ------------------------------------------------------------------ */
/* Dictionaries                                                        */
/* ------------------------------------------------------------------ */

const EN = {
  nav: {
    services: "Services",
    portfolio: "Portfolio",
    about: "About",
    contact: "Contact",
    quote: "Request a Quote",
    brandSub: "Real Estate Photography",
  },
  hero: {
    kicker: "Lexma · Real Estate Photography",
    words: ["Showcase.", "Impress.", "Sell."],
    subPre: "High-impact property media that makes listings move — ",
    subEm: "photography, drone, staging & digital solutions",
    subPost: " for the Greater Houston Area.",
    ctaQuote: "Request a Quote",
    ctaPortfolio: "View Portfolio",
    scroll: "Scroll",
  },
  intro: {
    kicker: "The Lexma Standard",
    sentence:
      "We don't just photograph properties. We craft the first impression that sells them — frame by frame, pixel by pixel.",
    goldWords: ["first", "impression", "sells"],
  },
  photoServices: {
    kicker: "What We Shoot",
    quote: "Request a Quote",
    items: [
      {
        pre: "Real Estate ",
        em: "Photography",
        desc: "Magazine-grade interior & exterior photography that makes buyers stop scrolling. Every room, perfectly lit.",
      },
      {
        pre: "Drone ",
        em: "Photo & Video",
        desc: "FAA-grade aerial media that shows the full story — the lot, the neighborhood, the lifestyle.",
      },
      {
        pre: "Virtual ",
        em: "Staging",
        desc: "Empty rooms become warm, styled spaces buyers can imagine living in — honestly and beautifully.",
      },
      {
        pre: "Airbnb & ",
        em: "Commercial",
        desc: "Listings that book faster and spaces that close deals — shot for the platforms where they perform.",
      },
      {
        pre: "Twilight & ",
        em: "Signature Shots",
        desc: "Golden-hour and dusk photography that gives every listing its magazine-cover moment.",
      },
    ],
  },
  drone: {
    kicker: "From Above",
    titlePre: "Your listing, ",
    titleEm: "from the sky.",
    stats: ["Ultra HD Media", "Full Property Views", "Professional Editing"],
  },
  interiors: {
    kicker: "Inside The Frame",
    titlePre: "Interiors that ",
    titleEm: "feel like home.",
    hint: "Scroll → to explore",
  },
  walkthrough: {
    kicker: "Virtual Walkthroughs",
    titlePre: "Walk the home ",
    titleEm: "before you visit.",
    hint: "Scroll to walk",
  },
  scene: {
    kicker: "Behind The Lens",
    titlePre: "Watch the shot ",
    titleEm: "come to life.",
    caption: "“Every listing gets the hero treatment.”",
    caps: ["Exterior", "Aerial", "Interior"],
  },
  featured: {
    kicker: "Featured Work",
    titlePre: "Proof, not ",
    titleEm: "promises.",
    cta: "View Full Portfolio",
  },
  solutions: {
    kicker: "Beyond The Camera",
    titlePre: "Digital solutions that make your ",
    titleEm: "whole business",
    titlePost: " move.",
    sub: "Lexma Solutions builds the digital engine behind modern businesses — websites, automation, AI workflows and marketing systems. No fixed menus, no cookie-cutter packages: tell us what you need and request a quote.",
    quote: "Request a Quote",
    services: [
      {
        name: "Website Design & Development",
        desc: "Professional websites for businesses, service providers, real estate brands, and companies that need a clean online presence — landing pages, business websites, contact and quote forms, booking options, and sites connected to WhatsApp, email, or CRM systems.",
      },
      {
        name: "Custom Business Software",
        desc: "Custom digital systems built for business operations — client portals, admin dashboards, booking systems, internal platforms, private catalogs, inventory tools, and custom online platforms designed around your workflow.",
      },
      {
        name: "Automation Services",
        desc: "Automation for repetitive business tasks that saves time and reduces manual work — automated forms, email notifications, WhatsApp alerts, Google Sheets updates, lead follow-ups, appointment reminders, and automated reporting.",
      },
      {
        name: "Business Tool Integration",
        desc: "Connecting your business tools so they work together automatically — website forms to Google Sheets, CRM systems, email campaigns, WhatsApp notifications, calendars, quote requests, and internal databases.",
      },
      {
        name: "AI Automation & Intelligent Workflows",
        desc: "AI-powered workflows that help businesses manage information, respond faster, and organize operations — AI-assisted replies, customer classification, automated summaries, document review, report generation, and smart multi-tool workflows.",
      },
      {
        name: "SEO & Google Ads",
        desc: "Search visibility and paid advertising for businesses that want to appear better online — on-page SEO optimization, Google search visibility improvements, keyword targeting, and Google Ads campaign setup.",
      },
      {
        name: "Email Marketing Automation",
        desc: "Automated email campaigns for customer follow-up, promotions, reminders, newsletters, and sales sequences — stay connected with leads and clients without manually sending every message.",
      },
      {
        name: "WhatsApp & CRM Automation",
        desc: "Capture and organize leads from WhatsApp, website forms, or social media — automatic replies, lead collection, customer segmentation, follow-up alerts, and client data stored neatly in a CRM or Google Sheets system.",
      },
      {
        name: "Business Dashboards & Reports",
        desc: "Simple dashboards and reports that help business owners track leads, sales, appointments, campaign results, customer activity, and monthly performance at a glance.",
      },
      {
        name: "AI Business Assistants",
        desc: "Custom AI assistants designed to support business operations — answering common questions, organizing leads, preparing responses, summarizing conversations, creating quotes, and supporting internal team tasks.",
      },
    ],
  },
  outro: {
    kicker: "Greater Houston Area",
    titlePre: "Ready to make your listing ",
    titleEm: "move?",
    sub: "Tell us about your property or project — we'll reply with a custom quote. Fast turnaround, no obligations.",
    ctaQuote: "Request a Quote",
    ctaWhats: "WhatsApp Us",
    callPre: "Call or text",
  },
  footer: {
    bigPre: "Let's make it ",
    bigEm: "move.",
    bigSub: "Request a Quote",
    brandLine:
      "Professional real estate media & digital solutions serving the Greater Houston Area.",
    explore: "Explore",
    services: "Services",
    contact: "Contact",
    area: "Greater Houston Area, TX",
    rights: "All rights reserved.",
    marquee: [
      "Photography",
      "Drone Media",
      "Virtual Staging",
      "Airbnb",
      "Commercial",
      "Websites",
      "Automation",
      "AI Workflows",
      "SEO & Ads",
    ],
    links: {
      photography: "Real Estate Photography",
      drone: "Drone Photo & Video",
      staging: "Virtual Staging",
      solutions: "Digital Solutions",
    },
  },
  form: {
    name: "Name *",
    namePh: "Your name",
    phone: "Phone *",
    email: "Email *",
    address: "Property address / area",
    addressPh: "Street, city or area",
    service: "Service needed *",
    servicePh: "Select a service…",
    date: "Preferred date",
    message: "Message / details",
    messagePh:
      "Tell us about the property or project — size, timeline, anything that helps us quote accurately. You can also email us reference files at info@lexmasolutions.com.",
    submit: "Send Quote Request",
    note: "We reply fast — or skip the form and WhatsApp us directly at 346-558-6955.",
    sent: "✓ Thank you! Your request was sent — we'll get back to you shortly with a quote.",
  },
};

type Dict = typeof EN;

const ES: Dict = {
  nav: {
    services: "Servicios",
    portfolio: "Portafolio",
    about: "Nosotros",
    contact: "Contacto",
    quote: "Pedir Cotización",
    brandSub: "Fotografía Inmobiliaria",
  },
  hero: {
    kicker: "Lexma · Fotografía Inmobiliaria",
    words: ["Muestra.", "Impresiona.", "Vende."],
    subPre: "Contenido visual de alto impacto que mueve tus propiedades — ",
    subEm: "fotografía, dron, staging y soluciones digitales",
    subPost: " para el área metropolitana de Houston.",
    ctaQuote: "Pedir Cotización",
    ctaPortfolio: "Ver Portafolio",
    scroll: "Desliza",
  },
  intro: {
    kicker: "El Estándar Lexma",
    sentence:
      "No solo fotografiamos propiedades. Creamos la primera impresión que las vende — cuadro a cuadro, píxel a píxel.",
    goldWords: ["primera", "impresión", "vende"],
  },
  photoServices: {
    kicker: "Lo Que Fotografiamos",
    quote: "Pedir Cotización",
    items: [
      {
        pre: "Fotografía ",
        em: "Inmobiliaria",
        desc: "Fotografía de interiores y exteriores con calidad de revista que detiene a los compradores. Cada espacio, perfectamente iluminado.",
      },
      {
        pre: "Foto y Video ",
        em: "con Dron",
        desc: "Tomas aéreas profesionales que cuentan toda la historia — el terreno, el vecindario, el estilo de vida.",
      },
      {
        pre: "Staging ",
        em: "Virtual",
        desc: "Espacios vacíos se convierten en ambientes cálidos donde los compradores se imaginan viviendo — con honestidad y buen gusto.",
      },
      {
        pre: "Airbnb y ",
        em: "Comercial",
        desc: "Anuncios que se reservan más rápido y espacios que cierran tratos — fotografiados para las plataformas donde deben rendir.",
      },
      {
        pre: "Twilight y ",
        em: "Tomas Exclusivas",
        desc: "Fotografía al atardecer que le da a cada propiedad su momento de portada de revista.",
      },
    ],
  },
  drone: {
    kicker: "Desde El Aire",
    titlePre: "Tu propiedad, ",
    titleEm: "desde el cielo.",
    stats: ["Media Ultra HD", "Vistas Completas", "Edición Profesional"],
  },
  interiors: {
    kicker: "Dentro Del Encuadre",
    titlePre: "Interiores que ",
    titleEm: "se sienten como hogar.",
    hint: "Desliza → para explorar",
  },
  walkthrough: {
    kicker: "Recorridos Virtuales",
    titlePre: "Recorre la casa ",
    titleEm: "antes de visitarla.",
    hint: "Desliza para caminar",
  },
  scene: {
    kicker: "Detrás Del Lente",
    titlePre: "Mira cómo nace ",
    titleEm: "la toma.",
    caption: "“Cada propiedad recibe un tratamiento de héroe.”",
    caps: ["Exterior", "Aéreo", "Interior"],
  },
  featured: {
    kicker: "Trabajo Destacado",
    titlePre: "Pruebas, no ",
    titleEm: "promesas.",
    cta: "Ver Portafolio Completo",
  },
  solutions: {
    kicker: "Más Allá De La Cámara",
    titlePre: "Soluciones digitales que hacen mover ",
    titleEm: "todo tu negocio",
    titlePost: ".",
    sub: "Lexma Solutions construye el motor digital de los negocios modernos — sitios web, automatización, flujos con IA y sistemas de marketing. Sin menús fijos ni paquetes genéricos: dinos qué necesitas y pide tu cotización.",
    quote: "Pedir Cotización",
    services: [
      {
        name: "Diseño y Desarrollo Web",
        desc: "Sitios web profesionales para negocios, proveedores de servicios, marcas inmobiliarias y empresas que necesitan presencia en línea — landing pages, sitios corporativos, formularios de contacto y cotización, reservas, y sitios conectados a WhatsApp, email o CRM.",
      },
      {
        name: "Software Empresarial a Medida",
        desc: "Sistemas digitales a medida para operaciones de negocio — portales de clientes, paneles administrativos, sistemas de reservas, plataformas internas, catálogos privados y herramientas de inventario diseñadas según tu flujo de trabajo.",
      },
      {
        name: "Servicios de Automatización",
        desc: "Automatización de tareas repetitivas que ahorra tiempo y reduce trabajo manual — formularios automáticos, notificaciones por email, alertas de WhatsApp, actualizaciones en Google Sheets, seguimiento de leads, recordatorios de citas y reportes automáticos.",
      },
      {
        name: "Integración de Herramientas",
        desc: "Conectamos tus herramientas de negocio para que trabajen juntas — formularios web con Google Sheets, sistemas CRM, campañas de email, notificaciones de WhatsApp, calendarios, cotizaciones y bases de datos internas.",
      },
      {
        name: "Automatización con IA y Flujos Inteligentes",
        desc: "Flujos impulsados por IA que ayudan a gestionar información, responder más rápido y organizar operaciones — respuestas asistidas, clasificación de clientes, resúmenes automáticos, revisión de documentos y generación de reportes.",
      },
      {
        name: "SEO y Google Ads",
        desc: "Visibilidad en buscadores y publicidad pagada para negocios que quieren destacar en línea — optimización SEO, mejoras de visibilidad en Google, segmentación de palabras clave y configuración de campañas de Google Ads.",
      },
      {
        name: "Automatización de Email Marketing",
        desc: "Campañas de email automatizadas para seguimiento, promociones, recordatorios, boletines y secuencias de venta — mantente conectado con tus clientes sin enviar cada mensaje manualmente.",
      },
      {
        name: "Automatización de WhatsApp y CRM",
        desc: "Captura y organiza leads de WhatsApp, formularios web o redes sociales — respuestas automáticas, recolección de leads, segmentación de clientes, alertas de seguimiento y datos ordenados en un CRM o Google Sheets.",
      },
      {
        name: "Dashboards y Reportes de Negocio",
        desc: "Paneles y reportes simples para que los dueños de negocio vean de un vistazo sus leads, ventas, citas, resultados de campañas, actividad de clientes y rendimiento mensual.",
      },
      {
        name: "Asistentes de Negocio con IA",
        desc: "Asistentes de IA a medida que apoyan la operación del negocio — responden preguntas frecuentes, organizan leads, preparan respuestas, resumen conversaciones, crean cotizaciones y apoyan tareas internas del equipo.",
      },
    ],
  },
  outro: {
    kicker: "Área Metropolitana de Houston",
    titlePre: "¿Listo para hacer mover ",
    titleEm: "tu propiedad?",
    sub: "Cuéntanos sobre tu propiedad o proyecto — te responderemos con una cotización a tu medida. Respuesta rápida, sin compromiso.",
    ctaQuote: "Pedir Cotización",
    ctaWhats: "Escríbenos por WhatsApp",
    callPre: "Llama o escribe al",
  },
  footer: {
    bigPre: "Hagámoslo ",
    bigEm: "mover.",
    bigSub: "Pedir Cotización",
    brandLine:
      "Media inmobiliaria profesional y soluciones digitales para el área metropolitana de Houston.",
    explore: "Explorar",
    services: "Servicios",
    contact: "Contacto",
    area: "Área de Houston, TX",
    rights: "Todos los derechos reservados.",
    marquee: [
      "Fotografía",
      "Dron",
      "Staging Virtual",
      "Airbnb",
      "Comercial",
      "Sitios Web",
      "Automatización",
      "Flujos con IA",
      "SEO y Ads",
    ],
    links: {
      photography: "Fotografía Inmobiliaria",
      drone: "Foto y Video con Dron",
      staging: "Staging Virtual",
      solutions: "Soluciones Digitales",
    },
  },
  form: {
    name: "Nombre *",
    namePh: "Tu nombre",
    phone: "Teléfono *",
    email: "Email *",
    address: "Dirección / zona de la propiedad",
    addressPh: "Calle, ciudad o zona",
    service: "Servicio requerido *",
    servicePh: "Selecciona un servicio…",
    date: "Fecha preferida",
    message: "Mensaje / detalles",
    messagePh:
      "Cuéntanos sobre la propiedad o el proyecto — tamaño, plazos, todo lo que nos ayude a cotizar con precisión. También puedes enviarnos archivos de referencia a info@lexmasolutions.com.",
    submit: "Enviar Solicitud",
    note: "Respondemos rápido — o salta el formulario y escríbenos por WhatsApp al 346-558-6955.",
    sent: "✓ ¡Gracias! Tu solicitud fue enviada — te contactaremos pronto con una cotización.",
  },
};

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

type Lang = "en" | "es";

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}>({ lang: "en", setLang: () => {}, t: EN });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("lexma-lang");
    if (saved === "es") setLangState("es");
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("lexma-lang", l);
    document.documentElement.lang = l;
    // text lengths change layout — remeasure all scroll animations
    // after components have re-rendered and effects re-ran
    setTimeout(() => ScrollTrigger.refresh(), 120);
    setTimeout(() => ScrollTrigger.refresh(), 600);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: lang === "es" ? ES : EN }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
