import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import SectionTitle from '../components/SectionTitle'
import { emitNotification } from '../utils/notifications'

const INITIAL_SETTINGS = {
  id: 1,
  nome_loja: 'WA Açaí',
  slogan: '',
  descricao_loja: '',
  telefone: '',
  whatsapp: '',
  instagram: '',
  facebook: '',
  endereco: '',
  taxa_entrega: 0,
  tempo_medio_entrega: '',
  loja_aberta: true,
  mensagem_loja_fechada: '',
  logo_url: '',
  banner_url: '',
  favicon_url: '',
  pwa_icon_url: '',
  primary_color: '#6f2dbd',
  secondary_color: '#a855f7',
  theme_color: '#6f2dbd',
  meta_title: '',
  meta_description: '',
  pwa_name: '',
  pwa_short_name: '',
  pwa_description: '',
}

function normalizeSettings(data) {
  return {
    ...INITIAL_SETTINGS,
    ...data,
    taxa_entrega: Number(data?.taxa_entrega || 0),
    loja_aberta: Boolean(data?.loja_aberta),
  }
}

function SettingCard({ title, description, children }) {
  return (
    <section className="card settings-card">
      <div className="stack">
        <div className="stack stack--tight">
          <strong>{title}</strong>
          {description ? <p className="muted">{description}</p> : null}
        </div>
        <div className="settings-card__body">{children}</div>
      </div>
    </section>
  )
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/api/settings').then(({ data }) => setSettings(normalizeSettings(data)))
  }, [])

  const canSave = useMemo(() => Boolean(settings?.nome_loja?.trim()), [settings])

  async function saveSettings() {
    if (!settings) return
    setSaving(true)
    setMessage('')
    try {
      const { data } = await api.put('/api/settings/admin', settings)
      setSettings(normalizeSettings(data))
      setMessage('Configurações salvas com sucesso.')
      emitNotification({
        type: 'success',
        title: 'Configurações atualizadas',
        description: 'As preferências da loja foram salvas.',
      })
    } catch {
      setMessage('Não foi possível salvar as configurações.')
      emitNotification({
        type: 'error',
        title: 'Falha ao salvar',
        description: 'Verifique os campos e tente novamente.',
      })
    } finally {
      setSaving(false)
    }
  }

  function updateField(field, value) {
    setSettings((current) => ({ ...current, [field]: value }))
  }

  if (!settings) return <div className="panel">Carregando configurações...</div>

  return (
    <section className="stack">
      <section className="panel">
        <SectionTitle
          eyebrow="Configurações"
          title="Preferências da loja"
          description="Ajuste os dados básicos que aparecem para o cliente e a operação diária do aplicativo."
        />
        <div className="row row--space settings-actions">
          <span className="chip">{settings.loja_aberta ? 'Loja aberta' : 'Loja fechada'}</span>
          <button type="button" className="button" onClick={saveSettings} disabled={!canSave || saving}>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
        {message ? <p className="success">{message}</p> : null}
      </section>

      <div className="settings-grid">
        <SettingCard title="Loja" description="Nome e apresentação principal da loja.">
          <div className="form-grid">
            <label>
              <span className="field-label">
                Nome da loja <span className="required-mark">*</span>
              </span>
              <input
                placeholder="Ex.: WA Açaí"
                value={settings.nome_loja}
                onChange={(e) => updateField('nome_loja', e.target.value)}
              />
            </label>
            <label>
              <span className="field-label">Slogan</span>
              <input placeholder="Ex.: Seu açaí favorito" value={settings.slogan || ''} onChange={(e) => updateField('slogan', e.target.value)} />
            </label>
            <label className="settings-span-2">
              <span className="field-label">Descrição</span>
              <textarea
                placeholder="Descreva a loja, atendimento, horário ou diferenciais."
                value={settings.descricao_loja || ''}
                onChange={(e) => updateField('descricao_loja', e.target.value)}
                rows={4}
              />
            </label>
          </div>
        </SettingCard>

        <SettingCard title="Atendimento" description="Contato e presença da marca no aplicativo.">
          <div className="form-grid">
            <label>
              <span className="field-label">Telefone</span>
              <input placeholder="(00) 00000-0000" value={settings.telefone || ''} onChange={(e) => updateField('telefone', e.target.value)} />
            </label>
            <label>
              <span className="field-label">WhatsApp</span>
              <input placeholder="(00) 00000-0000" value={settings.whatsapp || ''} onChange={(e) => updateField('whatsapp', e.target.value)} />
            </label>
            <label>
              <span className="field-label">Instagram</span>
              <input placeholder="@waacai" value={settings.instagram || ''} onChange={(e) => updateField('instagram', e.target.value)} />
            </label>
            <label>
              <span className="field-label">Facebook</span>
              <input placeholder="Nome da página" value={settings.facebook || ''} onChange={(e) => updateField('facebook', e.target.value)} />
            </label>
            <label className="settings-span-2">
              <span className="field-label">Endereço</span>
              <input placeholder="Rua, número, bairro e cidade" value={settings.endereco || ''} onChange={(e) => updateField('endereco', e.target.value)} />
            </label>
          </div>
        </SettingCard>

        <SettingCard title="Entrega" description="Regras básicas de operação e taxa de entrega.">
          <div className="form-grid">
            <label>
              <span className="field-label">Taxa de entrega</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={settings.taxa_entrega}
                onChange={(e) => updateField('taxa_entrega', Number(e.target.value))}
              />
            </label>
            <label>
              <span className="field-label">Tempo médio</span>
              <input placeholder="Ex.: 30 a 45 min" value={settings.tempo_medio_entrega || ''} onChange={(e) => updateField('tempo_medio_entrega', e.target.value)} />
            </label>
            <label className="settings-switch">
              <span className="field-label">Loja aberta</span>
              <button
                type="button"
                className={`switch ${settings.loja_aberta ? 'switch--on' : ''}`}
                onClick={() => updateField('loja_aberta', !settings.loja_aberta)}
                aria-pressed={settings.loja_aberta}
              >
                <span className="switch__thumb" />
              </button>
            </label>
            <label className="settings-span-2">
              <span className="field-label">Mensagem quando fechada</span>
              <input
                placeholder="Ex.: Estamos fechados agora. Voltamos às 18h."
                value={settings.mensagem_loja_fechada || ''}
                onChange={(e) => updateField('mensagem_loja_fechada', e.target.value)}
              />
            </label>
          </div>
        </SettingCard>

        <SettingCard title="Aparência" description="Cores e imagem que representam a marca.">
          <div className="form-grid">
            <label>
              <span className="field-label">Cor primária</span>
              <input type="color" value={settings.primary_color || '#6f2dbd'} onChange={(e) => updateField('primary_color', e.target.value)} />
            </label>
            <label>
              <span className="field-label">Cor secundária</span>
              <input type="color" value={settings.secondary_color || '#a855f7'} onChange={(e) => updateField('secondary_color', e.target.value)} />
            </label>
            <label>
              <span className="field-label">Tema</span>
              <input type="color" value={settings.theme_color || '#6f2dbd'} onChange={(e) => updateField('theme_color', e.target.value)} />
            </label>
            <label className="settings-span-2">
              <span className="field-label">Logo URL</span>
              <input placeholder="https://..." value={settings.logo_url || ''} onChange={(e) => updateField('logo_url', e.target.value)} />
            </label>
            <label>
              <span className="field-label">Banner URL</span>
              <input placeholder="https://..." value={settings.banner_url || ''} onChange={(e) => updateField('banner_url', e.target.value)} />
            </label>
            <label>
              <span className="field-label">Favicon URL</span>
              <input placeholder="https://..." value={settings.favicon_url || ''} onChange={(e) => updateField('favicon_url', e.target.value)} />
            </label>
          </div>
        </SettingCard>

        <SettingCard title="Aplicativo" description="Nome e textos usados no PWA e no dispositivo do cliente.">
          <div className="form-grid">
            <label>
              <span className="field-label">Nome do app</span>
              <input placeholder="WA Açaí" value={settings.pwa_name || ''} onChange={(e) => updateField('pwa_name', e.target.value)} />
            </label>
            <label>
              <span className="field-label">Nome curto</span>
              <input placeholder="WA Açaí" value={settings.pwa_short_name || ''} onChange={(e) => updateField('pwa_short_name', e.target.value)} />
            </label>
            <label className="settings-span-2">
              <span className="field-label">Descrição do app</span>
              <input placeholder="Aplicativo de pedidos e estoque" value={settings.pwa_description || ''} onChange={(e) => updateField('pwa_description', e.target.value)} />
            </label>
            <label className="settings-span-2">
              <span className="field-label">Meta título</span>
              <input placeholder="WA Açaí" value={settings.meta_title || ''} onChange={(e) => updateField('meta_title', e.target.value)} />
            </label>
            <label className="settings-span-2">
              <span className="field-label">Meta descrição</span>
              <textarea
                placeholder="Descreva rapidamente o aplicativo para mecanismos de busca."
                value={settings.meta_description || ''}
                onChange={(e) => updateField('meta_description', e.target.value)}
                rows={3}
              />
            </label>
          </div>
        </SettingCard>
      </div>
    </section>
  )
}
