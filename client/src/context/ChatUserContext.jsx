import { createContext } from "react";
import { useReducer } from "react";

export const ChatUserContext = createContext();

export const CHAT_USER_ACTIONS = {
    SET_USER: 'SET_USER',
    UPDATE_STATUS: 'UPDATE_STATUS',
}

export const chatUserReducer = (state, action) => {
    switch (action.type){
        case CHAT_USER_ACTIONS.SET_USER:
            return { chatUser: action.payload }
        case CHAT_USER_ACTIONS.UPDATE_STATUS:
            const { activeUsers } = action.payload
            console.log('active users:', activeUsers)
            if(state.chatUser === null){
                return {...state}
            }
            if(activeUsers.includes(state.chatUser._id)){
                if(state.chatUser.active){
                    return {...state}
                }
                else {
                    console.log('setting active')
                    return {...state, chatUser: {...state.chatUser, active: true}}
                }
            }
            else {
                if(state.chatUser.active){
                    console.log('setting inactive')
                    return {...state, chatUser: {...state.chatUser, active: false, lastActive: new Date()}}
                }
                else {
                    return {...state}
                }
            }
        default:
            return state
    }
}

export const ChatUserContextProvider = ({ children }) => {
    const [state, dispatchChatUser] = useReducer(chatUserReducer, {
        chatUser: null,
    })

    console.log('ChatUserContext state:', state)

    return (
        <ChatUserContext.Provider value={{ ...state, dispatchChatUser }}>
            { children }
        </ChatUserContext.Provider>
    )
}