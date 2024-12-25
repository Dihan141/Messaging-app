import React, { act, createContext, useReducer } from 'react'

export const UserContext = createContext()

export const ACTIONS = {
    SET_USERS: 'SET_USERS',
    UPDATE_USERS: 'UPDATE_USERS',
    ADD_USER: 'ADD_USER',
}

export const userReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_USERS:
            return { users: action.payload.users, lastMessages: action.payload.lastMessages }
        case ACTIONS.UPDATE_USERS:
            console.log(action.payload)
            const index = state.users.findIndex((user) => user._id === action.payload.uid) //might change
            if (index === -1) {
                return { ...state, userNotFound: true, notFound: action.payload }
            }
            const user = state.users[index]
            const updatedList = state.users.filter((user) => user._id !== action.payload.uid) //might change
            updatedList.unshift(user) //might change

            const updatedMessagesList = state.lastMessages.filter((msg) => msg.senderId !== action.payload.msg.senderId || msg.receiverId !== action.payload.msg.receiverId)
            updatedMessagesList.unshift(action.payload.msg)
            return {...state, users: updatedList, lastMessages: updatedMessagesList, userNotFound: false }
        case ACTIONS.ADD_USER:
            console.log('adding user:', action.payload)
            return { users: [action.payload.user, ...state.users], lastMessages: [action.payload.msg, ...state.lastMessages], userNotFound: false }
        default:
            return state
    }
}

export const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, {
        users: [],
        lastMessages: [],
        userNotFound: false,
        notFoundId: null
    })

    console.log('UserContext state:', state)

    return (
        <UserContext.Provider value={{ ...state, dispatch }}>
            { children }
        </UserContext.Provider>
    )
}
