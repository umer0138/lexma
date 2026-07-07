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
  videos: {
    kicker: "Video Production",
    titlePre: "Motion that ",
    titleEm: "moves buyers.",
    sub: "Three ways we bring a listing to life on screen — from cinematic tours to scroll-stopping social clips.",
    comingSoon: "Preview coming soon",
    cats: {
      tour: {
        label: "Video Tour",
        desc: "A cinematic, full-property walkthrough film — smooth, bright and paced to sell.",
      },
      reel: {
        label: "Social Media Reel",
        desc: "Vertical, fast-cut clips built for Instagram, TikTok and Facebook — where buyers scroll first.",
      },
      animated: {
        label: "Animated Tour / Virtual Walkthrough",
        desc: "An interactive room-to-room journey you control with your scroll — try it below.",
        cta: "Experience it",
      },
    },
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
        desc: "Websites, landing pages, contact forms, quote request pages, WhatsApp and email connections, and internal system connections — a clean, professional online presence built to convert.",
      },
      {
        name: "Branding & Graphic Materials",
        desc: "Logos, basic brand identity, business cards, brochures, flyers, promotional graphics, and the visual materials that make a business look established and trustworthy.",
      },
      {
        name: "AI Business Assistants",
        desc: "AI assistants that answer questions, organize information, prepare replies, summarize conversations, help with quotes, and support internal business tasks.",
      },
      {
        name: "Automation & CRM Systems",
        desc: "WhatsApp automation, forms, client follow-up, reminders, alerts, lead organization, CRM, and Google Sheets connections — so no lead ever falls through the cracks.",
      },
      {
        name: "Custom Business Software",
        desc: "Custom systems, internal portals, private catalogs, booking systems, inventory tools, dashboards, and business tools built around exactly how your business works.",
      },
      {
        name: "Business Tool Integration",
        desc: "Connecting websites, forms, WhatsApp, email, calendars, databases, reports, and internal systems so everything works together automatically.",
      },
      {
        name: "SEO, Ads & Email Marketing",
        desc: "Basic SEO, Google Ads, email campaigns, newsletters, promotions, customer follow-up, reporting, and the tools that make a business more visible.",
      },
    ],
  },
  outro: {
    kicker: "Greater Houston Area",
    titlePre: "Ready to make your listing ",
    titleEm: "move?",
    sub: "Tell us about your property or project — we'll reply with a custom quote. Fast turnaround, no obligations.",
    ctaQuote: "Request a Quote",
    ctaWhats: "Text or WhatsApp Us",
    callPre: "Call or text",
  },
  footer: {
    bigPre: "Let's make it ",
    bigEm: "happen.",
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
    note: "We reply fast — or skip the form and text or WhatsApp us directly at 346-558-6955.",
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
  videos: {
    kicker: "Producción de Video",
    titlePre: "Movimiento que ",
    titleEm: "conquista compradores.",
    sub: "Tres formas de darle vida a una propiedad en pantalla — desde tours cinematográficos hasta clips que detienen el scroll.",
    comingSoon: "Vista previa próximamente",
    cats: {
      tour: {
        label: "Video Tour",
        desc: "Un recorrido cinematográfico completo de la propiedad — fluido, luminoso y hecho para vender.",
      },
      reel: {
        label: "Social Media Reel",
        desc: "Clips verticales y dinámicos para Instagram, TikTok y Facebook — donde los compradores miran primero.",
      },
      animated: {
        label: "Tour Animado / Recorrido Virtual",
        desc: "Un recorrido interactivo habitación por habitación que controlas con tu scroll — pruébalo abajo.",
        cta: "Vívelo",
      },
    },
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
        desc: "Sitios web, landing pages, formularios de contacto, páginas de cotización, conexiones con WhatsApp y email, y conexiones con sistemas internos — una presencia en línea limpia y profesional, hecha para convertir.",
      },
      {
        name: "Branding y Material Gráfico",
        desc: "Logos, identidad de marca, tarjetas de presentación, folletos, flyers, gráficos promocionales y el material visual que hace que un negocio se vea establecido y confiable.",
      },
      {
        name: "Asistentes de Negocio con IA",
        desc: "Asistentes de IA que responden preguntas, organizan información, preparan respuestas, resumen conversaciones, ayudan con cotizaciones y apoyan tareas internas del negocio.",
      },
      {
        name: "Automatización y Sistemas CRM",
        desc: "Automatización de WhatsApp, formularios, seguimiento de clientes, recordatorios, alertas, organización de leads, CRM y conexiones con Google Sheets — para que ningún lead se pierda.",
      },
      {
        name: "Software Empresarial a Medida",
        desc: "Sistemas a medida, portales internos, catálogos privados, sistemas de reservas, herramientas de inventario, dashboards y herramientas construidas alrededor de cómo funciona tu negocio.",
      },
      {
        name: "Integración de Herramientas",
        desc: "Conectamos sitios web, formularios, WhatsApp, email, calendarios, bases de datos, reportes y sistemas internos para que todo funcione junto, automáticamente.",
      },
      {
        name: "SEO, Ads y Email Marketing",
        desc: "SEO básico, Google Ads, campañas de email, boletines, promociones, seguimiento de clientes, reportes y las herramientas que hacen más visible a un negocio.",
      },
    ],
  },
  outro: {
    kicker: "Área Metropolitana de Houston",
    titlePre: "¿Listo para hacer mover ",
    titleEm: "tu propiedad?",
    sub: "Cuéntanos sobre tu propiedad o proyecto — te responderemos con una cotización a tu medida. Respuesta rápida, sin compromiso.",
    ctaQuote: "Pedir Cotización",
    ctaWhats: "Mensaje de Texto o WhatsApp",
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
