import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, PieLabelRenderProps } from 'recharts';
import { useEffect, useState } from 'react';

interface ChartData {
  name: string;
  value: number;
}

interface UniversityChartProps {
  data: ChartData[];
}

interface ProcessedData extends ChartData {
  percentage: number;
}

interface TooltipData {
  payload?: {
    percentage?: number;
    value?: number;
  }[];
}

const COLORS = [
  '#1D4ED8', // أزرق غامق
  '#3B82F6', // أزرق متوسط
  '#60A5FA', // أزرق فاتح
  '#93C5FD', // أزرق سماوي
  '#BFDBFE', // أزرق فاتح جداً
  '#DBEAFE', // أزرق باهت
];

// تنظيف وتوحيد أسماء الجامعات
const normalizeUniversityName = (name: string): string => {
  name = name.trim().replace(/\s+/g, ' ').toLowerCase();
  
  // توحيد جامعة عين شمس
  if (name.includes('عين شمس') || name.includes('ain shams')) {
    return 'جامعة عين شمس';
  }
  
  // توحيد جامعة القاهرة
  if (name.includes('cairo') || name.includes('القاهرة')) {
    return 'جامعة القاهرة';
  }

  // توحيد جامعة حلوان
  if (name.includes('helwan') || name.includes('حلوان')) {
    return 'جامعة حلوان';
  }

  // توحيد جامعة الأزهر
  if (name.includes('azhar') || name.includes('ازهر') || name.includes('أزهر')) {
    return 'جامعة الأزهر';
  }

  // توحيد جامعة المنصورة
  if (name.includes('منصور')) {
    return 'جامعة المنصورة';
  }

  // توحيد جامعة الإسكندرية
  if (name.includes('alex') || name.includes('اسكندري') || name.includes('إسكندري')) {
    return 'جامعة الإسكندرية';
  }

  // حالات خاصة
  if (name === 'منتظر التنسيق' || name.includes('لسة') || name.includes('ثانوي')) {
    return 'منتظر التنسيق';
  }

  // إضافة كلمة جامعة إذا لم تكن موجودة
  if (!name.includes('جامع') && !name.includes('منتظر') && !name.includes('معهد')) {
    return `جامعة ${name}`;
  }

  // تحويل الحرف الأول إلى كبير
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export default function UniversityChart({ data }: UniversityChartProps) {
  const [dimensions, setDimensions] = useState({
    height: 400,
    outerRadius: 150,
    innerRadius: 70,
    fontSize: 14,
    legendFontSize: 14,
    legendItems: 6
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth <= 768) {
        setDimensions({
          height: 300,
          outerRadius: 80,
          innerRadius: 40,
          fontSize: 11,
          legendFontSize: 10,
          legendItems: 4
        });
      } else if (window.innerWidth <= 1024) {
        setDimensions({
          height: 350,
          outerRadius: 100,
          innerRadius: 50,
          fontSize: 12,
          legendFontSize: 11,
          legendItems: 5
        });
      } else {
        setDimensions({
          height: 400,
          outerRadius: 150,
          innerRadius: 70,
          fontSize: 14,
          legendFontSize: 14,
          legendItems: 6
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    if (!props.cx || !props.cy || !props.midAngle || !props.innerRadius || !props.outerRadius || !props.percent) {
      return null;
    }
    
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.7;
    const x = Number(cx) + radius * Math.cos(-Number(midAngle) * Math.PI / 180);
    const y = Number(cy) + radius * Math.sin(-Number(midAngle) * Math.PI / 180);

    if (window.innerWidth <= 768) {
      if (percent < 0.15) return null;
    } else {
      if (percent < 0.08) return null;
    }

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        style={{ 
          fontSize: dimensions.fontSize,
          fontWeight: 'bold',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // تجميع البيانات حسب الجامعات بعد التنظيف
  const groupedData = data.reduce((acc, item) => {
    const normalizedName = normalizeUniversityName(item.name);
    if (!acc[normalizedName]) {
      acc[normalizedName] = { name: normalizedName, value: 0 };
    }
    acc[normalizedName].value += item.value;
    return acc;
  }, {} as Record<string, ChartData>);

  const cleanedData = Object.values(groupedData);
  const total = cleanedData.reduce((sum, item) => sum + item.value, 0);
  
  const processedData = cleanedData
    .map(item => ({
      name: item.name,
      value: item.value,
      percentage: (item.value / total) * 100
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .reduce((acc, university) => {
      if (acc.length < dimensions.legendItems && university.percentage >= 3) {
        acc.push(university);
      } else {
        const othersIndex = acc.findIndex(item => item.name === 'جامعات أخرى');
        if (othersIndex === -1) {
          acc.push({ 
            name: 'جامعات أخرى',
            value: university.value,
            percentage: university.percentage
          });
        } else {
          acc[othersIndex].value += university.value;
          acc[othersIndex].percentage += university.percentage;
        }
      }
      return acc;
    }, [] as ProcessedData[]);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 text-center">التوزيع حسب الجامعة</h3>
      <div style={{ height: dimensions.height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: window.innerWidth <= 768 ? 20 : 0, left: 0 }}>
            <Pie
              data={processedData}
              cx="50%"
              cy={window.innerWidth <= 768 ? "40%" : "50%"}
              labelLine={false}
              outerRadius={dimensions.outerRadius}
              innerRadius={dimensions.innerRadius}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={renderCustomizedLabel}
            >
              {processedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string, entry: TooltipData) => {
                const percentage = entry?.payload?.[0]?.percentage;
                return [
                  `${value} متطوع (${percentage?.toFixed(1) ?? 0}%)`,
                  name
                ];
              }}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px',
                color: '#1E40AF',
                fontWeight: 'bold',
                direction: 'rtl',
                fontSize: dimensions.fontSize,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            />
            <Legend 
              layout={window.innerWidth <= 768 ? "horizontal" : "vertical"}
              align={window.innerWidth <= 768 ? "center" : "right"}
              verticalAlign={window.innerWidth <= 768 ? "bottom" : "middle"}
              wrapperStyle={{
                paddingTop: window.innerWidth <= 768 ? '10px' : '0',
                fontSize: dimensions.legendFontSize,
                direction: 'rtl',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                width: '100%'
              }}
              formatter={(value: string, entry: { payload?: { percentage?: number; value?: number } }) => {
                const percentage = entry?.payload?.percentage;
                const count = entry?.payload?.value;
                const displayText = window.innerWidth <= 768
                  ? `${value} (${percentage?.toFixed(1)}%)`
                  : `${value} (${count} متطوع - ${percentage?.toFixed(1)}%)`;
                
                return (
                  <span style={{ 
                    color: '#1E40AF', 
                    fontWeight: 'bold',
                    display: 'inline-block',
                    marginLeft: window.innerWidth <= 768 ? '4px' : '8px',
                    whiteSpace: 'nowrap',
                    fontSize: dimensions.legendFontSize
                  }}>
                    {displayText}
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 
