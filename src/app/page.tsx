'use client';

import { useEffect, useState } from 'react';
import StatsCard from '@/components/StatsCard';
import GovernorateChart from '@/components/GovernorateChart';
import UniversityChart from '@/components/UniversityChart';
import TimeDistributionChart from '@/components/TimeDistributionChart';
import { FaUsers, FaHistory, FaCheckCircle } from 'react-icons/fa';

interface Volunteer {
  timestamp: string;
  fullNameArabic: string;
  email: string;
  phone: string;
  governorate: string;
  university: string;
  faculty: string;
  year: string;
  committee: string;
  hasVolunteered: string;
  volunteerHistory: string;
  acceptTerms: string;
}

export default function Dashboard() {
  const [data, setData] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/sheets');
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    // تحديث البيانات كل دقيقة
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  // Process data for charts
  const governorateData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.governorate] = (acc[item.governorate] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const universityData = Object.entries(
    data.reduce((acc, item) => {
      acc[item.university] = (acc[item.university] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const previousVolunteers = data.filter(item => item.hasVolunteered === 'نعم').length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">لوحة معلومات المتطوعين</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="إجمالي المتطوعين" 
          value={data.length} 
          icon={<FaUsers />}
          color="blue"
        />
        <StatsCard 
          title="متطوعين سابقين" 
          value={previousVolunteers}
          icon={<FaHistory />}
          color="yellow"
        />
        <StatsCard 
          title="نسبة المتطوعين السابقين" 
          value={`${((previousVolunteers / data.length) * 100).toFixed(1)}%`}
          icon={<FaCheckCircle />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-8">
          <GovernorateChart data={governorateData} />
        </div>
        <UniversityChart data={universityData} />
      </div>

      <div className="w-full">
        <TimeDistributionChart data={data} />
      </div>
    </div>
  );
}
