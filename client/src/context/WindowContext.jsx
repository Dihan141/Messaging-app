import React, {useContext, createContext, useState} from 'react'

export const WindowContext = createContext()

function WindowContextProvider({ children }) {
    const [isChatInfoOpen, setIsChatInfoOpen] = useState(false)
    const [isChatWindowOpen, setIsChatWindowOpen] = useState(false)

    const toggleChatInfo = () => {
        setIsChatInfoOpen(!isChatInfoOpen)
        console.log('is chat info open?', isChatInfoOpen)
    }

    const toggleChatWindow = (value) => {
        if(isChatInfoOpen) {
            setIsChatInfoOpen(false)
        }
        else {
            setIsChatWindowOpen(!isChatWindowOpen)
        }
        console.log('is chat window open?', isChatWindowOpen)
    }
  return (
    <WindowContext.Provider value = {{isChatInfoOpen, toggleChatInfo, isChatWindowOpen, toggleChatWindow}}>
      { children }
    </WindowContext.Provider>
  )
}

export default WindowContextProvider