/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Minus, Info, Calculator, Sparkles, Check } from 'lucide-react';
import { INVENTORY_PRESETS } from '../data';

interface InventoryCalculatorProps {
  selectedItems: { [itemKey: string]: number };
  setSelectedItems: React.Dispatch<React.SetStateAction<{ [itemKey: string]: number }>>;
  onApprove: (totalCbm: number, count: number) => void;
}

export default function InventoryCalculator({ selectedItems, setSelectedItems, onApprove }: InventoryCalculatorProps) {
  const [activeTab, setActiveTab] = useState<string>('All');

  const categories = ['All', 'Lounge', 'Dining Room', 'Study', 'Kitchen & Appliances', 'Bedrooms', 'Garage & Garden', 'Miscellaneous'] as const;

  const handleIncrement = (id: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleDecrement = (id: string) => {
    setSelectedItems(prev => {
      const updated = { ...prev };
      if (updated[id] && updated[id] > 0) {
        updated[id] -= 1;
        if (updated[id] === 0) {
          delete updated[id];
        }
      }
      return updated;
    });
  };

  const handleReset = () => {
    setSelectedItems({});
  };

  // Calculations
  const totalVolumeCbm = Object.entries(selectedItems).reduce((sum, [id, count]) => {
    const item = INVENTORY_PRESETS.find(p => p.id === id);
    return sum + (item ? item.volumeCbm * count : 0);
  }, 0);

  const totalItemCount = Object.values(selectedItems).reduce((sum, count) => sum + count, 0);

  const baseCostMultiplier = 2500; // ZAR per CBM
  const estimatedCostZar = totalVolumeCbm * baseCostMultiplier;

  const filteredItems = INVENTORY_PRESETS.filter(item => 
    activeTab === 'All' ? true : item.category === activeTab
  );

  return (
    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-md">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-premium-red" />
        <h4 className="font-mono text-[12px] uppercase tracking-widest font-bold text-zinc-950">
          Interactive Cargo Estimator
        </h4>
        <span className="bg-premium-red/10 text-premium-red font-mono text-[9px] px-2 py-0.5 rounded ml-auto">
          ZAR 2,500/CBM BASE
        </span>
      </div>

      <p className="text-[12px] text-zinc-600 mb-4 font-sans leading-relaxed">
        Select actual items to generate standard high-accuracy estimations. Premium red indicates fragile categories requiring shockproof packaging layers.
        <br/><br/>
        Prefer manual entry? <a href="https://www.mastermovers.co.za/wp-content/uploads/2021/12/MASTER-MOVERS-INVENTORY-updated-1.xlsx" target="_blank" rel="noopener noreferrer" className="text-premium-red font-bold hover:underline">Download our Full Inventory Excel Checklist</a>.
      </p>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 scrollbar-none pb-1 border-b border-zinc-200">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveTab(cat)}
            className={`font-mono text-[10px] uppercase px-3 py-1.5 transition-all text-xs border ${
              activeTab === cat
                ? 'bg-zinc-950 text-white border-zinc-950'
                : 'bg-white text-zinc-600 border-zinc-200 hover:text-zinc-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[240px] overflow-y-auto mb-6 pr-1">
        {filteredItems.map((item) => {
          const qty = selectedItems[item.id] || 0;
          const isFragile = item.id.includes('piano') || item.id.includes('delicates') || item.id.includes('tv') || item.id.includes('microwave');
          return (
            <div 
              key={item.id}
              className={`p-3 bg-white border flex items-center justify-between transition-all select-none ${
                qty > 0 
                  ? 'border-premium-red/40 bg-premium-red/[0.01]' 
                  : 'border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-sans font-semibold text-xs text-zinc-950 truncate leading-tight">
                  {item.name}
                </span>
                <span className="font-mono text-[9px] text-zinc-400 mt-1 uppercase tracking-wider flex items-center gap-1">
                  {item.category} • <span className="text-zinc-700 font-bold">{item.volumeCbm.toFixed(2)} m³</span>
                  {isFragile && <span className="w-1.5 h-1.5 bg-premium-red rounded-full"></span>}
                </span>
              </div>

              {/* Quantity Incrementor */}
              <div className="flex items-center gap-2 border border-zinc-200 bg-zinc-50 overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => handleDecrement(item.id)}
                  disabled={qty === 0}
                  className={`w-7 h-7 flex items-center justify-center transition-colors font-bold ${
                    qty === 0 ? 'text-zinc-300 cursor-not-allowed' : 'text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-xs font-bold text-zinc-950 w-5 text-center">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => handleIncrement(item.id)}
                  className="w-7 h-7 flex items-center justify-center text-zinc-700 hover:bg-zinc-200 transition-colors font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estimations Feedback Footer */}
      <div className="bg-zinc-950 text-white p-4 font-mono select-none grid grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest leading-none mb-1">
            Total Cargo Items
          </div>
          <div className="text-xl font-black text-white">{totalItemCount} items</div>
        </div>

        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest leading-none mb-1">
            Total Volume (CBM)
          </div>
          <div className="text-xl font-black text-white">
            {totalVolumeCbm.toFixed(2)} <span className="text-[10px] font-normal font-sans">m³</span>
          </div>
        </div>

        <div className="col-span-full border-t border-white/10 pt-3 flex items-center justify-between">
          <div>
            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">
              Est. Dynamic Cost (ZAR)
            </div>
            <div className="text-lg font-black text-safety-green">
              R {estimatedCostZar.toLocaleString()}
            </div>
          </div>

          <div className="flex gap-2">
            {totalItemCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="px-3 bg-white/10 hover:bg-white/20 text-white text-[10px] uppercase tracking-widest transition-all"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => onApprove(totalVolumeCbm, totalItemCount)}
              className="px-4 py-2 bg-premium-red hover:bg-white hover:text-zinc-950 text-white text-[10px] uppercase tracking-widest transition-all font-bold flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Lock In cargo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
