import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    localStorage.setItem('waacai-token', token)
  } else {
    delete api.defaults.headers.common.Authorization
    localStorage.removeItem('waacai-token')
  }
}

const savedToken = localStorage.getItem('waacai-token')
if (savedToken) {
  setAuthToken(savedToken)
}

export default api
