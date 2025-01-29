import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import WindowContextProvider from './context/WindowContext.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { MessageContextProvider } from './context/MessageContext.jsx'
import { ChatUserContextProvider } from './context/ChatUserContext.jsx'
import { MessageSecurityContextProvider } from './context/MessageSecurityContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <UserContextProvider>
        <ChatUserContextProvider>
          <MessageSecurityContextProvider>
            <MessageContextProvider>
              <WindowContextProvider>
                <App />
              </WindowContextProvider>
            </MessageContextProvider>
          </MessageSecurityContextProvider>
        </ChatUserContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
