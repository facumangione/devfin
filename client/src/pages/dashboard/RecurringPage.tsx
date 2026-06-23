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

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pt-2">
        <div>
          <h1 className="text-xl font-semibold text-lavender-800 dark:text-white">Pagos recurrentes</h1>
          <p className="text-sm text-lavender-400 dark:text-lavender-200/60 mt-0.5">
            Se generan automáticamente cada mes
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-lavender-400 hover:bg-lavender-600 text-white font-semibold rounded-xl px-4 py-2 text-sm transition-colors"
        >
          + Agregar
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border-2 border-lavender-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : payments.length === 0 ? (
        <div className="glass rounded-2xl text-center py-16">
          <p className="text-3xl mb-3">🔄</p>
          <p className="text-lavender-400 dark:text-lavender-200/70 text-sm">No hay pagos recurrentes</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-lavender-600 dark:text-lavender-200 hover:underline text-sm font-medium"
          >
            Crear el primero
          </button>
        </div>
      ) : (
        <>
          {/* Active */}
          {active.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-lavender-400 dark:text-lavender-200/70 mb-3 uppercase tracking-wide">
                Activos ({active.length})
              </h2>
              <div className="glass rounded-2xl overflow-hidden divide-y divide-white/40 dark:divide-white/5">
                {active.map((payment) => (
                  <div key={payment.id} className="flex items-center gap-4 p-4 group">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ backgroundColor: `${payment.category.color}25` }}
                    >
                      {payment.category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-lavender-800 dark:text-white truncate">
                        {payment.description}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-lavender-400 dark:text-lavender-200/60">
                        <span>{payment.category.name}</span>
                        <span>·</span>
                        <span>Próximo: {formatDate(payment.nextDueDate)}</span>
                        {payment.totalInstallments && (
                          <>
                            <span>·</span>
                            <span>
                              Cuota {payment.paidInstallments + 1}/{payment.totalInstallments}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-semibold ${payment.type === 'INCOME' ? 'text-mint-400 dark:text-emerald-300' : 'text-peach-400 dark:text-rose-300'}`}>
                        {payment.type === 'INCOME' ? '+' : '-'}${parseFloat(payment.amount).toLocaleString('es-AR')}
                      </p>
                      {payment.totalInstallments && (
                        <div className="mt-1 w-20 h-1.5 bg-lavender-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-1.5 bg-lavender-400 rounded-full"
                            style={{ width: `${(payment.paidInstallments / payment.totalInstallments) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(payment)}
                        className="p-1.5 text-lavender-400 hover:text-lavender-700 hover:bg-white/40 dark:hover:bg-white/10 rounded-lg transition-colors text-xs"
                      >✏️</button>
                      <button
                        onClick={() => handleToggle(payment)}
                        className="p-1.5 text-lavender-400 hover:text-lavender-700 hover:bg-white/40 dark:hover:bg-white/10 rounded-lg transition-colors text-xs"
                        title="Pausar"
                      >⏸️</button>
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="p-1.5 text-lavender-400 hover:text-peach-600 hover:bg-peach-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors text-xs"
                      >🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inactive */}
          {inactive.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-lavender-400 dark:text-lavender-200/70 mb-3 uppercase tracking-wide">
                Completados / pausados ({inactive.length})
              </h2>
              <div className="glass rounded-2xl overflow-hidden divide-y divide-white/40 dark:divide-white/5 opacity-60">
                {inactive.map((payment) => (
                  <div key={payment.id} className="flex items-center gap-4 p-4 group">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 grayscale"
                      style={{ backgroundColor: `${payment.category.color}15` }}
                    >
                      {payment.category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-lavender-800 dark:text-white truncate line-through">
                        {payment.description}
                      </p>
                      <p className="text-xs text-lavender-400 dark:text-lavender-200/60 mt-0.5">
                        {payment.totalInstallments
                          ? `Completado — ${payment.paidInstallments}/${payment.totalInstallments} cuotas`
                          : 'Pausado'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!payment.totalInstallments && (
                        <button
                          onClick={() => handleToggle(payment)}
                          className="p-1.5 text-lavender-400 hover:text-mint-600 hover:bg-mint-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors text-xs"
                          title="Reactivar"
                        >▶️</button>
                      )}
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="p-1.5 text-lavender-400 hover:text-peach-600 hover:bg-peach-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors text-xs"
                      >🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showForm && <RecurringForm payment={editing} onClose={handleClose} />}
    </div>
  )
}
