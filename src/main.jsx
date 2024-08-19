import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Test from './Test.jsx'
import FrontScreen from './FrontScreen.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    {/* <App /> */
      <>
        <QueryClientProvider client={queryClient}>
        <FrontScreen />
        </QueryClientProvider>

      </>
      
    
    
    }
  </React.StrictMode>,
)
