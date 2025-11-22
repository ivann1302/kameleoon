import styles from './DayWeekToggle.module.css';

export type TimeRange = 'day' | 'week';

interface DayWeekToggleProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

export default function DayWeekToggle({ value, onChange }: DayWeekToggleProps) {
  return (
    <div className={styles.container}>
      <button
        type="button"
        className={`${styles.button} ${value === 'day' ? styles.active : ''}`}
        onClick={() => onChange('day')}
      >
        Day
      </button>
      <button
        type="button"
        className={`${styles.button} ${value === 'week' ? styles.active : ''}`}
        onClick={() => onChange('week')}
      >
        Week
      </button>
    </div>
  );
}

