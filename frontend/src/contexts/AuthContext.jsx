import { createContext, useContext, useEffect, useState } from 'react'
import api, { setAuthToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('waacai-token')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        setAuthToken(token)
        const { data } = await api.get('/api/auth/me')
        setUser(data)
      } catch {
        setAuthToken(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function setSession(token) {
    setAuthToken(token)
    const { data } = await api.get('/api/auth/me')
    setUser(data)
    return data
  }

  async function login(email, password) {
    const { data } = await api.post('/api/auth/login', { email, password })
    return setSession(data.access_token)
  }

  function logout() {
    setUser(null)
    setAuthToken(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, setSession }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
