import { createRoot } from 'react-dom/client'
import { GoogleSheetsProvider } from "./contexts/formsGoogleSheetsContext.jsx";
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GoogleSheetsProvider>
      <App />
    </GoogleSheetsProvider>
  </BrowserRouter>
)
