import { createContext, useReducer, useEffect } from 'react'
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    const checkTokenValidity = async () => {
      const response = await axios.get(`${backendUrl}/api/auth/token-check`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      if(!response.data.success){
        dispatch({ type: 'LOGOUT' })
      }
    }

    if (user) {
      dispatch({ type: 'LOGIN', payload: user }) 
      checkTokenValidity()
    }
  }, [])

  console.log('AuthContext state:', state)
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )

}