import { useEffect, useState } from 'react';

interface ChartData {
  name: string;
  value: number;
}

interface GovernorateChartProps {
  data: ChartData[];
}

const COLORS = [
  '#3B82F6', // أزرق فاتح
  '#1D4ED8', // أزرق متوسط
  '#2563EB', // أزرق
  '#1E40AF', // أزرق غامق
  '#60A5FA', // أزرق سماوي
  '#93C5FD', // أزرق فاتح جداً
];

export default function GovernorateChart({ data }: GovernorateChartProps) {
  const [dimensions, setDimensions] = useState({
    fontSize: 13
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth <= 768) {
        setDimensions({
          fontSize: 11
        });
      } else if (window.innerWidth <= 1024) {
        setDimensions({
          fontSize: 12
        });
      } else {
        setDimensions({
          fontSize: 13
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // ترتيب البيانات تنازلياً
  const sortedData = [...data]
    .sort((a, b) => b.value - a.value)
    .map(item => ({
      ...item,
      percentage: (item.value / data.reduce((sum, d) => sum + d.value, 0) * 100).toFixed(1)
    }));

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 text-center">التوزيع حسب المحافظة</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-blue-900">المحافظة</th>
              <th className="px-4 py-3 text-sm font-semibold text-blue-900">عدد المتطوعين</th>
              <th className="px-4 py-3 text-sm font-semibold text-blue-900">النسبة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((item, index) => (
              <tr 
                key={item.name}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-blue-50">
                    <span className="text-sm font-semibold text-blue-900">{item.value}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-blue-50">
                    <span className="text-sm font-semibold text-blue-900">{item.percentage}%</span>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-3 text-sm text-blue-900">الإجمالي</td>
              <td className="px-4 py-3">
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-blue-100">
                  <span className="text-sm font-semibold text-blue-900">
                    {data.reduce((sum, item) => sum + item.value, 0)}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-blue-100">
                  <span className="text-sm font-semibold text-blue-900">100%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 