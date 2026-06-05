import { createContext, useContext, useEffect, useState } from 'react'
import api, { setAuthToken } from '../services/api'

const AuthContext = createContext(null)

const USER_CACHE_KEY = 'waacai-user'

function readCachedUser() {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeCachedUser(user) {
  if (user) {
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user))
    return
  }
  localStorage.removeItem(USER_CACHE_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readCachedUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('waacai-token')
      if (!token) {
        writeCachedUser(null)
        setLoading(false)
        return
      }
      try {
        setAuthToken(token)
        const { data } = await api.get('/api/auth/me')
        setUser(data)
        writeCachedUser(data)
      } catch (error) {
        const status = error?.response?.status
        if (status === 401 || status === 403) {
          setUser(null)
          writeCachedUser(null)
          setAuthToken(null)
        } else if (!user) {
          const cachedUser = readCachedUser()
          if (cachedUser) setUser(cachedUser)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function setSession(token) {
    setAuthToken(token)
    const { data } = await api.get('/api/auth/me')
    setUser(data)
    writeCachedUser(data)
    return data
  }

  async function login(email, password) {
    const { data } = await api.post('/api/auth/login', { email, password })
    return setSession(data.access_token)
  }

  function logout() {
    setUser(null)
    setAuthToken(null)
    writeCachedUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, setSession }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
