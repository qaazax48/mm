interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'purple';
}

const colorClasses = {
  blue: 'bg-blue-50 border-blue-500 text-blue-600',
  green: 'bg-green-50 border-green-500 text-green-600',
  yellow: 'bg-yellow-50 border-yellow-500 text-yellow-600',
  purple: 'bg-purple-50 border-purple-500 text-purple-600',
};

const iconColorClasses = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  yellow: 'text-yellow-500',
  purple: 'text-purple-500',
};

export default function StatsCard({ title, value, icon, color = 'blue' }: StatsCardProps) {
  return (
    <div className={`rounded-xl shadow-md p-6 ${colorClasses[color]} border-2`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-extrabold">{value}</p>
        </div>
        {icon && <div className={`text-3xl ${iconColorClasses[color]}`}>{icon}</div>}
      </div>
    </div>
  );
} 