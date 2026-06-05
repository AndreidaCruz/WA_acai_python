const listeners = new Set()
let nextId = 1

export function emitNotification(notification) {
  const payload = {
    id: nextId++,
    title: notification.title || '',
    description: notification.description || '',
    type: notification.type || 'info',
  }

  for (const listener of listeners) {
    listener(payload)
  }

  return payload.id
}

export function subscribeNotifications(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getErrorMessage(error) {
  const responseDetail = error?.response?.data?.detail

  if (Array.isArray(responseDetail)) {
    return responseDetail.join(' ')
  }

  if (typeof responseDetail === 'string' && responseDetail.trim()) {
    if (responseDetail === 'Invalid credentials') return 'Usuário inválido.'
    if (responseDetail === 'Authentication required') return 'Você precisa entrar para continuar.'
    if (responseDetail === 'Admin access required') return 'Você não tem permissão de administrador.'
    if (responseDetail === 'User not found') return 'Usuário não encontrado.'
    return responseDetail
  }

  if (error?.message === 'Network Error') {
    return 'Não foi possível conectar ao servidor.'
  }

  return 'Não foi possível concluir a operação.'
}

export function getErrorTitle(error) {
  const status = error?.response?.status
  const method = String(error?.config?.method || '').toLowerCase()
  const path = String(error?.config?.url || '').split('?')[0]

  if (path === '/api/auth/login' && status === 401) return 'Usuário inválido'
  if (path === '/api/auth/bootstrap-admin' && status >= 400) return 'Falha no setup'
  if (path === '/api/orders' && method === 'post' && status >= 400) return 'Pedido não concluído'
  if (path.startsWith('/api/orders/track/')) return null
  if (path.startsWith('/api/admin/orders') && status === 401) return 'Sessão expirada'
  if (path.startsWith('/api/admin') && status === 403) return 'Permissão negada'
  if (path.startsWith('/api/orders') && method !== 'post' && status >= 400) return 'Falha no acompanhamento'
  if (status === 403) return 'Permissão negada'
  if (status === 422) return 'Dados inválidos'
  if (status >= 500) return 'Erro no servidor'
  return 'Atenção'
}
