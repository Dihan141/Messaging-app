import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import WindowContextProvider from './context/WindowContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <WindowContextProvider>
        <App />
      </WindowContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
