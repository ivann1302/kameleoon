import html2canvas from 'html2canvas';
import styles from './ExportButton.module.css';

interface ExportButtonProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
}

export default function ExportButton({ chartRef }: ExportButtonProps) {
  const handleExport = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `chart-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to export chart:', error);
    }
  };

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleExport}
      aria-label="Export chart as PNG"
    >
      Export PNG
    </button>
  );
}

