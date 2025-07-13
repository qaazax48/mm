import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimeSeriesData {
  hour: string;
  count: number;
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
}

export default function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  // تحويل تنسيق الساعة إلى 12 ساعة
  const formattedData = data.map(item => ({
    ...item,
    hour: `${parseInt(item.hour) % 12 || 12}:00 ${parseInt(item.hour) >= 12 ? 'م' : 'ص'}`
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">التوزيع حسب الساعة</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="hour"
              tick={{ 
                fill: '#374151',
                fontSize: 12
              }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ 
                fill: '#374151',
                fontSize: 12
              }}
              label={{ 
                value: 'عدد المتطوعين', 
                angle: -90, 
                position: 'insideLeft',
                style: {
                  fill: '#374151',
                  fontSize: 14,
                  fontWeight: 'bold'
                }
              }}
            />
            <Tooltip
              formatter={(value: number) => [`${value} متطوع`, 'عدد المتطوعين']}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px'
              }}
              labelStyle={{
                color: '#374151',
                fontWeight: 'bold'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#2563EB"
              strokeWidth={3}
              name="عدد المتطوعين"
              dot={{
                fill: '#2563EB',
                stroke: '#fff',
                strokeWidth: 2,
                r: 6
              }}
              activeDot={{
                fill: '#2563EB',
                stroke: '#fff',
                strokeWidth: 2,
                r: 8
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 