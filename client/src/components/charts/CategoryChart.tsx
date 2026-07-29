import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface CategoryData {
  name: string
  icon: string
  color: string
  total: number
}

interface Props {
  data: CategoryData[]
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const item = payload[0].payload

  return (
    <div className="glass-strong rounded-xl p-3 text-xs shadow-xl">
      <p className="font-medium text-lavender-800 dark:text-white">
        {item.icon} {item.name}
      </p>
      <p className="text-lavender-400 dark:text-lavender-200/70 mt-1">
        Total: <span className="text-peach-600 dark:text-rose-300 font-semibold">${item.total.toFixed(2)}</span>
      </p>
    </div>
  )
}

const CustomLegend = ({ payload }: any) => (
  <div className="flex flex-col gap-1.5 mt-2">
    {payload?.map((entry: any) => (
      <div key={entry.value} className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-lavender-400 dark:text-lavender-200/70">
            {entry.payload.icon} {entry.value}
          </span>
        </div>
        <span className="text-lavender-700 dark:text-lavender-100 font-medium ml-4">
          ${entry.payload.total.toFixed(2)}
        </span>
      </div>
    ))}
  </div>
)

export default function CategoryChart({ data }: Props) {
  const top = data.slice(0, 6)

  return (
    <div>
      <h3 className="font-semibold text-lavender-800 dark:text-white mb-4">Egresos por categoría</h3>
      {top.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-lavender-400 dark:text-lavender-200/60 text-sm">
          Sin egresos este mes
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={top}
              cx="40%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="total"
              nameKey="name"
            >
              {top.map((entry, index) => (
                <Cell key={index} fill={entry.color} opacity={0.85} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              content={<CustomLegend />}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
