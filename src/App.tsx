import { useState, useMemo, useRef } from 'react';
import { loadData } from './data/dataLoader';
import { processDailyData, groupByWeek, getVariationId } from './utils/dataProcessing';
import { ThemeProvider } from './context/ThemeContext';
import LineChart from './components/LineChart/LineChart/LineChart';
import Controls from './components/Controls/Controls/Controls';
import DayWeekToggle, { type TimeRange } from './components/Controls/DayWeekToggle/DayWeekToggle';
import LineStyleSelector, { type LineStyle } from './components/Controls/LineStyleSelector/LineStyleSelector';
import ThemeToggle from './components/Controls/ThemeToggle/ThemeToggle';
import ExportButton from './components/Controls/ExportButton/ExportButton';
import styles from './App.module.css';

const rawData = loadData();
const allVariationIds = rawData.variations.map((v) => getVariationId(v));

if (rawData.variations.length === 0) {
  throw new Error('No variations found in data');
}

if (rawData.data.length === 0) {
  throw new Error('No data found');
}

export default function App() {
  const [selectedVariations, setSelectedVariations] = useState<string[]>(allVariationIds);
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [lineStyle, setLineStyle] = useState<LineStyle>('line');
  const chartRef = useRef<HTMLDivElement>(null);

  const processedData = useMemo(() => {
    if (selectedVariations.length === 0) {
      return [];
    }
    const dataToProcess = timeRange === 'week' ? groupByWeek(rawData.data) : rawData.data;
    return processDailyData({ ...rawData, data: dataToProcess }, selectedVariations);
  }, [selectedVariations, timeRange]);

  const rawDataForChart = useMemo(() => {
    return timeRange === 'week' ? groupByWeek(rawData.data) : rawData.data;
  }, [timeRange]);

  const handleVariationToggle = (variationId: string) => {
    setSelectedVariations((prev) => {
      if (prev.includes(variationId)) {
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== variationId);
      }
      return [...prev, variationId];
    });
  };

  return (
    <ThemeProvider>
      <div className={styles.app}>
        <div className={styles.controls}>
          <Controls
            variations={rawData.variations}
            selectedVariations={selectedVariations}
            onVariationToggle={handleVariationToggle}
          />
          <div className={styles.rightControls}>
            <LineStyleSelector value={lineStyle} onChange={setLineStyle} />
            <DayWeekToggle value={timeRange} onChange={setTimeRange} />
            <ExportButton chartRef={chartRef} />
            <ThemeToggle />
          </div>
        </div>
        <LineChart
          ref={chartRef}
          data={processedData}
          selectedVariations={selectedVariations}
          variations={rawData.variations}
          rawData={rawDataForChart}
          lineStyle={lineStyle}
        />
      </div>
    </ThemeProvider>
  );
}
