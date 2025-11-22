import type { Variation, RawData, DayData, ChartDataPoint } from '../types/data';

export function getVariationId(variation: Variation): string {
  return variation.id ? String(variation.id) : '0';
}

export function calculateConversionRate(conversions: number, visits: number): number {
  if (visits === 0) return 0;
  return (conversions / visits) * 100;
}

export function processDailyData(
  rawData: RawData,
  selectedVariationIds: string[]
): ChartDataPoint[] {
  return rawData.data.map((dayData) => {
    const chartPoint: ChartDataPoint = { date: dayData.date };

    selectedVariationIds.forEach((variationId) => {
      const visits = dayData.visits[variationId];
      const conversions = dayData.conversions[variationId];
      
      if (visits === undefined || conversions === undefined) {
        chartPoint[variationId] = null as unknown as number;
      } else if (visits === 0) {
        chartPoint[variationId] = 0;
      } else {
        chartPoint[variationId] = calculateConversionRate(conversions, visits);
      }
    });

    return chartPoint;
  });
}

export function groupByWeek(dailyData: DayData[]): DayData[] {
  const weeks: DayData[] = [];
  const daysPerWeek = 7;

  for (let i = 0; i < dailyData.length; i += daysPerWeek) {
    const weekData = dailyData.slice(i, i + daysPerWeek);
    const firstDate = weekData[0].date;
    const lastDate = weekData[weekData.length - 1].date;
    const weekDate = `${firstDate} - ${lastDate}`;

    const allVariationIds = new Set<string>();
    weekData.forEach((day) => {
      Object.keys(day.visits).forEach((id) => allVariationIds.add(id));
      Object.keys(day.conversions).forEach((id) => allVariationIds.add(id));
    });

    const weekVisits: Record<string, number> = {};
    const weekConversions: Record<string, number> = {};

    allVariationIds.forEach((variationId) => {
      weekVisits[variationId] = weekData.reduce(
        (sum, day) => sum + (day.visits[variationId] || 0),
        0
      );
      weekConversions[variationId] = weekData.reduce(
        (sum, day) => sum + (day.conversions[variationId] || 0),
        0
      );
    });

    weeks.push({
      date: weekDate,
      visits: weekVisits,
      conversions: weekConversions,
    });
  }

  return weeks;
}

export function getVariationName(variations: Variation[], variationId: string): string {
  const variation = variations.find((v) => getVariationId(v) === variationId);
  return variation?.name || variationId;
}

export function getVisibleDataRange(
  chartData: ChartDataPoint[],
  selectedVariationIds: string[]
): { min: number; max: number } {
  if (chartData.length === 0 || selectedVariationIds.length === 0) {
    return { min: 0, max: 100 };
  }

  const values: number[] = [];

  chartData.forEach((point) => {
    selectedVariationIds.forEach((variationId) => {
      const value = point[variationId];
      if (typeof value === 'number') {
        values.push(value);
      }
    });
  });

  if (values.length === 0) {
    return { min: 0, max: 100 };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.1;

  return {
    min: Math.max(0, min - padding),
    max: max + padding,
  };
}

