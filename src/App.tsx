/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, Compass, Key, Plus, Trash2, Globe, Plane, Navigation,
  ExternalLink, Sparkles, MapPin, Truck, Check, HelpCircle, ArrowUpRight,
  ChevronRight, ArrowRight, Instagram, Linkedin, Twitter, AlertCircle,
  Search, Activity, Landmark, Phone, Mail
} from 'lucide-react';
import Header from './components/Header';
import WhatsAppWidget from './components/WhatsAppWidget';
import InventoryCalculator from './components/InventoryCalculator';
import BlogPage from './components/BlogPage';
import StorageBookingModal from './components/StorageBookingModal';
import { RelocationBrief } from './types';
import { OFFICE_LOCATIONS, INITIAL_BRIEFS } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [briefs, setBriefs] = useState<RelocationBrief[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingLocation, setBookingLocation] = useState('Cape Town');
  
  // Interactive Live Tracer local search states
  const [tracerSearchKey, setTracerSearchKey] = useState('');
  const [tracerSearchResult, setTracerSearchResult] = useState<RelocationBrief | null>(null);
  const [tracerSearched, setTracerSearched] = useState(false);

  const handleTracerQuery = (e: React.FormEvent) => {
    e.preventDefault();
    const query = tracerSearchKey.trim().toUpperCase();
    if (!query) return;

    const matched = briefs.find(b => 
      b.id.toUpperCase() === query || 
      b.fullName.toUpperCase().includes(query)
    );

    setTracerSearchResult(matched || null);
    setTracerSearched(true);
  };

  const handleQuickTrace = (id: string) => {
    setTracerSearchKey(id);
    const matched = briefs.find(b => b.id.toUpperCase() === id.toUpperCase());
    setTracerSearchResult(matched || null);
    setTracerSearched(true);
  };

  // Lead Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [origin, setOrigin] = useState('Johannesburg');
  const [destination, setDestination] = useState('Cape Town');
  const [operationalBrief, setOperationalBrief] = useState('');
  const [cargoVolumeCbm, setCargoVolumeCbm] = useState<number>(0);
  const [cargoItemCount, setCargoItemCount] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<{ [itemKey: string]: number }>({});
  const [specialHandling, setSpecialHandling] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('master_movers_briefs');
      if (stored) {
        setBriefs(JSON.parse(stored));
      } else {
        // Hydrate with Initial Brief data
        setBriefs(INITIAL_BRIEFS);
        localStorage.setItem('master_movers_briefs', JSON.stringify(INITIAL_BRIEFS));
      }
    } catch (e) {
      console.error('Failed to parse briefs from local storage: ', e);
      setBriefs(INITIAL_BRIEFS);
    }
  }, []);

  // Update localStorage helper
  const syncBriefs = (updated: RelocationBrief[]) => {
    setBriefs(updated);
    try {
      localStorage.setItem('master_movers_briefs', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to write local storage: ', e);
    }
  };

  // Process item calculations
  const calculateCost = (volumeCbm: number, isSpecial: boolean) => {
    const baseRate = 2500; // ZAR per cbm
    const multiplier = isSpecial ? 1.15 : 1.0;
    const finalVolume = volumeCbm > 0 ? volumeCbm : 5; // default minimal fallback volume of 5 cbm
    return Math.round(finalVolume * baseRate * multiplier);
  };

  // Form submit handler
  const handleDispatchBriefSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      alert('Please populate Identification parameters (Full Name, Email, Phone) to submit.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Simulate ID Generation
      const briefId = `BRIEF-${1998 + briefs.length}${String.fromCharCode(65 + (briefs.length % 26))}`;
      const finalVolume = cargoVolumeCbm > 0 ? cargoVolumeCbm : 6.5; // fallback CBM
      const calculatedCostZar = calculateCost(finalVolume, specialHandling);

      const newBrief: RelocationBrief = {
        id: briefId,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        origin,
        destination,
        operationalBrief: operationalBrief.trim() || 'Standard domestic cargo container shipment request.',
        status: 'ANALYSIS_ASSIGNED',
        createdAt: new Date().toISOString(),
        inventoryCountEstimate: cargoItemCount > 0 ? cargoItemCount : 12,
        estimatedVolumeCbm: finalVolume,
        calculatedCostZar,
        trackingStep: 1,
        selectedItems,
        specialHandlingNeeded: specialHandling
      };

      const updatedList = [newBrief, ...briefs];
      syncBriefs(updatedList);

      // Clean states
      setFullName('');
      setEmail('');
      setPhone('');
      setOperationalBrief('');
      setCargoVolumeCbm(0);
      setCargoItemCount(0);
      setSelectedItems({});
      setSpecialHandling(false);
      setShowCalculator(false);
      setIsSubmitting(false);

      // Highlight success and switch view
      setSubmitSuccess(briefId);
      setTimeout(() => {
        setSubmitSuccess(null);
        // User stays on same page. We just clear the form.
      }, 3000);

    }, 1500);
  };

  // Admin status update handler
  const handleUpdateStatus = (id: string, newStatus: RelocationBrief['status']) => {
    let step = 1;
    if (newStatus === 'DISPATCHED') step = 2;
    if (newStatus === 'IN_TRANSIT') step = 3;
    if (newStatus === 'ARRIVED') step = 4;
    if (newStatus === 'SETTLED') step = 5;

    const updated = briefs.map(b => b.id === id ? { ...b, status: newStatus, trackingStep: step } : b);
    syncBriefs(updated);
  };

  // Delete brief record
  const handleDeleteBrief = (id: string) => {
    const updated = briefs.filter(b => b.id !== id);
    syncBriefs(updated);
  };

  // Handle calculator callback locking in items
  const handleLockInCargo = (volume: number, count: number) => {
    setCargoVolumeCbm(volume);
    setCargoItemCount(count);
    setShowCalculator(false);
    // Auto-tick special handling flag if grand piano or delicates box exists
    const hasPiano = selectedItems['lounge_piano_baby_grand'] && selectedItems['lounge_piano_baby_grand'] > 0;
    const hasDelicates = selectedItems['box_delicates'] && selectedItems['box_delicates'] > 0;
    if (hasPiano || hasDelicates) {
      setSpecialHandling(true);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen selection:bg-premium-red selection:text-white">
      
      {/* Premium Header Layout */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onInitiateQuoteClick={() => {
          setActiveTab('landing');
          setTimeout(() => {
            const el = document.getElementById('quote');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* Main Sections Body Frame */}
      <main>
        
        {/* Dynamic State Overlay banner for successful brief submittal */}
        {submitSuccess && (
          <div className="bg-zinc-950 text-white py-4 px-6 fixed bottom-6 left-6 z-[120] max-w-sm rounded border border-premium-red/50 shadow-2xl animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 bg-safety-green rounded-full animate-ping"></span>
              <span className="font-mono text-xs uppercase tracking-wider text-safety-green font-bold">Dispatch Clearance Issued</span>
            </div>
            <p className="text-xs text-secondary mb-1">
              Brief record <strong className="text-white font-mono">{submitSuccess}</strong> was published to the active registry.
            </p>
            <p className="text-[10px] text-zinc-400">Opening live telemetry monitoring panel...</p>
          </div>
        )}

        {/* 1. VIEW PORTAL: LANDING HOMEPAGE CHANNELS */}
        {activeTab === 'landing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {/* HERO SECTION: INDUSTRIAL AUTHORITY */}
            <section className="relative min-h-[92dvh] flex items-center overflow-hidden bg-zinc-950 select-text">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/75 to-transparent z-10"></div>
                <img 
                  alt="High-volume containers and structural cranes in a container terminal" 
                  className="w-full h-full object-cover opacity-50 grayscale transition-all duration-1000 group-hover:scale-105" 
                  src="https://www.mastermovers.co.za/wp-content/uploads/2021/02/16-long-distance-movers-.jpg"
                />
              </div>

              <div className="relative z-20 px-6 md:px-16 max-w-[1400px] mx-auto w-full">
                <div className="max-w-[850px]">
                  <div className="inline-flex items-center gap-2 border border-premium-red/30 text-premium-red px-3.5 py-1 mb-8 bg-premium-red/5">
                    <span className="w-1.5 h-1.5 bg-premium-red rounded-full animate-ping"></span>
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-black">
                      THE GOLD STANDARD OF SOUTH AFRICAN SHIFTING
                    </span>
                  </div>
                  
                  <h1 className="heading-premium text-[56px] sm:text-[80px] md:text-[100px] text-white leading-[1.0] mb-8 tracking-tighter font-black lowercase italic">
                    be <span className="text-premium-red">moved.</span>
                  </h1>
                  
                  <p className="font-sans text-[16px] md:text-[19px] text-white/70 mb-10 max-w-[720px] leading-relaxed">
                    Moving shouldn&apos;t be stressful. Master Movers modernizes residential relocations, office shifts, and secure warehousing across South Africa with military-grade precision, highly trained loading masters, and advanced GIS-equipped fleet scheduling.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button 
                      animate={{ boxShadow: ['0 0 0px rgba(220, 38, 38, 0)', '0 0 20px rgba(220, 38, 38, 0.4)', '0 0 0px rgba(220, 38, 38, 0)'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      onClick={() => {
                        const el = document.getElementById('quote');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                          setShowCalculator(true);
                        }
                      }}
                      className="bg-premium-red text-white hover:bg-white hover:text-zinc-950 px-8 py-4.5 font-mono text-[11px] uppercase tracking-widest transition-all button-tactile font-black flex items-center justify-center gap-2.5"
                    >
                      <Plus className="w-4 h-4" />
                      ESTIMATE MOVING VOLUME
                    </motion.button>
                    <button 
                      onClick={() => {
                        setActiveTab('blog');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="border border-white/20 text-white hover:bg-white/10 px-8 py-4.5 font-mono text-[11px] uppercase tracking-widest transition-all button-tactile flex items-center justify-center gap-2.5 font-bold"
                    >
                      <Compass className="w-4 h-4 text-premium-red animate-spin" style={{ animationDuration: '6s' }} />
                      READ OUR BLOG
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* BRAND VALUE METRICS BORDER ROW (FROM DESIGN VARIANTS) */}
            <section className="bg-white border-b border-zinc-100 py-12 px-6 md:px-16 select-text">
              <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-stretch">
                <div className="border-l-2 border-zinc-200 pl-6">
                  <span className="block text-4xl md:text-5xl font-black text-zinc-950 font-sans tracking-tight mb-2">25+ Years</span>
                  <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-zinc-400 font-extrabold">INDUSTRY MASTERY</span>
                </div>
                <div className="border-l-2 border-zinc-200 pl-6">
                  <span className="block text-4xl md:text-5xl font-black text-zinc-950 font-sans tracking-tight mb-2">150k+</span>
                  <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-zinc-400 font-extrabold">MOVES DELIVERED</span>
                </div>
                <div className="border-l-2 border-premium-red pl-6">
                  <span className="block text-4xl md:text-5xl font-black text-premium-red font-sans tracking-tight mb-2">99.2%</span>
                  <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-zinc-400 font-extrabold">FIVE-STAR REVIEWS</span>
                </div>
              </div>
            </section>

            {/* WHY CORPORATE & HOMEOWNERS CHOOSE US SECTION */}
            <section className="bg-zinc-50 border-b border-zinc-100 py-20 px-6 md:px-16 select-text">
              <div className="max-w-[1400px] mx-auto space-y-12">
                <div className="max-w-3xl space-y-4">
                  <span className="font-mono text-premium-red text-[11px] font-bold tracking-[0.25em] uppercase block">
                    ELITE SHIPPING COMPLIANCE
                  </span>
                  <h2 className="heading-premium text-[36px] md:text-[50px] text-zinc-950 tracking-tight leading-none font-black">
                    Why Corporate & Homeowners Choose Us
                  </h2>
                  <p className="text-secondary text-sm md:text-base leading-relaxed">
                    For more than two decades, we have continuously refined our shipping protocols, security measures, and tracking telemetry to establish a high-security moving catalog throughout S.A.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                  {/* Card 1 */}
                  <div className="p-8 bg-white border border-zinc-200 hover:border-premium-red/30 transition-all duration-300 flex flex-col justify-between min-h-[250px] shadow-sm">
                    <div>
                      <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center text-premium-red mb-6 border border-premium-red/10">
                        <Shield className="w-5 h-5" />
                      </div>
                      <h3 className="font-sans font-black text-xl text-zinc-950 mb-3">
                        All-Inclusive Moving Protection
                      </h3>
                      <p className="text-secondary text-xs leading-relaxed">
                        Full comprehensive Goods-in-Transit insurance covering all household goods, antiques, and fine art from load to layout.
                      </p>
                    </div>
                    <span className="block font-mono text-[9px] text-zinc-400 mt-6 tracking-widest uppercase">INSURED PROTOCOL // 01</span>
                  </div>

                  {/* Card 2 */}
                  <div className="p-8 bg-white border border-zinc-200 hover:border-premium-red/30 transition-all duration-300 flex flex-col justify-between min-h-[250px] shadow-sm">
                    <div>
                      <div className="w-10 h-10 rounded bg-zinc-100 flex items-center justify-center text-zinc-900 mb-6 border border-zinc-200">
                        <Truck className="w-5 h-5" />
                      </div>
                      <h3 className="font-sans font-black text-xl text-zinc-950 mb-3">
                        AMOSA Gold-Grade Accreditations
                      </h3>
                      <p className="text-secondary text-xs leading-relaxed">
                        Vetted members of major South African transport and safety authorities, keeping moving standards flawless.
                      </p>
                    </div>
                    <span className="block font-mono text-[9px] text-zinc-400 mt-6 tracking-widest uppercase">REGULATORY DEPT // 02</span>
                  </div>

                  {/* Card 3 */}
                  <div className="p-8 bg-white border border-zinc-200 hover:border-premium-red/30 transition-all duration-300 flex flex-col justify-between min-h-[250px] shadow-sm">
                    <div>
                      <div className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-white mb-6">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h3 className="font-sans font-black text-xl text-zinc-950 mb-3">
                        White-Glove Packing Protocol
                      </h3>
                      <p className="text-secondary text-xs leading-relaxed">
                        Dual-wall customized cartons, dense shock-absorbent wraps, and anti-scuff covers for fragile electronics.
                      </p>
                    </div>
                    <span className="block font-mono text-[9px] text-zinc-400 mt-6 tracking-widest uppercase">STANDARDS PROTOCOL // 03</span>
                  </div>
                </div>
              </div>
            </section>

            {/* TACTICAL ADVANTAGES ASYMMETRIC SECTION */}
            <section className="py-20 px-6 md:px-16 max-w-[1400px] mx-auto select-text">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                
                <div className="md:col-span-4 border-l-2 border-premium-red pl-8 py-2">
                  <h2 className="heading-premium text-[32px] md:text-[40px] text-zinc-950 mb-4 tracking-tight font-black">
                    Tactical Advantages
                  </h2>
                  <p className="text-secondary text-sm md:text-base leading-relaxed">
                    Logistics is more than cardboard boxes; it is the precision planning, symmetric structures, and intelligence behind every cargo movement.
                  </p>
                </div>

                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Card 1 */}
                  <div className="p-10 bg-white border border-zinc-200 hover:border-premium-red/40 transition-colors duration-500 group">
                    <span className="font-mono text-premium-red text-[11px] block mb-6 font-bold tracking-widest">
                      01 — CHARITY BOX
                    </span>
                    <h3 className="heading-premium text-[24px] md:text-[28px] text-zinc-950 mb-4 font-black">
                      Circular Impact
                    </h3>
                    <p className="text-secondary text-sm leading-relaxed">
                      We provide custom, designated charity containers during packing operations. Our teams facilitate frictionless delivery and symmetric donations directly to verified local community partners post-move.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="p-10 bg-zinc-950 text-white hover:bg-premium-red transition-all duration-500 group">
                    <span className="font-mono text-premium-red group-hover:text-white text-[11px] block mb-6 font-bold tracking-widest">
                      02 — PRIORITY BOX
                    </span>
                    <h3 className="heading-premium text-[24px] md:text-[28px] mb-4 font-black">
                      Instant Residency
                    </h3>
                    <p className="text-white/70 group-hover:text-white/90 text-sm leading-relaxed">
                      Crucial home infrastructure and systems are unloaded and operationalized first. We settle your Wi-Fi, desk, and kitchen systems before the heavier items, ensuring absolute zero downtime for your active lifestyle.
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* DOMAIN EXPERTISE BENTO BOX GRID */}
            <section className="bg-zinc-100 py-20" id="services">
              <div className="px-6 md:px-16 max-w-[1400px] mx-auto select-text">
                
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-16">
                  <h2 className="heading-premium text-[40px] md:text-[56px] text-zinc-950 tracking-tight">
                    Domain Expertise
                  </h2>
                  <span className="font-mono text-[11px] text-secondary font-bold tracking-widest uppercase">
                    SECTION // 04
                  </span>
                </div>

                {/* Bento Layout Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[340px]">
                  
                  {/* Bento block 1: Residential */}
                  <div className="md:col-span-8 md:row-span-2 relative group overflow-hidden bg-white border border-zinc-200">
                    <img 
                      alt="Arrangement of neatly packed moving crates, packing papers, and household items" 
                      className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 opacity-60" 
                      src="https://www.mastermovers.co.za/wp-content/uploads/2021/02/householdmovers-1.png"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-10 w-full text-white z-20">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] bg-premium-red text-white px-2.5 py-1 mb-4 inline-block font-bold">
                        Private Sector
                      </span>
                      <h3 className="heading-premium text-[36px] md:text-[48px] text-white mb-2 tracking-tight">
                        Residential
                      </h3>
                      <p className="text-white/80 max-w-lg text-sm md:text-base mb-6 font-sans">
                        White-glove handling for high-value personal assets, corporate villas, and premium domestic relocations across South African provinces.
                      </p>
                      <button 
                        onClick={() => {
                          const el = document.getElementById('quote');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest border-b border-white/40 pb-1.5 hover:border-premium-red hover:text-premium-red transition-all font-bold cursor-pointer"
                      >
                        Initiate Residential Protocol <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Bento block 2: Commercial */}
                  <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden bg-zinc-950">
                    <img 
                      alt="Office workspace files and desks needing organized structural logistics coordination" 
                      className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-1000" 
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                    />
                    <div className="absolute inset-0 bg-zinc-950/40"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white z-20">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-premium-red mb-1 font-bold">
                        Corporate Solutions
                      </span>
                      <h3 className="heading-premium text-[28px] mb-2 tracking-tight">
                        Enterprise
                      </h3>
                      <p className="text-white/60 text-[12.5px] leading-relaxed">
                        Systemized office migrations, secure asset inventory pipelines, and specialized equipment transport with zero redundant workflow down-time.
                      </p>
                    </div>
                  </div>

                  {/* Bento block 3: Secure Storage */}
                  <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden bg-white border border-zinc-200">
                    <div className="p-8 h-full flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 bg-premium-red/5 flex items-center justify-center text-premium-red border border-premium-red/10 mb-6">
                          <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="heading-premium text-[28px] text-zinc-950 mb-2">
                          Secure Storage
                        </h3>
                        <p className="text-secondary text-xs leading-relaxed">
                          Climate-controlled, dust-sealed, and symmetric containerized vaults in CPT and JHB hubs under 24/7 dual CCTV patrols.
                        </p>
                      </div>
                      
                      <div className="flex gap-4 font-mono text-[10px] text-zinc-500">
                        <span>● Fire Suppression Active</span>
                        <span>● Insured ZAR 10M</span>
                      </div>
                    </div>
                  </div>

                  {/* Bento block 4: Inter-Continental Cargo Routing */}
                  <div className="md:col-span-12 md:row-span-1 bg-zinc-950 flex flex-col md:flex-row overflow-hidden group border border-white/5">
                    <div className="md:w-1/2 p-10 md:p-12 text-white flex flex-col justify-center">
                      <span className="font-mono text-premium-red text-[11px] mb-3 font-bold tracking-widest">
                        GLOBAL FREIGHT NETWORK
                      </span>
                      <h3 className="heading-premium text-[32px] md:text-[40px] text-white mb-4 tracking-tight">
                        Inter-Continental
                      </h3>
                      <p className="text-white/60 text-sm mb-6 leading-relaxed">
                        Multimodal customs clearance and air/sea freight alignments in compliance with international freight forwarding covenants.
                      </p>
                      <div className="flex gap-3">
                        <div className="h-10 w-10 border border-white/10 flex items-center justify-center hover:border-premium-red hover:bg-white/5 transition-all text-white/70 hover:text-white cursor-pointer" title="Ocean Freight Protocols">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div className="h-10 w-10 border border-white/10 flex items-center justify-center hover:border-premium-red hover:bg-white/5 transition-all text-white/70 hover:text-white cursor-pointer" title="Air Freight Logistics">
                          <Plane className="w-5 h-5" />
                        </div>
                        <div className="h-10 w-10 border border-white/10 flex items-center justify-center hover:border-premium-red hover:bg-white/5 transition-all text-white/70 hover:text-white cursor-pointer" title="Direct Fleet Inbound">
                          <Navigation className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/2 relative min-h-[220px]">
                      <img 
                        alt="High speed relocation delivery vehicles on South African road transport routes" 
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 transition-all duration-700" 
                        src="https://www.mastermovers.co.za/wp-content/uploads/2021/02/CPT-Shuttle-Vehicle-1.jpg"
                      />
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* CERTIFIED TRACK RECORD AND INSTANT OPERATION TRACER SECTION */}
            <section className="bg-zinc-950 text-white py-20 px-6 md:px-16 border-t border-b border-white/5 select-text" id="track-record">
              <div className="max-w-[1400px] mx-auto space-y-12">
                
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-baseline border-b border-white/10 pb-6">
                  <div>
                    <span className="font-mono text-red-400 text-[11px] font-bold tracking-[0.25em] uppercase block mb-2">
                      Live Operational Registry
                    </span>
                    <h2 className="heading-premium text-[40px] md:text-[56px] text-white tracking-tight font-black">
                      Track Record & Tracer
                    </h2>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-300 font-bold tracking-widest uppercase mt-2 md:mt-0">
                    SECTION // 05
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  
                  {/* Left Column: Historical Corporate Track Record Metrics */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="border-l-2 border-red-500 pl-6 py-1">
                      <h3 className="font-mono text-[12px] uppercase text-red-400 font-black tracking-widest mb-2">
                        Certified Achievements
                      </h3>
                      <p className="text-zinc-200 text-xs md:text-sm leading-relaxed">
                        Precision logistics metrics validated over more than two decades of elite residential and industrial asset delivery across Southern Africa.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Metric Card 1 */}
                      <div className="p-5 bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        <span className="block font-mono text-[10px] text-zinc-300 uppercase tracking-wider mb-2 font-bold">
                          VOLUMETRIC TRANSITS
                        </span>
                        <div className="text-3xl font-black text-white font-sans leading-none mb-1">
                          28,495+
                        </div>
                        <p className="text-zinc-200 text-[11px] leading-snug">
                          Successful domestic and inter-provincial relocations completed.
                        </p>
                      </div>

                      {/* Metric Card 2 */}
                      <div className="p-5 bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        <span className="block font-mono text-[10px] text-zinc-300 uppercase tracking-wider mb-2 font-bold">
                          INTEGRITY QUOTIENT
                        </span>
                        <div className="text-3xl font-black text-safety-green font-sans leading-none mb-1">
                          99.98%
                        </div>
                        <p className="text-zinc-200 text-[11px] leading-snug">
                          Record of zero-claim transit delivery across JHB & CPT warehouses.
                        </p>
                      </div>

                      {/* Metric Card 3 */}
                      <div className="p-5 bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        <span className="block font-mono text-[10px] text-zinc-300 uppercase tracking-wider mb-2 font-bold">
                          TRANSFORMATION multiplier
                        </span>
                        <div className="text-3xl font-black text-white font-sans leading-none mb-1">
                          Level 1
                        </div>
                        <p className="text-zinc-200 text-[11px] leading-snug">
                          Broad-Based Black Economic Empowerment (B-BBEE) Contributor.
                        </p>
                      </div>

                      {/* Metric Card 4 */}
                      <div className="p-5 bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                        <span className="block font-mono text-[10px] text-zinc-300 uppercase tracking-wider mb-2 font-bold">
                          INSURED CAPITAL ROUTED
                        </span>
                        <div className="text-3xl font-black text-red-400 font-sans leading-none mb-1">
                          R 420M+
                        </div>
                        <p className="text-zinc-200 text-[11px] leading-snug">
                          In secure private art and heavy industrial assets guided safely.
                        </p>
                      </div>

                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded text-[10.5px] font-mono text-zinc-300 leading-relaxed uppercase">
                      ● ALL LOGISTICAL TELEMETRY IS AUDITED BY SABS STANDARDS FOR ISO-9001 FRAMEWORK INTEGRITY compliance.
                    </div>
                  </div>

                  {/* Right Column: Live Interactive Brief Tracer Terminal */}
                  <div className="lg:col-span-7 bg-zinc-900 border border-white/10 p-6 shadow-2xl relative overflow-hidden">
                    
                    {/* Graticule Background Effect */}
                    <div className="absolute inset-0 bg-transparent opacity-5 pointer-events-none select-none" style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '14px 14px'
                    }}></div>

                    <div className="relative z-10 space-y-6">
                      
                      {/* Terminal Label */}
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-300">
                        <span className="flex items-center gap-1.5 uppercase font-black tracking-widest text-red-400">
                          <Activity className="w-3.5 h-3.5 animate-pulse" />
                          Master Tracer Terminal
                        </span>
                        <span className="bg-white/10 px-2 py-0.5 rounded text-white text-[9px]">
                          SECURE SEC_P-4
                        </span>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-sans font-black text-xl text-white">
                          Search Active Road Cargo
                        </h3>
                        <p className="text-zinc-300 text-xs md:text-sm leading-relaxed">
                          Enter your assigned Brief ID key or complete full legal name to verify telemetry routing coordinates, dispatch status, and cargo volume parameters immediately.
                        </p>
                      </div>

                      {/* Tracer Form Input */}
                      <form onSubmit={handleTracerQuery} className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input 
                            type="text"
                            value={tracerSearchKey}
                            onChange={(e) => setTracerSearchKey(e.target.value)}
                            placeholder="e.g. BRIEF-1998A, Rene Dreyer..."
                            className="w-full bg-white/5 border border-white/20 focus:border-premium-red focus:ring-0 p-3 pl-10 text-xs text-white font-mono placeholder:text-white/40"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-premium-red text-white hover:bg-white hover:text-zinc-950 px-6 font-mono text-[11px] uppercase tracking-widest transition-all font-bold cursor-pointer"
                        >
                          Query Index
                        </button>
                      </form>

                      {/* Quick Lookup Shortcuts */}
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-zinc-300">
                        <span className="font-bold text-zinc-400">Suggested Traces:</span>
                        {briefs.slice(0, 3).map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => handleQuickTrace(b.id)}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-white rounded transition-colors cursor-pointer"
                          >
                            {b.id}
                          </button>
                        ))}
                      </div>

                      {/* Segment Display screen of results */}
                      <div className="bg-black/50 border border-white/10 p-5 rounded font-mono text-xs text-zinc-300 min-h-[160px] flex flex-col justify-between">
                        
                        {tracerSearched ? (
                          tracerSearchResult ? (
                            <div className="space-y-4 animate-fade-in text-left">
                              
                              <div className="flex justify-between items-start border-b border-white/10 pb-2">
                                <div>
                                  <span className="block text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Assigned Transit brief</span>
                                  <span className="font-sans font-bold text-sm text-white">{tracerSearchResult.fullName}</span>
                                </div>
                                <div className="text-right">
                                  <span className="block text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Dispatch code</span>
                                  <span className="text-red-400 font-bold text-xs">{tracerSearchResult.id}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-[11px]">
                                <div>
                                  <span className="block text-[10px] text-zinc-400 uppercase tracking-wide">Origin Terminal</span>
                                  <span className="text-white font-bold">{tracerSearchResult.origin}</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-zinc-400 uppercase tracking-wide">Destination Terminus</span>
                                  <span className="text-white font-bold">{tracerSearchResult.destination}</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-zinc-400 uppercase tracking-wide">Operational Status</span>
                                  <span className="text-safety-green font-bold uppercase">{tracerSearchResult.status.replace('_', ' ')}</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-zinc-400 uppercase tracking-wide">Volumetric Estimate</span>
                                  <span className="text-white font-bold">{tracerSearchResult.estimatedVolumeCbm.toFixed(2)} CBM</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-zinc-400 uppercase tracking-wide">Calculated Standard Cost</span>
                                  <span className="text-safety-green font-bold font-sans">R {tracerSearchResult.calculatedCostZar.toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-zinc-400 uppercase tracking-wide">Special Handling Rider</span>
                                  <span className="text-white font-bold">{tracerSearchResult.specialHandlingNeeded ? 'Yes (+15% Active)' : 'None'}</span>
                                </div>
                              </div>

                              <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                                <span className="text-[11px] text-zinc-300 flex items-center gap-2 font-medium tracking-wide">
                                  <span className="w-1.5 h-1.5 bg-safety-green rounded-full animate-ping inline-block"></span>
                                  LIVE GPS TRACE IN PROGRESS
                                </span>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab('blog');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="text-red-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                                >
                                  Read Operations Blog <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>

                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center py-6 text-zinc-400 space-y-2">
                              <AlertCircle className="w-8 h-8 text-red-400 animate-bounce" />
                              <span className="font-bold uppercase tracking-wider text-xs text-white">NO MOVEMENT MATCHED</span>
                              <p className="text-[11px] text-zinc-300 max-w-xs leading-normal">
                                The code entered was not located in our master database array. Verify uppercase key strings or create a record using the Dispatch Briefing system below.
                              </p>
                            </div>
                          )
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center py-6 text-zinc-300 space-y-3">
                            <Compass className="w-10 h-10 text-zinc-400 animate-spin" style={{ animationDuration: '10s' }} />
                            <div>
                              <span className="block font-bold uppercase tracking-widest text-xs text-zinc-300">Tracer Screen Standby</span>
                              <p className="text-[11px] text-zinc-400 max-w-sm mt-1 leading-normal">
                                Input query parameters or click on suggesting indicators path parameters to instantly map physical logistics routes.
                              </p>
                            </div>
                          </div>
                        )}

                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* SUBMIT BRIEF LEAD FORM MODULE Section */}
            <section className="py-20 px-6 md:px-16 bg-white" id="quote">
              <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                
                {/* Left Side Info Panel */}
                <div className="pr-0 lg:pr-12 select-text">
                  <h2 className="heading-premium text-[48px] sm:text-[64px] text-zinc-950 mb-6 tracking-tight">
                    Initiate Request.
                  </h2>
                  <p className="text-secondary text-sm md:text-base leading-relaxed mb-10">
                    Provide your operational parameters below. Our pricing analysts will deliver a comprehensive, symmetric cargo logistics flight brief within 180 minutes.
                  </p>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex gap-4 items-start pb-4 border-b border-zinc-100">
                        <span className="font-mono text-premium-red font-bold text-xs pt-1">01</span>
                        <div>
                          <h4 className="font-mono text-[12px] uppercase font-bold text-zinc-950 mb-1">
                            JHB Operations
                          </h4>
                          <p className="text-secondary text-[12px] leading-normal">
                            17 Indianapolis Blvd, Germiston
                          </p>
                          <p className="font-mono text-zinc-950 text-xs font-bold mt-1">
                            +27 11 493 7569
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start pb-4 border-b border-zinc-100">
                        <span className="font-mono text-premium-red font-bold text-xs pt-1">02</span>
                        <div>
                          <h4 className="font-mono text-[12px] uppercase font-bold text-zinc-950 mb-1">
                            CPT Operations
                          </h4>
                          <p className="text-secondary text-[12px] leading-normal">
                            Unit 1 Bosal Park, Epping Industria
                          </p>
                          <p className="font-mono text-zinc-950 text-xs font-bold mt-1">
                            +27 21 534 1582
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-100 p-5 font-mono text-[11px] text-zinc-500 uppercase tracking-wider space-y-2">
                      <div className="flex justify-between">
                        <span>● BBBEE Certified Level 1</span>
                        <span>● SARF Approved</span>
                      </div>
                      <div className="flex justify-between">
                        <span>● Customs Bonded Storage</span>
                        <span>● 100% Asset Insured</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side Form Shell */}
                <div className="double-bezel">
                  <div className="double-bezel-inner p-6 md:p-10">
                    <form onSubmit={handleDispatchBriefSubmit} className="space-y-6">
                      
                      {/* Subtitles */}
                      <div>
                        <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold text-premium-red">
                          LEGAL REQUEST PARAMETERS
                        </h3>
                        <p className="text-zinc-400 text-xs mt-1">Fields are symmetrically monitored under standard POPI protocols.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-full">
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-secondary mb-1 font-bold">
                            Identification / Full Legal Name
                          </label>
                          <input 
                            required
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Full name or corporate entity"
                            className="w-full bg-zinc-50 border-x-0 border-t-0 border-b-2 border-zinc-200 focus:border-zinc-950 focus:ring-0 p-3 text-sm transition-all focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-secondary mb-1 font-bold">
                            Corporate Email Vector
                          </label>
                          <input 
                            required
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@entity.co.za"
                            className="w-full bg-zinc-50 border-x-0 border-t-0 border-b-2 border-zinc-200 focus:border-zinc-950 focus:ring-0 p-3 text-sm transition-all focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-secondary mb-1 font-bold">
                            Secure Contact Number
                          </label>
                          <input 
                            required
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+27 82 000 0000"
                            className="w-full bg-zinc-50 border-x-0 border-t-0 border-b-2 border-zinc-200 focus:border-zinc-950 focus:ring-0 p-3 text-sm transition-all focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-secondary mb-1 font-bold">
                            Origin Terminal
                          </label>
                          <select 
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="w-full bg-zinc-50 border-x-0 border-t-0 border-b-2 border-zinc-200 focus:border-zinc-950 focus:ring-0 p-3 text-sans text-xs font-bold transition-all"
                          >
                            <option>Johannesburg</option>
                            <option>Cape Town</option>
                            <option>Durban</option>
                            <option>International Inbound</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-secondary mb-1 font-bold">
                            Destination Slip
                          </label>
                          <select 
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full bg-zinc-50 border-x-0 border-t-0 border-b-2 border-zinc-200 focus:border-zinc-950 focus:ring-0 p-3 text-sans text-xs font-bold transition-all"
                          >
                            <option>Cape Town</option>
                            <option>Johannesburg</option>
                            <option>Durban</option>
                            <option>International Outbound</option>
                          </select>
                        </div>
                      </div>

                      {/* Cargo estimator toggle bar */}
                      <div className="border border-zinc-200 p-4 bg-zinc-50 select-none">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="block font-mono text-[9px] uppercase tracking-wider text-zinc-400 font-bold leading-none mb-1">Volumetric Allocation</span>
                            <span className="font-mono text-xs font-bold text-zinc-800">
                              {cargoItemCount > 0 
                                ? `${cargoItemCount} items locked in • ${cargoVolumeCbm.toFixed(2)} CBM` 
                                : 'Using default container estimates (8.00 CBM)'
                              }
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowCalculator(!showCalculator)}
                            className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest font-black transition-all cursor-pointer ${
                              showCalculator 
                                ? 'bg-zinc-950 text-white' 
                                : 'bg-premium-red text-white hover:bg-zinc-950'
                            }`}
                          >
                            {showCalculator ? 'Hide Cargo List' : 'Itemize Cargo'}
                          </button>
                        </div>

                        {/* Interactive Cargo calculation display */}
                        {showCalculator && (
                          <div className="mt-4">
                            <InventoryCalculator 
                              selectedItems={selectedItems}
                              setSelectedItems={setSelectedItems}
                              onApprove={handleLockInCargo}
                            />
                          </div>
                        )}
                      </div>

                      {/* High-value checkbox */}
                      <div className="flex items-center gap-2 select-none">
                        <input 
                          type="checkbox" 
                          id="specialHandling" 
                          checked={specialHandling}
                          onChange={(e) => setSpecialHandling(e.target.checked)}
                          className="text-premium-red focus:ring-premium-red border-zinc-300 w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="specialHandling" className="font-mono text-[10px] uppercase font-bold text-secondary cursor-pointer">
                          Fine Arts / Piano Custom Pack protocol (+15% security rider)
                        </label>
                      </div>

                      <div className="col-span-full">
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-secondary mb-1 font-bold">
                          Operational Cargo Instructions
                        </label>
                        <textarea 
                          value={operationalBrief}
                          onChange={(e) => setOperationalBrief(e.target.value)}
                          placeholder="List delicate components, precious artworks, stairs constraints, access time brackets or storage needs..."
                          className="w-full bg-zinc-50 border-x-0 border-t-0 border-b-2 border-zinc-200 focus:border-zinc-950 focus:ring-0 p-3 text-sm h-24 transition-all focus:bg-white"
                        ></textarea>
                      </div>

                      {/* Display calculations live on form */}
                      <div className="bg-zinc-100 p-4 font-mono text-xs flex justify-between items-center">
                        <span className="text-zinc-500 font-bold uppercase tracking-wider">Estimated Outbound Charge:</span>
                        <strong className="text-lg text-premium-red font-black">
                          R {calculateCost(cargoVolumeCbm > 0 ? cargoVolumeCbm : 8, specialHandling).toLocaleString()}
                        </strong>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-zinc-950 hover:bg-premium-red text-white py-4.5 font-mono text-[12px] uppercase tracking-widest transition-all button-tactile font-bold flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            DISPATCHING SECURE RECORD...
                          </>
                        ) : (
                          'Dispatch Brief to Pricing Desk'
                        )}
                      </button>

                    </form>
                  </div>
                </div>

              </div>
            </section>

            {/* TESTIMONIAL EDITORIAL VOICES SLIDE */}
            <section className="py-24 px-6 md:px-16 bg-zinc-950 text-white overflow-hidden relative select-text">
              <div className="max-w-[1400px] mx-auto relative z-10">
                
                <h2 className="heading-premium text-[80px] md:text-[145px] text-white/5 absolute -top-14 md:-top-24 -left-6 pointer-events-none uppercase font-black tracking-tighter">
                  Voices.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
                  
                  {/* Linda Miller testimonial */}
                  <div className="relative pt-12">
                    <span className="text-[120px] text-premium-red/20 font-serif absolute -top-16 -left-6 select-none pointer-events-none">
                      “
                    </span>
                    <p className="text-[22px] md:text-[32px] font-sans tracking-tight font-medium leading-snug mb-10 relative z-10 italic text-white/90">
                      The calmness and compassion was such a good influence. I do not think I could have managed without your team&apos;s expertise.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-[1px] bg-premium-red"></div>
                      <span className="font-mono text-[11px] uppercase tracking-widest font-black text-secondary">
                        Linda Miller / Private Relocation
                      </span>
                    </div>
                  </div>

                  {/* Rene Dreyer testimonial */}
                  <div className="relative pt-12 md:border-l md:border-white/10 md:pl-16">
                    <span className="text-[120px] text-premium-red/20 font-serif absolute -top-16 -left-6 md:left-10 select-none pointer-events-none">
                      “
                    </span>
                    <p className="text-[22px] md:text-[32px] font-sans tracking-tight font-medium leading-snug mb-10 relative z-10 italic text-white/90">
                      Awesome service, 13 years apart and still the gold standard. They include and empower diverse talent in their teams.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-[1px] bg-premium-red"></div>
                      <span className="font-mono text-[11px] uppercase tracking-widest font-black text-secondary">
                        Rene Dreyer / Executive Board
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </section>
          </motion.div>
        )}

        {/* 2. VIEW PORTAL: DEEP ACTIVE VIEW FOR OTHER TABS */}
        {activeTab !== 'landing' && (
          <section className="bg-white min-h-[80vh]">
            {/* Page Header */}
            <div className="relative bg-zinc-950 text-white py-24 px-6 md:px-16 border-b border-zinc-800 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-zinc-950/80 z-10"></div>
                <img 
                  alt="Background" 
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
                  className="w-full h-full object-cover grayscale opacity-40" 
                />
              </div>
              <div className="max-w-[1400px] mx-auto select-text relative z-20">
                <button
                  onClick={() => {
                    setActiveTab('landing');
                    setTimeout(() => {
                      const el = document.getElementById(activeTab === 'services' || activeTab === 'locations' || activeTab === 'storage' ? activeTab : 'quote');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="mb-8 text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors uppercase tracking-widest absolute -top-8 -left-2"
                >
                  ← Return to Operations
                </button>
                <span className="font-mono text-premium-red text-[11px] font-bold tracking-[0.25em] uppercase block mb-2">
                  {activeTab === 'services' && 'Corporate Capabilities'}
                  {activeTab === 'locations' && 'Logistics Infrastructure'}
                  {activeTab === 'storage' && 'Secure Vaults'}
                  {activeTab === 'blog' && 'Operations'}
                </span>
                <h1 className="heading-premium text-[36px] md:text-[56px] text-white tracking-tight leading-none font-black">
                  {activeTab === 'services' && 'Expertise & Services'}
                  {activeTab === 'locations' && 'Global & Domestic Routes'}
                  {activeTab === 'storage' && 'Short & Long-Term Storage Units'}
                  {activeTab === 'blog' && 'Intelligence & Blog'}
                </h1>
              </div>
            </div>

            <div className="px-6 md:px-16 py-12 max-w-[1400px] mx-auto select-text">
              {/* Render Blog Page */}
              {activeTab === 'blog' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-50 border border-zinc-200 p-8 md:p-12">
                  <BlogPage onQuoteRequested={() => {
                    setActiveTab('landing');
                    setTimeout(() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }} />
                </motion.div>
              )}

              {/* Render Services Page */}
              {activeTab === 'services' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-0 pb-16">
                  {/* Service 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="h-[350px] md:h-[500px] overflow-hidden">
                      <img src="https://www.mastermovers.co.za/wp-content/uploads/2021/02/householdmovers-1.png" alt="Residential Movers" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <div className="bg-zinc-50 p-12 md:p-24 flex flex-col justify-center border-b border-zinc-200 md:border-b-0">
                      <div className="w-12 h-0.5 bg-premium-red mb-8"></div>
                      <h3 className="font-sans font-black text-[32px] md:text-[40px] text-zinc-950 mb-6 tracking-tight">Residential Movers</h3>
                      <p className="text-secondary leading-relaxed mb-10 text-[15px]">
                        We offer an entire range of relocation services, reducing the stress and anxiety of moving your entire house to a new location.
                      </p>
                      <div>
                        <button 
                          onClick={() => {
                            setActiveTab('landing');
                            setTimeout(() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }), 100);
                          }}
                          className="bg-premium-red text-white hover:bg-zinc-950 px-8 py-4 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold"
                        >
                          Find Out More
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Service 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="bg-zinc-50 md:bg-white p-12 md:p-24 flex flex-col justify-center order-2 md:order-1 border-b border-zinc-200 md:border-b-0">
                      <div className="w-12 h-0.5 bg-premium-red mb-8"></div>
                      <h3 className="font-sans font-black text-[32px] md:text-[40px] text-zinc-950 mb-6 tracking-tight">Commercial Movers</h3>
                      <p className="text-secondary leading-relaxed mb-10 text-[15px]">
                        You can depend on Master Movers to move your office securely and professionally.
                      </p>
                      <div>
                        <button 
                          onClick={() => {
                            setActiveTab('landing');
                            setTimeout(() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }), 100);
                          }}
                          className="bg-premium-red text-white hover:bg-zinc-950 px-8 py-4 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold"
                        >
                          Find Out More
                        </button>
                      </div>
                    </div>
                    <div className="h-[350px] md:h-[500px] overflow-hidden order-1 md:order-2">
                      <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" alt="Commercial Movers" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    </div>
                  </div>

                  {/* Service 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="h-[350px] md:h-[500px] overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1494412519320-aa3da6e05a8d?q=80&w=2070&auto=format&fit=crop" alt="International Movers" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <div className="bg-zinc-50 p-12 md:p-24 flex flex-col justify-center border-b border-zinc-200 md:border-b-0">
                      <div className="w-12 h-0.5 bg-premium-red mb-8"></div>
                      <h3 className="font-sans font-black text-[32px] md:text-[40px] text-zinc-950 mb-6 tracking-tight">International Movers</h3>
                      <p className="text-secondary leading-relaxed mb-10 text-[15px]">
                        Moving abroad with Master Movers guarantee an expertised top-notch move.
                      </p>
                      <div>
                        <button 
                          onClick={() => {
                            setActiveTab('landing');
                            setTimeout(() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }), 100);
                          }}
                          className="bg-premium-red text-white hover:bg-zinc-950 px-8 py-4 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold"
                        >
                          Find Out More
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Service 4 */}
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="bg-zinc-50 md:bg-white p-12 md:p-24 flex flex-col justify-center order-2 md:order-1 border-b border-zinc-200 md:border-b-0">
                      <div className="w-12 h-0.5 bg-premium-red mb-8"></div>
                      <h3 className="font-sans font-black text-[32px] md:text-[40px] text-zinc-950 mb-6 tracking-tight">Storage</h3>
                      <p className="text-secondary leading-relaxed mb-10 text-[15px]">
                        With our storage units, your items will be stored safely and securely and you can access them as and when you need to.
                      </p>
                      <div>
                        <button 
                          onClick={() => {
                            setActiveTab('landing');
                            setTimeout(() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }), 100);
                          }}
                          className="bg-premium-red text-white hover:bg-zinc-950 px-8 py-4 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold"
                        >
                          Find Out More
                        </button>
                      </div>
                    </div>
                    <div className="h-[350px] md:h-[500px] overflow-hidden order-1 md:order-2">
                      <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" alt="Storage" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    </div>
                  </div>

                  {/* Service 5 */}
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="h-[350px] md:h-[500px] overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=2072&auto=format&fit=crop" alt="Office Move Project Management" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <div className="bg-zinc-50 p-12 md:p-24 flex flex-col justify-center border-b border-zinc-200 md:border-b-0">
                      <div className="w-12 h-0.5 bg-premium-red mb-8"></div>
                      <h3 className="font-sans font-black text-[32px] md:text-[40px] text-zinc-950 mb-6 tracking-tight leading-tight">Office Move Project Management</h3>
                      <p className="text-secondary leading-relaxed mb-10 text-[15px]">
                        Master Movers Office and IT Relocation Project Managers are highly experienced in organising and facilitating office moving projects.
                      </p>
                      <div>
                        <button 
                          onClick={() => {
                            setActiveTab('landing');
                            setTimeout(() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }), 100);
                          }}
                          className="bg-premium-red text-white hover:bg-zinc-950 px-8 py-4 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold"
                        >
                          Find Out More
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Service 6 */}
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="bg-zinc-50 md:bg-white p-12 md:p-24 flex flex-col justify-center order-2 md:order-1">
                      <div className="w-12 h-0.5 bg-premium-red mb-8"></div>
                      <h3 className="font-sans font-black text-[32px] md:text-[40px] text-zinc-950 mb-6 tracking-tight leading-tight">Recycling & Disposal of Office Furniture</h3>
                      <p className="text-secondary leading-relaxed mb-10 text-[15px]">
                        We do furniture removals, recycling & disposal.
                      </p>
                      <div>
                        <button 
                          onClick={() => {
                            setActiveTab('landing');
                            setTimeout(() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }), 100);
                          }}
                          className="bg-premium-red text-white hover:bg-zinc-950 px-8 py-4 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold"
                        >
                          Find Out More
                        </button>
                      </div>
                    </div>
                    <div className="h-[350px] md:h-[500px] overflow-hidden order-1 md:order-2">
                      <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop" alt="Recycling & Disposal of Office Furniture" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    </div>
                  </div>

                </motion.div>
              )}

              {/* Render Locations Page */}
              {activeTab === 'locations' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                  <div className="max-w-3xl mb-12">
                    <p className="text-secondary text-lg leading-relaxed">
                      Our national footprint spans major South African metropoles, equipped with specialized fleets, loading masters, and secure holding faculties to guarantee immediate dispatch and receiving.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {OFFICE_LOCATIONS.map((loc) => (
                      <div key={loc.id} className="border border-zinc-200 p-8 hover:shadow-lg transition-all group bg-white">
                        <div className="border-b border-zinc-100 pb-4 mb-4">
                          <span className="font-mono text-premium-red text-[10px] tracking-widest font-bold uppercase block mb-1">
                            {loc.short} HQ
                          </span>
                          <h3 className="font-sans text-2xl font-black text-zinc-950">{loc.name}</h3>
                        </div>
                        
                        <div className="space-y-4 text-sm">
                          <div className="flex items-start gap-3 text-secondary">
                            <MapPin className="w-4 h-4 text-zinc-400 mt-1 shrink-0 group-hover:text-premium-red transition-colors" />
                            <p className="leading-snug">{loc.address}</p>
                          </div>
                          
                          <div className="flex items-center gap-3 text-secondary">
                            <Phone className="w-4 h-4 text-zinc-400 group-hover:text-premium-red transition-colors" />
                            <a href={`tel:${loc.phone.replace(/\s+/g, '')}`} className="font-bold hover:text-zinc-950 transition-colors">
                              {loc.phone}
                            </a>
                          </div>
                          
                          <div className="flex items-center gap-3 text-secondary">
                            <Mail className="w-4 h-4 text-zinc-400 group-hover:text-premium-red transition-colors" />
                            <a href={`mailto:${loc.email}`} className="font-mono text-xs hover:text-zinc-950 transition-colors">
                              {loc.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-16 bg-zinc-950 text-white p-8 md:p-12 border border-premium-red/20 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="max-w-xl">
                      <h4 className="font-sans text-2xl font-black mb-2">Need a route assessment?</h4>
                      <p className="text-white/60 text-sm">
                        Engage our routing engineers for specialized clearance reports for fine-art or oversized industrial movements.
                      </p>
                    </div>
                    <motion.button 
                      animate={{ boxShadow: ['0 0 0px rgba(220, 38, 38, 0)', '0 0 20px rgba(220, 38, 38, 0.4)', '0 0 0px rgba(220, 38, 38, 0)'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      onClick={() => {
                        setActiveTab('landing');
                        setTimeout(() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }}
                      className="bg-premium-red text-white hover:bg-white hover:text-zinc-950 px-8 py-4 font-mono text-[11px] uppercase tracking-widest transition-all font-black shrink-0 whitespace-nowrap button-tactile"
                    >
                      Calculate Route Estimate
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Render Storage Page */}
              {activeTab === 'storage' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-24">
                  {/* Storage Locations Quick Nav */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto border-b border-zinc-200 pb-16">
                    <div className="flex flex-col items-center">
                      <MapPin className="w-10 h-10 text-premium-red mb-4" />
                      <h4 className="font-sans font-black text-lg mb-4 tracking-tight uppercase">Cape Town<br/>Storage</h4>
                      <button className="bg-premium-red text-white hover:bg-zinc-950 px-6 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold">Find Out More</button>
                    </div>
                    <div className="flex flex-col items-center">
                      <MapPin className="w-10 h-10 text-premium-red mb-4" />
                      <h4 className="font-sans font-black text-lg mb-4 tracking-tight uppercase">Johannesburg<br/>Storage</h4>
                      <button className="bg-premium-red text-white hover:bg-zinc-950 px-6 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold">Find Out More</button>
                    </div>
                    <div className="flex flex-col items-center">
                      <MapPin className="w-10 h-10 text-premium-red mb-4" />
                      <h4 className="font-sans font-black text-lg mb-4 tracking-tight uppercase">Durban<br/>Storage</h4>
                      <button className="bg-premium-red text-white hover:bg-zinc-950 px-6 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold">Find Out More</button>
                    </div>
                  </div>

                  {/* Cape Town Storage Details */}
                  <div className="flex flex-col items-center mb-16 text-center">
                    <h2 className="heading-premium text-[40px] md:text-[56px] text-premium-red tracking-tight leading-none mb-4">Storage Units Cape Town</h2>
                    <p className="text-xl text-zinc-950 font-medium">Modular storage solutions in Cape Town and the surrounding areas.</p>
                    <div className="flex gap-4 mt-8 justify-center">
                      <button 
                        onClick={() => {
                          setActiveTab('landing');
                          setTimeout(() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }), 100);
                        }}
                        className="bg-premium-red text-white hover:bg-zinc-950 px-8 py-4 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold"
                      >
                        Get a Quote
                      </button>
                      <button 
                        onClick={() => {
                          setBookingLocation('Cape Town');
                          setIsBookingModalOpen(true);
                        }}
                        className="bg-zinc-950 text-white hover:bg-premium-red px-8 py-4 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold flex items-center gap-2"
                      >
                         Book Unit
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                      <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" alt="Storage containers" className="w-full object-cover" />
                      <div className="mt-8">
                        <h4 className="text-zinc-950 font-sans uppercase font-medium tracking-wide mb-4">You may need storage facilities if you:</h4>
                        <ul className="space-y-3 text-sm text-secondary">
                          <li className="flex items-start gap-2"><span className="text-premium-red shrink-0 text-lg font-black leading-none">{'>'}</span> are downsizing your living space</li>
                          <li className="flex items-start gap-2"><span className="text-premium-red shrink-0 text-lg font-black leading-none">{'>'}</span> need to store family heirlooms and cherished goods and furniture</li>
                          <li className="flex items-start gap-2"><span className="text-premium-red shrink-0 text-lg font-black leading-none">{'>'}</span> occupation date has been delayed</li>
                          <li className="flex items-start gap-2"><span className="text-premium-red shrink-0 text-lg font-black leading-none">{'>'}</span> are undertaking home renovations</li>
                        </ul>
                        <p className="mt-6 text-sm text-secondary leading-relaxed">
                          We package all stored items in kiln-dried, rodent-free modular wooden pallets for short or long-term periods, depending on your needs. Our storage facilities in Cape Town are monitored 24 hours a day, 7 days a week by intruder alarms and patrol services, ensuring total peace of mind whilst we store your possessions.
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="mb-10">
                        <h4 className="text-zinc-950 font-sans uppercase font-medium tracking-wide mb-4">Safe & Affordable</h4>
                        <p className="text-premium-red uppercase text-sm font-medium mb-4">Master Movers' storage solutions are both safe, and affordable.</p>
                        <p className="text-sm text-secondary leading-relaxed mb-4">
                          For many years, Master Movers has been providing <span className="text-premium-red">Cape Town storage units</span> to hundreds of trusted clients.
                        </p>
                        <p className="text-sm text-secondary leading-relaxed mb-4">
                          People love collecting things and often find it hard to make space for all of it. As your items gather, your home gets cluttered and the stress of it all just brings you down. Storing items in a garage where they gather dust, ends up damaging them and they lose their value.
                        </p>
                        <p className="text-sm text-secondary leading-relaxed">
                          With our storage in Cape Town, your items will be stored safely and securely and you can access them as and when you need to.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-zinc-950 font-sans uppercase font-medium tracking-wide mb-6">Benefits of Cape Town Storage</h4>
                        <div className="space-y-6">
                          <div>
                            <h5 className="text-premium-red uppercase text-sm font-medium mb-2">Safety</h5>
                            <p className="text-sm text-secondary leading-relaxed">
                              As we know, Cape Town is not always the safest place to be. With 24/7 video and guard monitoring, your possessions are safe with Master Movers.
                            </p>
                          </div>
                          <div>
                            <h5 className="text-premium-red uppercase text-sm font-medium mb-2">Convenience</h5>
                            <p className="text-sm text-secondary leading-relaxed">
                              Clear up your clutter without throwing away your valuables. You can access your stuff as and when you please, making our storage solutions extremely convenient.
                            </p>
                          </div>
                          <div>
                            <h5 className="text-premium-red uppercase text-sm font-medium mb-2">Affordability</h5>
                            <p className="text-sm text-secondary leading-relaxed">
                              Master Movers' Cape Town storage solutions are affordable and provide a great alternative to storing your valuables in a dusty garage.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-zinc-200" />

                  {/* Durban Storage Details */}
                  <div className="flex flex-col items-center mb-16 text-center">
                    <h2 className="heading-premium text-[40px] md:text-[56px] text-premium-red tracking-tight leading-none mb-4">Storage Units Durban</h2>
                    <p className="text-xl text-zinc-950 font-medium">Modular storage solutions in Durban and the surrounding areas.</p>
                    <div className="flex gap-4 mt-8 justify-center">
                      <button 
                        onClick={() => {
                          setActiveTab('landing');
                          setTimeout(() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }), 100);
                        }}
                        className="bg-premium-red text-white hover:bg-zinc-950 px-8 py-4 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold"
                      >
                        Get a Quote
                      </button>
                      <button 
                        onClick={() => {
                          setBookingLocation('Durban');
                          setIsBookingModalOpen(true);
                        }}
                        className="bg-zinc-950 text-white hover:bg-premium-red px-8 py-4 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold flex items-center gap-2"
                      >
                         Book Unit
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                      <img src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=2072&auto=format&fit=crop" alt="Storage containers" className="w-full object-cover" />
                      <div className="mt-8">
                        <h4 className="text-zinc-950 font-sans uppercase font-medium tracking-wide mb-4">You may need storage facilities if you:</h4>
                        <ul className="space-y-3 text-sm text-secondary">
                          <li className="flex items-start gap-2"><span className="text-premium-red shrink-0 text-lg font-black leading-none">{'>'}</span> are downsizing your living space</li>
                          <li className="flex items-start gap-2"><span className="text-premium-red shrink-0 text-lg font-black leading-none">{'>'}</span> need to store family heirlooms and cherished goods and furniture</li>
                          <li className="flex items-start gap-2"><span className="text-premium-red shrink-0 text-lg font-black leading-none">{'>'}</span> occupation date has been delayed</li>
                          <li className="flex items-start gap-2"><span className="text-premium-red shrink-0 text-lg font-black leading-none">{'>'}</span> are undertaking home renovations</li>
                        </ul>
                        <p className="mt-6 text-sm text-secondary leading-relaxed">
                          We package all stored items in kiln-dried, rodent-free modular wooden pallets for short or long-term periods, depending on your needs. Our storage facilities in Durban are monitored 24 hours a day, 7 days a week by intruder alarms and patrol services, ensuring total peace of mind whilst we store your possessions.
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="mb-10">
                        <h4 className="text-zinc-950 font-sans uppercase font-medium tracking-wide mb-4">Safe & Affordable</h4>
                        <p className="text-premium-red uppercase text-sm font-medium mb-4">Master Movers' storage solutions are both safe, and affordable.</p>
                        <p className="text-sm text-secondary leading-relaxed mb-4">
                          For many years, Master Movers has been providing <span className="text-premium-red">storage units</span> in Durban to hundreds of trusted clients.
                        </p>
                        <p className="text-sm text-secondary leading-relaxed mb-4">
                          People love collecting things and often find it hard to make space for all of it. As your items gather, your home gets cluttered and the stress of it all just brings you down. Storing items in a garage where they gather dust, ends up damaging them and they lose their value.
                        </p>
                        <p className="text-sm text-secondary leading-relaxed">
                          With our storage in Durban, your items will be stored safely and securely and you can access them as and when you need to.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-zinc-950 font-sans uppercase font-medium tracking-wide mb-6">Benefits of Storage Units in Durban</h4>
                        <div className="space-y-6">
                          <div>
                            <h5 className="text-premium-red uppercase text-sm font-medium mb-2">Safety</h5>
                            <p className="text-sm text-secondary leading-relaxed">
                              As we know, Durban is not always the safest place to be. With 24/7 video and guard monitoring, your possessions are safe with Master Movers.
                            </p>
                          </div>
                          <div>
                            <h5 className="text-premium-red uppercase text-sm font-medium mb-2">Convenience</h5>
                            <p className="text-sm text-secondary leading-relaxed">
                              Clear up your clutter without throwing away your valuables. You can access your stuff as and when you please, making our storage solutions extremely convenient.
                            </p>
                          </div>
                          <div>
                            <h5 className="text-premium-red uppercase text-sm font-medium mb-2">Affordability</h5>
                            <p className="text-sm text-secondary leading-relaxed">
                              Master Movers' storage units in Durban are affordable and provide a great alternative to storing your valuables in a dusty garage.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-zinc-200" />

                  {/* Johannesburg Storage Details */}
                  <div className="flex flex-col items-center mb-16 text-center">
                    <h2 className="heading-premium text-[40px] md:text-[56px] text-premium-red tracking-tight leading-none mb-4">Storage Units Johannesburg</h2>
                    <p className="text-xl text-zinc-950 font-medium">Modular storage solutions in Johannesburg and the surrounding areas.</p>
                    <div className="flex gap-4 mt-8 justify-center">
                      <button 
                        onClick={() => {
                          setActiveTab('landing');
                          setTimeout(() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }), 100);
                        }}
                        className="bg-premium-red text-white hover:bg-zinc-950 px-8 py-4 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold"
                      >
                        Get a Quote
                      </button>
                      <button 
                        onClick={() => {
                          setBookingLocation('Johannesburg');
                          setIsBookingModalOpen(true);
                        }}
                        className="bg-zinc-950 text-white hover:bg-premium-red px-8 py-4 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold flex items-center gap-2"
                      >
                         Book Unit
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                      <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop" alt="Storage containers" className="w-full object-cover" />
                      <div className="mt-8">
                        <h4 className="text-zinc-950 font-sans uppercase font-medium tracking-wide mb-4">You may need storage facilities if you:</h4>
                        <ul className="space-y-3 text-sm text-secondary">
                          <li className="flex items-start gap-2"><span className="text-premium-red shrink-0 text-lg font-black leading-none">{'>'}</span> are downsizing your living space</li>
                          <li className="flex items-start gap-2"><span className="text-premium-red shrink-0 text-lg font-black leading-none">{'>'}</span> need to store family heirlooms and cherished goods and furniture</li>
                          <li className="flex items-start gap-2"><span className="text-premium-red shrink-0 text-lg font-black leading-none">{'>'}</span> occupation date has been delayed</li>
                          <li className="flex items-start gap-2"><span className="text-premium-red shrink-0 text-lg font-black leading-none">{'>'}</span> are undertaking home renovations</li>
                        </ul>
                        <p className="mt-6 text-sm text-secondary leading-relaxed">
                          We package all stored items in kiln-dried, rodent-free modular wooden pallets for short or long-term periods, depending on your needs. Our storage facilities in Johannesburg are monitored 24 hours a day, 7 days a week by intruder alarms and patrol services, ensuring total peace of mind whilst we store your possessions.
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="mb-10">
                        <h4 className="text-zinc-950 font-sans uppercase font-medium tracking-wide mb-4">Safe & Affordable</h4>
                        <p className="text-premium-red uppercase text-sm font-medium mb-4">Master Movers' storage solutions are both safe, and affordable.</p>
                        <p className="text-sm text-secondary leading-relaxed mb-4">
                          For many years, Master Movers has been providing <span className="text-premium-red">storage units</span> in Johannesburg to hundreds of trusted clients.
                        </p>
                        <p className="text-sm text-secondary leading-relaxed mb-4">
                          People love collecting things and often find it hard to make space for all of it. As your items gather, your home gets cluttered and the stress of it all just brings you down. Storing items in a garage where they gather dust, ends up damaging them and they lose their value.
                        </p>
                        <p className="text-sm text-secondary leading-relaxed">
                          With our storage in Johannesburg, your items will be stored safely and securely and you can access them as and when you need to.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-zinc-950 font-sans uppercase font-medium tracking-wide mb-6">Benefits of Storage in Johannesburg</h4>
                        <div className="space-y-6">
                          <div>
                            <h5 className="text-premium-red uppercase text-sm font-medium mb-2">Safety</h5>
                            <p className="text-sm text-secondary leading-relaxed">
                              As we know, Johannesburg is not always the safest place to be. With 24/7 video and guard monitoring, your possessions are safe with Master Movers.
                            </p>
                          </div>
                          <div>
                            <h5 className="text-premium-red uppercase text-sm font-medium mb-2">Convenience</h5>
                            <p className="text-sm text-secondary leading-relaxed">
                              Clear up your clutter without throwing away your valuables. You can access your stuff as and when you please, making our storage solutions extremely convenient.
                            </p>
                          </div>
                          <div>
                            <h5 className="text-premium-red uppercase text-sm font-medium mb-2">Affordability</h5>
                            <p className="text-sm text-secondary leading-relaxed">
                              Master Movers' Johannesburg storage solutions are affordable and provide a great alternative to storing your valuables in a dusty garage.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* CORE SYSTEM ACCREDITATIONS CAROUSEL BAR ROW */}
      <section className="bg-white border-t border-zinc-200 py-10 select-none">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center items-center opacity-70">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-premium-red" />
            <span className="font-mono text-[11px] tracking-wider text-zinc-900 font-bold">BEE LEVEL 1 CERTIFIED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono">ISO 9001:2015</span>
            <span className="font-mono text-[10px] tracking-wider text-zinc-400">QUALITY FRAMEWORK</span>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-zinc-500" />
            <span className="font-mono text-[11px] tracking-wider text-zinc-900 font-bold">RTMS COMPLIANT</span>
          </div>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-zinc-500" />
            <span className="font-mono text-[11px] tracking-wider text-zinc-900 font-bold">Symmetric POPI Encryption</span>
          </div>
        </div>
      </section>

      {/* PREMIUM BUSINESS FOOTER MODULE */}
      <footer className="bg-white border-t border-zinc-200 pt-20 pb-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 select-text">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            <div className="col-span-1 md:col-span-2">
              <h3 className="heading-premium text-[32px] text-zinc-950 mb-6 uppercase tracking-tight font-black">
                Master Movers.
              </h3>
              <p className="text-secondary max-w-sm text-sm leading-relaxed mb-8">
                Premium relocation intelligence since 1998. Accredited professional moving services for high-value individuals and sovereign enterprise. All systems encrypted symmetrically under strict transformation regulations.
              </p>
              
              <div className="flex gap-6 font-mono text-[12px] uppercase tracking-widest font-bold">
                <a className="hover:text-premium-red transition-all flex items-center gap-1" href="#instagram">
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
                <a className="hover:text-premium-red transition-all flex items-center gap-1" href="#linkedin">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
                <a className="hover:text-premium-red transition-all flex items-center gap-1" href="#twitter">
                  <Twitter className="w-4 h-4" /> Twitter
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-zinc-400">
                Intelligence
              </h4>
              <ul className="space-y-4 font-sans text-xs">
                <li>
                  <button onClick={() => setActiveTab('landing')} className="text-secondary hover:text-zinc-950 text-left transition-colors font-semibold">
                    Relocation Audit Blog
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('tracking'); window.scrollTo({ top: 0 }); }} className="text-secondary hover:text-zinc-950 text-left transition-colors font-semibold">
                    Global Logistics Telemetry Map
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('landing')} className="text-secondary hover:text-zinc-950 text-left transition-colors font-semibold">
                    CSR Circular Charity Index
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-zinc-400">
                Compliance
              </h4>
              <ul className="space-y-4 font-mono text-[11px] leading-tight">
                <li>
                  <a className="text-secondary hover:text-zinc-950 block" href="#privacy">
                    POPI Act Privacy Protocol
                  </a>
                </li>
                <li>
                  <a className="text-secondary hover:text-zinc-950 block" href="#terms">
                    General Terms of Engagement
                  </a>
                </li>
                <li>
                  <a className="text-secondary hover:text-zinc-950 block" href="#maritime">
                    Maritime Freight Accreditations
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="flex flex-col md:flex-row justify-between items-center border-t border-zinc-200 pt-10 font-mono text-[10px] text-zinc-400 uppercase tracking-widest gap-4">
            <span>© 2026 MASTER MOVERS LOGISTICS INTEL. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-8">
              <span>South Africa Hub</span>
              <span>Global Ingress Operations</span>
            </div>
          </div>
        </div>
      </footer>

      {/* PERSISTENT FLOATING WHATSAPP CHAT DRAWER */}
      <WhatsAppWidget briefs={briefs} />
      
      <StorageBookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        location={bookingLocation} 
      />

    </div>
  );
}
