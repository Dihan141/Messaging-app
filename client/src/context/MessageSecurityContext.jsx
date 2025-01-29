import { Children, createContext, useReducer } from "react";

export const MessageSecurityContext = createContext()

export const MESSAGE_SECURITY_ACTIONS = {
    SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS'
}

export const messageSecurityReducer = (state, action) => {
    switch (action.type) {
        case MESSAGE_SECURITY_ACTIONS.SET_CONNECTION_STATUS:
            return ''
        default:
            return state
    }
}

export const MessageSecurityContextProvider = ({ children }) => {
    const [state, dispatchSecurityAction] = useReducer(messageSecurityReducer, {
        currUserConnectionStatus: 'approved',
        chatUserConnectionStatus: 'approved'
    })

    console.log('Message security state: ', state)

    return(
        <MessageSecurityContext.Provider value={{ ...state, dispatchSecurityAction }}>
            { children }
        </MessageSecurityContext.Provider>
    )
}