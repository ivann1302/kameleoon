export interface Variation {
  id?: number;
  name: string;
}

export interface DayData {
  date: string;
  visits: Record<string, number>;
  conversions: Record<string, number>;
}

export interface RawData {
  variations: Variation[];
  data: DayData[];
}

export interface ChartDataPoint {
  date: string;
  [variationId: string]: string | number;
}

