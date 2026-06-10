import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';

export default function StorageBookingModal({ isOpen, onClose, location }: { isOpen: boolean, onClose: () => void, location: string }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80">
      <div className="bg-white max-w-md w-full relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-950">
          <X className="w-5 h-5" />
        </button>
        
        {isSubmitted ? (
          <div className="p-10 text-center">
            <CheckCircle className="w-12 h-12 text-safety-green mx-auto mb-4" />
            <h3 className="text-xl font-black mb-2 text-zinc-950">Booking Requested</h3>
            <p className="text-secondary text-sm mb-6">Your storage unit in {location} has been requested. We will confirm your dates shortly.</p>
            <button onClick={onClose} className="bg-zinc-950 text-white px-6 py-3 font-mono text-[11px] uppercase tracking-widest font-bold w-full">
              Close
            </button>
          </div>
        ) : (
          <div className="p-8">
            <h3 className="text-xl font-black mb-2 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-premium-red" /> Book Storage Unit
            </h3>
            <p className="text-secondary text-sm mb-6">Select your preferred dates for a unit in {location}.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1 tracking-wider">Start Date</label>
                  <input type="date" required className="w-full border border-zinc-200 px-3 py-2 text-sm focus:border-premium-red focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1 tracking-wider">End Date (Optional)</label>
                  <input type="date" className="w-full border border-zinc-200 px-3 py-2 text-sm focus:border-premium-red focus:outline-none" />
                </div>
              </div>
              <div>
                 <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1 tracking-wider">Storage Size</label>
                 <select className="w-full border border-zinc-200 px-3 py-2 text-sm focus:border-premium-red focus:outline-none">
                   <option>Small (Quarter Garage)</option>
                   <option>Medium (Half Garage)</option>
                   <option>Large (Full Garage)</option>
                   <option>Extra Large (Industrial)</option>
                 </select>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-premium-red text-white py-4 font-mono text-[11px] uppercase tracking-widest font-bold hover:bg-zinc-950 transition-colors">
                  Request Booking
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
