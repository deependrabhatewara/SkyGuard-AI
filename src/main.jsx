import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { registerSW } from "virtual:pwa-register";
import App from './App.jsx'
import "@fontsource-variable/noto-sans-devanagari/wght.css";
import { LanguageProvider } from "./context/LanguageContext";

registerSW({ immediate: true });
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
