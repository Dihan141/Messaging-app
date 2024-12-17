import { useContext } from "react"
import { ChatInfoContext } from "../context/ChatInfoContext"

export const useChatInfo = () => {
    const context = useContext(ChatInfoContext)

    if(!context) {
        throw Error('useChatInfo must be used inside an ChatInfoContextProvider')
    }

    return context
}