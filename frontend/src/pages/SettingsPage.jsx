import { useEffect, useState } from 'react'
import api from '../services/api'
import SectionTitle from '../components/SectionTitle'

export default function SettingsPage() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    api.get('/api/settings').then(({ data }) => setSettings(data))
  }, [])

  if (!settings) return <div className="panel">Carregando configurações...</div>

  return (
    <section className="panel">
      <SectionTitle eyebrow="Configurações" title={settings.nome_loja} description={settings.slogan || settings.meta_description} />
      <div className="stack">
        <p><strong>Telefone:</strong> {settings.telefone}</p>
        <p><strong>Endereço:</strong> {settings.endereco}</p>
        <p><strong>Tema:</strong> {settings.primary_color}</p>
      </div>
    </section>
  )
}
