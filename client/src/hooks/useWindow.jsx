import { useContext } from "react"
import { WindowContext } from "../context/WindowContext"

export const useWindow = () => {
    const context = useContext(WindowContext)

    if(!context) {
        throw Error('useWindow must be used inside an WindowContextProvider')
    }

    return context
}