import { useContext } from "react"
import { ChatUserContext } from "../context/ChatUserContext"

export const useChatUserContext = () => {
    const context = useContext(ChatUserContext)

    if(!context) {
        throw Error('useChatUserContext must be used inside an ChatUserContextProvider')
    }

    return context
}