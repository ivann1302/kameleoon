import type { TooltipProps } from 'recharts';
import type { DayData, Variation } from '../../../types/data';
import { getVariationName } from '../../../utils/dataProcessing';
import { getVariationColor } from '../../../utils/colors';
import { formatDate } from '../../../utils/dateUtils';
import styles from './CustomTooltip.module.css';

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: number;
    name?: string;
    color?: string;
  }>;
  label?: string;
  rawData?: DayData[];
  variations: Variation[];
  selectedVariations: string[];
}

export default function CustomTooltip({
  active,
  payload,
  label,
  rawData,
  variations,
  selectedVariations,
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length || !label || !rawData) {
    return null;
  }

  const dayData = rawData.find((d) => d.date === label);
  if (!dayData) {
    return null;
  }

  return (
    <div className={styles.tooltip}>
      <div className={styles.date}>{formatDate(label, 'long')}</div>
      <div className={styles.content}>
        {selectedVariations.map((variationId, index) => {
          const visits = dayData.visits[variationId];
          const conversions = dayData.conversions[variationId];
          const payloadEntry = payload.find((p: { dataKey?: string }) => p.dataKey === variationId);
          const value = payloadEntry?.value as number | null | undefined;

          if (visits === undefined || conversions === undefined || value === null || value === undefined) {
            return null;
          }

          const conversionRate = visits > 0 ? (conversions / visits) * 100 : 0;

          return (
            <div key={variationId} className={styles.variation}>
              <div className={styles.variationHeader}>
                <div
                  className={styles.colorIndicator}
                  style={{ backgroundColor: getVariationColor(variationId, index) }}
                />
                <span className={styles.variationName}>
                  {getVariationName(variations, variationId)}
                </span>
              </div>
              <div className={styles.variationData}>
                <div className={styles.dataRow}>
                  <span>Conversion Rate:</span>
                  <span className={styles.value}>{conversionRate.toFixed(2)}%</span>
                </div>
                <div className={styles.dataRow}>
                  <span>Visits:</span>
                  <span className={styles.value}>{visits.toLocaleString()}</span>
                </div>
                <div className={styles.dataRow}>
                  <span>Conversions:</span>
                  <span className={styles.value}>{conversions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

