import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import SectionTitle from '../components/SectionTitle'
import { emitNotification, getErrorMessage } from '../utils/notifications'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    try {
      await api.post('/api/auth/register', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        password: form.password,
      })

      const text = 'Cadastro realizado com sucesso. Agora você pode entrar.'
      setMessage(text)
      emitNotification({
        type: 'success',
        title: 'Cadastro concluído',
        description: text,
      })
      navigate('/admin')
    } catch (error) {
      const description = getErrorMessage(error)
      setMessage(description)
      emitNotification({
        type: 'error',
        title: 'Não foi possível cadastrar',
        description,
      })
    }
  }

  return (
    <section className="panel">
      <SectionTitle eyebrow="Cadastre-se" title="Criar conta" description="Preencha seus dados para criar seu acesso." />

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            <span className="field-label">Nome</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label>
            <span className="field-label">E-mail</span>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label>
            <span className="field-label">Telefone</span>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label>
            <span className="field-label">Senha</span>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </label>
        </div>

        <div className="row row--space">
          <button type="submit" className="button">
            Cadastre-se
          </button>
          <Link to="/admin" className="button button--ghost">
            Já tenho conta
          </Link>
        </div>
      </form>

      {message ? <p className="success">{message}</p> : null}
    </section>
  )
}
