export interface Volunteer {
  fullNameArabic: string;
  governorate: string;
  university: string;
  timestamp: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface TimeSeriesData {
  hour: string;
  count: number;
} 