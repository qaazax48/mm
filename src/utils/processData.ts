import { Volunteer, ChartData, TimeSeriesData } from '@/types';

export function processGovernorateData(data: Volunteer[]): ChartData[] {
  const governorateCounts = data.reduce((acc: { [key: string]: number }, item) => {
    acc[item.governorate] = (acc[item.governorate] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(governorateCounts).map(([name, value]) => ({
    name,
    value,
  }));
}

export function processUniversityData(data: Volunteer[]): ChartData[] {
  const universityCounts = data.reduce((acc: { [key: string]: number }, item) => {
    acc[item.university] = (acc[item.university] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(universityCounts).map(([name, value]) => ({
    name,
    value,
  }));
}

export function processTimeSeriesData(data: Volunteer[]): TimeSeriesData[] {
  const hourCounts = data.reduce((acc: { [key: string]: number }, item) => {
    const hour = new Date(item.timestamp).getHours();
    const hourStr = `${hour}:00`;
    acc[hourStr] = (acc[hourStr] || 0) + 1;
    return acc;
  }, {});

  // Create array for all 24 hours
  const timeSeriesData: TimeSeriesData[] = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    count: 0,
  }));

  // Fill in actual counts
  Object.entries(hourCounts).forEach(([hour, count]) => {
    const index = parseInt(hour);
    if (timeSeriesData[index]) {
      timeSeriesData[index].count = count;
    }
  });

  return timeSeriesData;
} 