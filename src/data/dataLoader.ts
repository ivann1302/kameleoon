import type { RawData } from '../types/data';
import rawDataJson from '../../data.json';

export function loadData(): RawData {
  return rawDataJson as RawData;
}

