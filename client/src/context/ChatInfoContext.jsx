import React, {useContext, createContext, useState} from 'react'

export const ChatInfoContext = createContext()

function ChatInfoContextProvider({ children }) {
    const [isChatInfoOpen, setIsChatInfoOpen] = useState(false)

    const toggleChatInfo = () => {
        setIsChatInfoOpen(!isChatInfoOpen)
    }
  return (
    <ChatInfoContext.Provider value = {{isChatInfoOpen, toggleChatInfo}}>
      { children }
    </ChatInfoContext.Provider>
  )
}

export default ChatInfoContextProvider