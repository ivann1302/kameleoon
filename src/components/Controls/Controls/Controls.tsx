import type { Variation } from '../../../types/data';
import { getVariationId } from '../../../utils/dataProcessing';
import { getVariationColor } from '../../../utils/colors';
import styles from './Controls.module.css';

interface ControlsProps {
  variations: Variation[];
  selectedVariations: string[];
  onVariationToggle: (variationId: string) => void;
}

export default function Controls({ variations, selectedVariations, onVariationToggle }: ControlsProps) {
  const handleToggle = (variationId: string) => {
    if (selectedVariations.length === 1 && selectedVariations.includes(variationId)) {
      return;
    }
    onVariationToggle(variationId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.variations}>
        {variations.map((variation, index) => {
          const variationId = getVariationId(variation);
          const isSelected = selectedVariations.includes(variationId);
          const color = getVariationColor(variationId, index);

          return (
            <label key={variationId} className={styles.variationLabel}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(variationId)}
                className={styles.checkbox}
              />
              <div
                className={styles.colorIndicator}
                style={{ backgroundColor: color }}
              />
              <span className={styles.variationName}>{variation.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

