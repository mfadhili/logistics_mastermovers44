/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, Trophy, Phone, Menu, X, Landmark, Activity, Compass, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { OFFICE_LOCATIONS } from '../data';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onInitiateQuoteClick: () => void;
}

export default function Header({ activeTab, setActiveTab, onInitiateQuoteClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveUtcTime, setLiveUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveUtcTime(now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Africa/Johannesburg' }) + ' SAST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'services', label: 'Services & Expertise' },
    { id: 'locations', label: 'Locations' },
    { id: 'storage', label: 'Storage Units' },
    { id: 'blog', label: 'Blog & Intelligence' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);

    if (id === 'services' || id === 'locations') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Safety Bar / Utility Shell bar */}
      <div className="bg-zinc-950 text-white/80 py-3 px-4 md:px-16 border-b border-white/5 relative z-50">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center text-[11px] md:text-xs font-mono tracking-widest uppercase gap-3 md:gap-0">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-safety-green rounded-full animate-pulse"></span>
              BEE LEVEL ONE PROVIDER
            </span>
            <span className="flex items-center gap-2 text-white/60">
              <Shield className="w-3.5 h-3.5 text-safety-green" />
              PROTOCOL COMPLIANT
            </span>
            <span className="text-white/50 hidden lg:inline">
              SECURE LOGISTICS ACCREDITED
            </span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 font-mono">
            {OFFICE_LOCATIONS.map((loc) => (
              <span key={loc.short} className="text-white/50 hover:text-white transition-colors">
                {loc.short} <strong className="text-white ml-1">{loc.phone}</strong>
              </span>
            ))}
            <span className="bg-white/10 px-2.5 py-1 rounded text-white text-[11px] select-none font-medium tracking-widest">
              {liveUtcTime}
            </span>
          </div>
        </div>
      </div>

      {/* Main Top App Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-surface-container-highest transition-all">
        <nav className="flex justify-between items-center w-full px-6 md:px-16 py-4 max-w-[1400px] mx-auto">
          {/* Brand Logo Identity */}
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <img 
              src="https://www.mastermovers.co.za/wp-content/uploads/2020/03/logo.png" 
              alt="Master Movers Logo" 
              className="h-10 w-auto"
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex gap-10 items-center font-sans text-sm font-medium">
            <button
              onClick={() => handleNavClick('landing')}
              className={`pb-1 transition-all ${
                activeTab === 'landing'
                  ? 'text-premium-red border-b-2 border-premium-red'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Overview
            </button>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`pb-1 transition-all flex items-center gap-1.5 ${
                  activeTab === item.id
                    ? 'text-premium-red border-b-2 border-premium-red'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {item.id === 'tracking' && <span className="w-1.5 h-1.5 bg-safety-green rounded-full animate-ping"></span>}
                {item.label}
              </button>
            ))}
          </div>

          {/* Call To Action Buttons */}
          <div className="flex items-center gap-4">
            <motion.button
              animate={{ boxShadow: ['0 0 0px rgba(220, 38, 38, 0)', '0 0 15px rgba(220, 38, 38, 0.5)', '0 0 0px rgba(220, 38, 38, 0)'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              onClick={onInitiateQuoteClick}
              className="bg-premium-red text-white px-7 py-3 font-sans text-sm font-semibold hover:bg-zinc-900 transition-all button-tactile"
            >
              Get Quote
            </motion.button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-zinc-950 p-2 hover:bg-zinc-100 rounded"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Dropdown Overlay */}
        {mobileMenuOpen && (
          <div className="absolute top-[100%] left-0 w-full bg-white border-b border-surface-container-highest shadow-xl py-6 px-6 md:hidden flex flex-col gap-4 animate-fade-in z-40">
            <button
              onClick={() => handleNavClick('landing')}
              className={`text-left font-sans py-2 text-base ${
                activeTab === 'landing' ? 'text-premium-red font-semibold' : 'text-zinc-600'
              }`}
            >
              Overview
            </button>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left font-sans py-2 text-base flex items-center gap-2 ${
                  activeTab === item.id ? 'text-premium-red font-semibold' : 'text-zinc-600'
                }`}
              >
                {item.id === 'tracking' && <span className="w-2 h-2 bg-safety-green rounded-full"></span>}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
