import { Children, createContext, useReducer } from "react";

export const MessageSecurityContext = createContext()

export const MESSAGE_SECURITY_ACTIONS = {
    SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
    CHANGE_CONNECTION_STATUS: 'CHANGE_CONNECTION_STATUS'
}

const isConApproved = (conStatus, id) => {
    const { approved } = conStatus.connection
    if(approved.includes(id))
        return true
    return false
}

const isConPending = (conStatus, id) => {
    const { pending } = conStatus.connection
    if(pending.includes(id))
        return true
    return false
}

const isConBlocked = (conStatus, id) => {
    const { blocked } = conStatus.connection
    if(blocked.includes(id))
        return true
    return false
}

const generateConStatus = (currUserConStatus, chatUserConStatus, currUserId, chatUserId) => {
    if(isConApproved(currUserConStatus, chatUserId) && isConApproved(chatUserConStatus, currUserId))
        return {currUserConnectionStatus: 'approved', chatUserConnectionStatus: 'approved'}
    if(isConPending(currUserConStatus, chatUserId) && isConApproved(chatUserConStatus, currUserId))
        return {currUserConnectionStatus: 'pending', chatUserConnectionStatus: 'approved'}
    if(isConApproved(currUserConStatus, chatUserId) && isConPending(chatUserConStatus, currUserId))
        return {currUserConnectionStatus: 'approved', chatUserConnectionStatus: 'pending'}
    if(isConBlocked(currUserConStatus, chatUserId) && isConApproved(chatUserConStatus, currUserId))
        return {currUserConnectionStatus: 'blocked', chatUserConnectionStatus: 'approved'}
    if(isConApproved(currUserConStatus, chatUserId) && isConBlocked(chatUserConStatus, currUserId))
        return {currUserConnectionStatus: 'approved', chatUserConnectionStatus: 'blocked'}
}

export const messageSecurityReducer = (state, action) => {
    switch (action.type) {
        case MESSAGE_SECURITY_ACTIONS.SET_CONNECTION_STATUS:
            console.log(action.payload)
            const { currUserConStatus, chatUserConStatus, currUserId, chatUserId } = action.payload
            // console.log(isConApproved(currUserConStatus, chatUserId))
            // console.log(isConPending(currUserConStatus, chatUserId))
            // console.log(isConBlocked(currUserConStatus, chatUserId))
            const newStatus = generateConStatus(currUserConStatus, chatUserConStatus, currUserId, chatUserId)
            if(!newStatus)
                return state
            return newStatus
        case MESSAGE_SECURITY_ACTIONS.CHANGE_CONNECTION_STATUS:
            return state
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