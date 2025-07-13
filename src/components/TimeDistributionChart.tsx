import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface TimeData {
  timestamp: string;
}

interface TimeDistributionChartProps {
  data: TimeData[];
}

export default function TimeDistributionChart({ data }: TimeDistributionChartProps) {
  const [chartDimensions, setChartDimensions] = useState({ 
    height: 400
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth <= 768) {
        setChartDimensions({ height: 300 });
      } else {
        setChartDimensions({ height: 400 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // تحويل التواريخ إلى ساعات وتجميع البيانات
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    return {
      hour: hour.getHours(),
      count: 0,
      label: `${hour.getHours()}:00`
    };
  });

  // تجميع البيانات حسب الساعة
  data.forEach(item => {
    const timestamp = new Date(item.timestamp);
    if (timestamp >= twentyFourHoursAgo && timestamp <= now) {
      const hourIndex = hourlyData.findIndex(h => h.hour === timestamp.getHours());
      if (hourIndex !== -1) {
        hourlyData[hourIndex].count++;
      }
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 text-center">
        التوزيع حسب آخر 24 ساعة
      </h3>
      <div style={{ height: chartDimensions.height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={hourlyData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="label"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{
                fill: '#1E40AF',
                fontSize: window.innerWidth <= 768 ? 10 : 12,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            />
            <YAxis
              tick={{
                fill: '#1E40AF',
                fontSize: window.innerWidth <= 768 ? 10 : 12,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
              label={{ 
                value: 'عدد المتطوعين',
                angle: -90,
                position: 'insideLeft',
                style: {
                  fill: '#1E40AF',
                  fontSize: window.innerWidth <= 768 ? 12 : 14,
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }
              }}
            />
            <Tooltip
              formatter={(value: number) => [`${value} متطوع`, 'عدد المتطوعين']}
              labelFormatter={(label: string) => `الساعة ${label}`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px',
                color: '#1E40AF',
                fontWeight: 'bold',
                direction: 'rtl',
                fontSize: window.innerWidth <= 768 ? '12px' : '14px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              name="عدد المتطوعين"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 