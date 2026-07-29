import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useThemeStore } from '../../store/theme.store'

interface MonthlyData {
  month: string
  income: number
  expenses: number
  balance: number
}

interface Props {
  data: MonthlyData[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null

  return (
    <div className="glass-strong rounded-xl p-3 text-xs shadow-xl">
      <p className="font-medium text-lavender-800 dark:text-white mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-lavender-400 dark:text-lavender-200/70 capitalize">{entry.name}:</span>
          <span className="font-medium text-lavender-800 dark:text-white">${entry.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  )
}

export default function MonthlyChart({ data }: Props) {
  const { isDark } = useThemeStore()
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(33,29,23,0.08)'
  const tickColor = isDark ? 'rgba(255,255,255,0.4)' : '#9c9186'
  const incomeColor = isDark ? '#5ea37c' : '#357a5e'
  const expensesColor = isDark ? '#e0876b' : '#bd5a4b'
  const balanceColor = isDark ? '#dbb769' : '#a17636'

  return (
    <div>
      <h3 className="font-semibold text-lavender-800 dark:text-white mb-4">Resumen mensual</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-lavender-400 dark:text-lavender-200/60 text-sm">
          Sin datos disponibles
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="month"
              tick={{ fill: tickColor, fontSize: 11 }}
              axisLine={{ stroke: gridColor }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: tickColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: tickColor, paddingTop: '12px' }}
            />
            <Line
              type="monotone"
              dataKey="income"
              name="Ingresos"
              stroke={incomeColor}
              strokeWidth={2}
              dot={{ fill: incomeColor, r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Egresos"
              stroke={expensesColor}
              strokeWidth={2}
              dot={{ fill: expensesColor, r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              name="Balance"
              stroke={balanceColor}
              strokeWidth={2}
              strokeDasharray="4 2"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
