import styles from './LineStyleSelector.module.css';

export type LineStyle = 'line' | 'smooth' | 'area';

interface LineStyleSelectorProps {
  value: LineStyle;
  onChange: (value: LineStyle) => void;
}

export default function LineStyleSelector({ value, onChange }: LineStyleSelectorProps) {
  return (
    <div className={styles.container}>
      <button
        type="button"
        className={`${styles.button} ${value === 'line' ? styles.active : ''}`}
        onClick={() => onChange('line')}
      >
        Line
      </button>
      <button
        type="button"
        className={`${styles.button} ${value === 'smooth' ? styles.active : ''}`}
        onClick={() => onChange('smooth')}
      >
        Smooth
      </button>
      <button
        type="button"
        className={`${styles.button} ${value === 'area' ? styles.active : ''}`}
        onClick={() => onChange('area')}
      >
        Area
      </button>
    </div>
  );
}

