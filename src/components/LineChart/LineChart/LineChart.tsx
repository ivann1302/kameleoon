import { useState, useMemo, forwardRef } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from 'recharts';
import type { ChartDataPoint, Variation, DayData } from '../../../types/data';
import { getVariationName, getVisibleDataRange } from '../../../utils/dataProcessing';
import { getVariationColor } from '../../../utils/colors';
import { formatDate } from '../../../utils/dateUtils';
import type { LineStyle } from '../../Controls/LineStyleSelector/LineStyleSelector';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import styles from './LineChart.module.css';

interface LineChartProps {
  data: ChartDataPoint[];
  selectedVariations: string[];
  variations: Variation[];
  rawData?: DayData[];
  lineStyle?: LineStyle;
}

const LineChart = forwardRef<HTMLDivElement, LineChartProps>(({ data, selectedVariations, variations, rawData, lineStyle = 'line' }, ref) => {
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [zoomDomain, setZoomDomain] = useState<[string, string] | null>(null);

  const yAxisDomain = useMemo(() => {
    const range = getVisibleDataRange(data, selectedVariations);
    return [range.min, range.max];
  }, [data, selectedVariations]);

  const xAxisDomain = useMemo(() => {
    return zoomDomain || ['dataMin', 'dataMax'];
  }, [zoomDomain]);

  const handleBrushChange = (domain: { startIndex?: number; endIndex?: number } | null) => {
    if (!domain || domain.startIndex === undefined || domain.endIndex === undefined) {
      setZoomDomain(null);
      return;
    }
    const startDate = data[domain.startIndex]?.date;
    const endDate = data[domain.endIndex]?.date;
    if (startDate && endDate) {
      setZoomDomain([startDate, endDate]);
    }
  };

  const handleResetZoom = () => {
    setZoomDomain(null);
  };

  const resetZoomButton = (
    <div className={styles.bottomSection}>
      {zoomDomain && (
        <button className={styles.resetButton} onClick={handleResetZoom}>
          Reset Zoom
        </button>
      )}
    </div>
  );

  const chartProps = useMemo(() => ({
    data,
    onMouseMove: (state: unknown) => {
      if (state && typeof state === 'object' && 'activeLabel' in state) {
        setActiveDate(state.activeLabel as string);
      }
    },
    onMouseLeave: () => setActiveDate(null),
  }), [data]);

  if (data.length === 0 || selectedVariations.length === 0) {
    return <div ref={ref} className={styles.container}>No data available</div>;
  }

  const brushElement = (
    <Brush
      dataKey="date"
      height={24}
      tickFormatter={(date) => formatDate(date, 'short')}
      onChange={handleBrushChange}
      startIndex={zoomDomain ? data.findIndex((d) => d.date === zoomDomain[0]) : undefined}
      endIndex={zoomDomain ? data.findIndex((d) => d.date === zoomDomain[1]) : undefined}
      stroke="var(--chart-grid)"
      fill="var(--bg-secondary)"
    />
  );

  const commonElements = (
    <>
      <CartesianGrid 
        strokeDasharray="3 3" 
        stroke="var(--chart-grid)"
        strokeOpacity={0.6}
      />
        <XAxis
        dataKey="date"
        tickFormatter={(date) => formatDate(date, 'short')}
        domain={xAxisDomain}
        stroke="var(--chart-axis)"
        fontSize={12}
        tick={{ fill: 'var(--chart-axis)' }}
      />
      <YAxis
        tickFormatter={(value) => `${value}%`}
        domain={yAxisDomain}
        stroke="var(--chart-axis)"
        fontSize={12}
        tick={{ fill: 'var(--chart-axis)' }}
      />
      {activeDate && (
        <ReferenceLine
          x={activeDate}
          stroke="#999"
          strokeDasharray="2 2"
          strokeWidth={1}
          strokeOpacity={0.7}
        />
      )}
      <Tooltip
        content={
          <CustomTooltip
            rawData={rawData}
            variations={variations}
            selectedVariations={selectedVariations}
          />
        }
      />
      <Legend />
      {brushElement}
    </>
  );

  if (lineStyle === 'area') {
    return (
      <div ref={ref} className={styles.container}>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...chartProps}>
              {commonElements}
              {selectedVariations.map((variationId, index) => (
                <Area
                  key={variationId}
                  type="monotone"
                  dataKey={variationId}
                  name={getVariationName(variations, variationId)}
                  stroke={getVariationColor(variationId, index)}
                  fill={getVariationColor(variationId, index)}
                  fillOpacity={0.3}
                  strokeWidth={2}
                  connectNulls={false}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {resetZoomButton}
      </div>
    );
  }

  return (
    <div ref={ref} className={styles.container}>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart {...chartProps}>
            {commonElements}
            {selectedVariations.map((variationId, index) => (
              <Line
                key={variationId}
                type={lineStyle === 'smooth' ? 'monotone' : 'linear'}
                dataKey={variationId}
                name={getVariationName(variations, variationId)}
                stroke={getVariationColor(variationId, index)}
                strokeWidth={2}
                connectNulls={false}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
      {resetZoomButton}
    </div>
  );
});

LineChart.displayName = 'LineChart';

export default LineChart;

