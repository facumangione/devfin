import { useEffect, useState } from 'react'
import { useRecurringStore } from '../../store/recurring.store'
import { RecurringPayment } from '../../types/recurring.types'
import RecurringForm from '../../components/recurring/RecurringForm'

export default function RecurringPage() {
  const { payments, isLoading, fetchPayments, deletePayment, updatePayment } = useRecurringStore()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<RecurringPayment | null>(null)

  useEffect(() => {
    fetchPayments()
  }, [])

  const handleEdit = (payment: RecurringPayment) => {
    setEditing(payment)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditing(null)
  }

  const handleToggle = async (payment: RecurringPayment) => {
    await updatePayment(payment.id, { active: !payment.active })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este pago recurrente?')) return
    await deletePayment(id)
  }

  const active = payments.filter((p) => p.active)
  const inactive = payments.filter((p) => !p.active)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  const PaymentRow = ({ payment, faded = false }: { payment: RecurringPayment; faded?: boolean }) => (
    <div className={`flex items-center gap-4 px-4 py-3 group transition-colors hover:bg-white/20 dark:hover:bg-white/5 ${faded ? 'opacity-50' : ''}`}>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium text-lavender-800 dark:text-white truncate ${faded ? 'line-through' : ''}`}>
          {payment.description}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-lavender-400 dark:text-lavender-200/50">
          <span>{payment.category.name}</span>
          {!faded && (
            <>
              <span>·</span>
              <span>Próximo {formatDate(payment.nextDueDate)}</span>
              {payment.totalInstallments && (
                <>
                  <span>·</span>
                  <span>{payment.paidInstallments + 1}/{payment.totalInstallments}</span>
                </>
              )}
            </>
          )}
          {faded && (
            <>
              <span>·</span>
              <span>{payment.totalInstallments ? `${payment.paidInstallments}/${payment.totalInstallments} cuotas` : 'Pausado'}</span>
            </>
          )}
        </div>
        {payment.totalInstallments && !faded && (
          <div className="mt-1.5 w-24 h-1 bg-lavender-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-1 bg-lavender-400 dark:bg-lavender-300 rounded-full"
              style={{ width: `${(payment.paidInstallments / payment.totalInstallments) * 100}%` }}
            />
          </div>
        )}
      </div>

      <p className={`text-sm font-medium tabular-nums shrink-0 ${
        payment.type === 'INCOME'
          ? 'text-lavender-800 dark:text-white'
          : 'text-lavender-400 dark:text-lavender-200/70'
      }`}>
        {payment.type === 'INCOME' ? '+' : '−'}${parseFloat(payment.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
      </p>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!faded && (
          <button
            onClick={() => handleEdit(payment)}
            className="p-1.5 text-lavender-400 dark:text-lavender-200/50 hover:text-lavender-700 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <button
          onClick={() => handleToggle(payment)}
          className="p-1.5 text-lavender-400 dark:text-lavender-200/50 hover:text-lavender-700 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10 rounded-lg transition-colors"
          title={faded ? 'Reactivar' : 'Pausar'}
        >
          {faded ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          )}
        </button>
        <button
          onClick={() => handleDelete(payment.id)}
          className="p-1.5 text-lavender-400 dark:text-lavender-200/50 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pt-2">
        <div>
          <h1 className="text-xl font-semibold text-lavender-800 dark:text-white">Recurrentes</h1>
          <p className="text-sm text-lavender-400 dark:text-lavender-200/60 mt-0.5">
            Se generan automáticamente cada mes
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="glass-strong text-lavender-700 dark:text-lavender-200 font-medium rounded-xl px-4 py-2 text-sm transition-colors hover:bg-white/40 dark:hover:bg-white/10"
        >
          + Agregar
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-4 h-4 border-2 border-lavender-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : payments.length === 0 ? (
        <div className="glass rounded-2xl text-center py-16">
          <p className="text-lavender-400 dark:text-lavender-200/60 text-sm">Sin pagos recurrentes</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-lavender-600 dark:text-lavender-200 hover:underline text-xs"
          >
            Crear el primero
          </button>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-medium text-lavender-400 dark:text-lavender-200/50 mb-3 uppercase tracking-wider">
                Activos · {active.length}
              </p>
              <div className="glass rounded-2xl overflow-hidden divide-y divide-white/40 dark:divide-white/5">
                {active.map((p) => <PaymentRow key={p.id} payment={p} />)}
              </div>
            </div>
          )}

          {inactive.length > 0 && (
            <div>
              <p className="text-xs font-medium text-lavender-400 dark:text-lavender-200/50 mb-3 uppercase tracking-wider">
                Pausados · {inactive.length}
              </p>
              <div className="glass rounded-2xl overflow-hidden divide-y divide-white/40 dark:divide-white/5">
                {inactive.map((p) => <PaymentRow key={p.id} payment={p} faded />)}
              </div>
            </div>
          )}
        </>
      )}

      {showForm && <RecurringForm payment={editing} onClose={handleClose} />}
    </div>
  )
}