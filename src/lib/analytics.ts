import ReactGA from "react-ga4";

// Initialize GA4 - Setup via Environment Variable
export const initGA = () => {
  const TRACKING_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
  if (TRACKING_ID) {
    ReactGA.initialize(TRACKING_ID);
    console.log("GA4 Initialized");
  } else {
    console.warn("GA4 Tracking ID missing");
  }
};

// Track Page Views
export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Track Custom Events (e.g., Button Clicks, Form Submits)
export const trackEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
