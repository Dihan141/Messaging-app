import { useReducer } from "react";
import { createContext } from "react";

export const MessageContext = createContext();

export const MESSAGE_ACTIONS = {
    SET_MESSAGES: 'SET_MESSAGES',
    ADD_MESSAGE: 'ADD_MESSAGE',
    DELETE_MESSAGE: 'DELETE_MESSAGE',
    UPDATE_MESSAGE: 'UPDATE_MESSAGE'
}

export const messageReducer = (state, action) => {
    switch (action.type) {
        case MESSAGE_ACTIONS.SET_MESSAGES:
            return { messages: action.payload }
        case MESSAGE_ACTIONS.ADD_MESSAGE:
            return { messages: [...state.messages, action.payload] }
        default:
            return state
    }
}

export const MessageContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(messageReducer, {
        messages: []
    })

    console.log('MessageContext state:', state)

    return (
        <MessageContext.Provider value={{ ...state, dispatch }}>
            { children }
        </MessageContext.Provider>
    )
}