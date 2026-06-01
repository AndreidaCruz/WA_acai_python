import { useEffect, useState } from 'react'
import api from '../services/api'
import SectionTitle from '../components/SectionTitle'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    api.get('/api/orders').then(({ data }) => setOrders(data))
  }, [])

  return (
    <section className="panel">
      <SectionTitle eyebrow="Pedidos" title="Histórico operacional" description="Pedidos recebidos pelo backend." />
      <div className="stack">
        {orders.map((order) => (
          <article key={order.id} className="card card--compact">
            <div className="row">
              <strong>{order.number}</strong>
              <span className="chip">{order.status}</span>
            </div>
            <p>{order.customer_name} · {order.phone}</p>
            <small>{order.address}</small>
          </article>
        ))}
      </div>
    </section>
  )
}
