import React from 'react'

export default class AppCrashBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) {
      console.error('WA Açaí app crash', error)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '1.5rem' }}>
          <div className="panel panel--warning" style={{ maxWidth: 640, width: '100%' }}>
            <strong>Não foi possível carregar a interface.</strong>
            <p className="muted">
              A página encontrou um problema ao iniciar. Tente recarregar a aba. Se persistir, limpe os dados do site no navegador.
            </p>
            <button type="button" className="button" onClick={() => window.location.reload()}>
              Recarregar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
