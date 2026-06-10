/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RelocationBrief {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  origin: string;
  destination: string;
  operationalBrief: string;
  status: 'ANALYSIS_ASSIGNED' | 'DISPATCHED' | 'IN_TRANSIT' | 'ARRIVED' | 'SETTLED';
  createdAt: string;
  inventoryCountEstimate: number;
  estimatedVolumeCbm: number;
  calculatedCostZar: number;
  trackingStep: number;
  selectedItems: { [itemKey: string]: number };
  specialHandlingNeeded: boolean;
}

export interface InventoryPreset {
  id: string;
  name: string;
  category: string;
  volumeCbm: number;
}
