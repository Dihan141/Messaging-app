import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import WindowContextProvider from './context/WindowContext.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { MessageContextProvider } from './context/MessageContext.jsx'
import { ChatUserContextProvider } from './context/ChatUserContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <UserContextProvider>
        <ChatUserContextProvider>
          <MessageContextProvider>
            <WindowContextProvider>
              <App />
            </WindowContextProvider>
          </MessageContextProvider>
        </ChatUserContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
