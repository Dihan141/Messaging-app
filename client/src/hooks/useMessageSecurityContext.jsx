import { useContext } from "react"
import { MessageSecurityContext } from "../context/MessageSecurityContext"

export const useMessageSecurityContext = () => {
    const context = useContext(MessageSecurityContext)

    if(!context) {
        throw Error('useMessageSecurityContext must be used inside an MessageSecurityContextProvider')
    }

    return context
}