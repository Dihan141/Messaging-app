import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import WindowContextProvider from './context/WindowContext.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { MessageContextProvider } from './context/MessageContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <UserContextProvider>
        <MessageContextProvider>
          <WindowContextProvider>
            <App />
          </WindowContextProvider>
        </MessageContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
