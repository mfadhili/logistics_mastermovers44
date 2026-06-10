import React, { useState } from 'react';
import { FileText, ArrowLeft, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlogPageProps {
  onQuoteRequested: () => void;
}

export default function BlogPage({ onQuoteRequested }: BlogPageProps) {
  const [activeArticle, setActiveArticle] = useState<number | null>(null);

  const articles = [
    {
      title: "5 Essential Tips for Choosing a Moving Company in South Africa (What to Look For)",
      excerpt: "Choosing a moving company is an important decision. A trusted mover protects your belongings, reduces stress and keeps the process efficient.",
      category: "General",
      date: "28 Nov 2025",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      content: [
        { type: "p", text: "Choosing a moving company is one of the most important decisions when relocating. A trusted mover protects your belongings, reduces stress and keeps the process efficient." },
        { type: "h3", text: "1. Experience & Accreditation" },
        { type: "p", text: "Master Movers employs trained, permanent staff — not temporary labour." },
        { type: "h3", text: "2. Transparent and Fair Pricing" },
        { type: "p", text: "Their “quote freeze” system helps avoid unexpected price changes." },
        { type: "h3", text: "3. Service Coverage Across South Africa" },
        { type: "p", text: "With branches in Johannesburg, Cape Town and Durban, they offer nationwide consistency." },
        { type: "h3", text: "4. Packing, Storage and Additional Services" },
        { type: "p", text: "Master Movers provides wrapping, packing, storage and optional insurance." },
        { type: "h3", text: "5. Reviews, Reputation & Reliability" },
        { type: "p", text: "Years of positive customer reviews help confirm their professionalism." },
        { type: "cta", text: "GET A PRO QUOTE NOW" },
        { type: "h3", text: "Final Thoughts" },
        { type: "p", text: "A safe and stress-free move starts with the right company. Master Movers delivers on experience, reliability and service." }
      ]
    },
    {
      title: "Relocating Within Johannesburg? Here's Why Master Movers Makes Your Move Seamless",
      excerpt: "Moving home in Johannesburg can easily become overwhelming. See how we navigate complex suburbs like Sandton and Fourways.",
      category: "General",
      date: "28 Nov 2025",
      img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop",
      content: [
        { type: "p", text: "Moving home in Johannesburg can easily become overwhelming. With a fast-paced lifestyle, dense suburbs, high-rise apartments, unpredictable traffic, and complex access issues across areas like Sandton, Fourways, Rosebank, Midrand, Bedfordview and the Johannesburg CBD — even a “small” move can become a logistical nightmare." },
        { type: "p", text: "That’s exactly why more residents are choosing Master Movers, one of South Africa’s most established moving companies, with strong operational teams in JHB, Cape Town and Durban." },
        { type: "h3", text: "1. Local Expertise in Johannesburg’s Unique Neighbourhoods" },
        { type: "p", text: "Johannesburg is not like other cities. Every neighbourhood has its own challenges, and Master Movers has the experience to navigate them." },
        { type: "h3", text: "2. Professional Packing Services That Protect Your Valuables" },
        { type: "p", text: "Master Movers uses trained permanent staff and high-quality packing materials that reduce breakage and ensure safe handling." },
        { type: "cta", text: "BOOK YOUR JHB MOVE SECURELY" },
        { type: "h3", text: "3. Transparent Pricing & “Quote Freeze” Protection" },
        { type: "p", text: "Once your quote is approved, the price remains fixed, helping you budget more accurately." },
        { type: "h3", text: "4. Optional Storage for Delayed Occupation" },
        { type: "p", text: "Secure short- and long-term storage options are available across JHB, CPT and DBN." },
        { type: "h3", text: "5. Peace of Mind From Start to Finish" },
        { type: "p", text: "Their team assists from planning to unloading, making your entire move smooth and stress-free." }
      ]
    },
    {
      title: "Avoiding Moving Scams in South Africa: What to Look For",
      excerpt: "Moving fraud can be avoided by spotting some red flags. Here are the signs of a fraudulent moving company.",
      category: "Moving Tips",
      date: "27 Jun 2023",
      img: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=2070&auto=format&fit=crop",
      content: [
        { type: "p", text: "Moving scams have left many South Africans with damaged or lost belongings. Apart from the financial losses, being a victim of crime can be a traumatic and devastating experience. We have some tips to avoid fraudulent moving companies in South Africa." },
        { type: "h3", text: "Red Flags of a Moving Scam in South Africa" },
        { type: "p", text: "Moving fraud can be avoided by spotting some red flags. Here are the signs of a fraudulent moving company so that you or your company can avoid being a victim:" },
        { type: "p", text: "• Unrealistic pricing: You may be tempted to save money but if a moving company offers you a price that’s lower than the market price, it could be a sign of a scam. Legitimate moving companies will factor in various costs such as labour, fuel, and insurance." },
        { type: "p", text: "• No physical address: A reputable moving company should have a physical address or list of their offices. If a company only has a website or phone number and doesn’t provide a physical address, it could be a red flag." },
        { type: "cta", text: "GET A VERIFIED, ACCREDITED QUOTE" },
        { type: "p", text: "• Lack of accreditation and insurance: Know your legal rights. Legitimate moving companies in South Africa have some form of insurance cover in place, while fake or bad companies will give you the cheapest rate and bypass any insurance coverage. Check if the moving company is accredited with AMOSA (Accredited Movers of South Africa)." },
        { type: "p", text: "• Demands for cash payment: If a moving company demands only cash payment upfront, it’s a red flag. A legitimate company will accept various payment methods such as credit cards, EFTs, or bank transfers." },
        { type: "h3", text: "Questions to Ask Before Hiring a South African Moving Company" },
        { type: "p", text: "1. What services do you offer?\n2. What are your prices?\n3. Are you insured?\n4. How many years have you been in business?\n5. Do you have references?" },
        { type: "p", text: "Master Movers is an AMOSA-accredited reputable moving company in South Africa. We are located across the country and have been helping clients with home and corporate moves for the past 30 years." }
      ]
    },
    {
      title: "Where Can You Find the Top Industries in South Africa?",
      excerpt: "Corporate relocation is a big decision. Here are some cities where your industry may find success.",
      category: "News",
      date: "28 Mar 2023",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
      content: [
        { type: "p", text: "Corporate relocation is a big decision. You have to ensure you are moving to the best city for your business. If you’re thinking of a corporate move, here are some cities where your industry may find success." },
        { type: "h3", text: "IT Industry – Cape Town" },
        { type: "p", text: "IT is one of the fastest-growing South African industries. IT companies can find success anywhere around the country. Cape Town, however, is a popular corporate location for IT departments. The largest number of registered IT companies in South Africa comes from the Western Cape." },
        { type: "h3", text: "Manufacturing Industry – Johannesburg" },
        { type: "p", text: "It’s not surprising that Johannesburg is the leader in the manufacturing and services industries. The city is home to the Johannesburg Stock Exchange and has a large demand for goods and services." },
        { type: "cta", text: "RELOCATE YOUR BUSINESS PROFESSIONALLY" },
        { type: "h3", text: "Import and Export – Durban" },
        { type: "p", text: "Durban is another busy city when it comes to the trading and movement of goods. The coastal city is home to the busiest port in South Africa, making it the best place for the import and export industry." },
        { type: "h3", text: "Master Movers Corporate Relocation Across South Africa" },
        { type: "p", text: "The Master Movers team can ensure you have a successful move no matter where your business chooses to move. As a corporate relocation company, we take care of all office moves across South Africa (and internationally), ensuring your move is done within your budget and timeframe. Hire our corporate relocation team for your office move today!" }
      ]
    },
    {
      title: "How to Move Your Belongings to Another Country",
      excerpt: "International relocation isn’t easy. Find out the best route for your international move in this guide.",
      category: "Moving Tips",
      date: "21 Mar 2023",
      img: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop",
      content: [
         { type: "p", text: "Is it time for an overseas move? International relocation isn’t easy, but hiring a moving company can help you get your belongings transported overseas. However, before you call your moving company, you have to decide how to move your belongings overseas. Find out the best route for your international move in this guide." },
         { type: "h3", text: "Moving Your Belongings via Sea Freight" },
         { type: "p", text: "Shipping your belongings is the most convenient way to get your items to your new country. Sea freight is both cost-effective and easy. When you pick a shipping route, you will receive a quote that will include your container hire and transport fees. Fees are usually based on the weight and size of your belongings." },
         { type: "p", text: "If you choose to ship, it’s best to hire an international moving company, as they provide door-to-port services. International movers will explain to you the options you have for shipping items and arrive at your home or office with a container. Movers will help you load the container and transport it to the port of your choice." },
         { type: "cta", text: "GET AN INTERNATIONAL SHIPPING ESTIMATE" },
         { type: "h3", text: "Moving Your Belongings by Air Freight" },
         { type: "p", text: "Air freight is the safest option you can use for moving abroad. It is not as commonly used as sea freight as it is often more expensive. There is also a limit on the weight that you can transport as a plane can only hold so many items." },
         { type: "h3", text: "Hire International Movers to Help You Move Overseas" },
         { type: "p", text: "Professional movers can make your international move easier and quicker. The Master Movers team handles all aspects of an international move, including door-to-depot and door-to-door services to reduce your moving time. Along with transportation, you can receive expert packing materials to ensure the safety of your belongings during the long transit." }
      ]
    },
    {
      title: "International Moves: Is It Cheaper to Ship Items or Buy New Ones?",
      excerpt: "Are you moving to another country? Planning for an international move requires deciding between shipping vs buying new.",
      category: "News",
      date: "7 Mar 2023",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
      content: [
        { type: "p", text: "Are you moving to another country? Planning for an international move is an exciting yet stressful experience. It may be easier for you to ship your items than to buy new ones. Find out more about shipping your items overseas in this guide." },
        { type: "h3", text: "Shipping vs. Buying New Belongings" },
        { type: "p", text: "Moving abroad comes with more complex challenges than a local move. You will have to decide which items are essential to you and which you would rather sell before moving. Most people decide to keep larger and more expensive items, such as furniture as it is a more affordable option." },
        { type: "p", text: "When it comes to furniture, you have two options when moving overseas: purchase brand-new furniture or move your existing furniture. The choice will depend on your budget and whether you can afford to buy brand-new furniture in your new country." },
        { type: "h3", text: "How Much Will It Cost?" },
        { type: "p", text: "With the current unpredictable economy and the cost of inflation worldwide, family and corporate teams often choose to not move overseas without taking some items with them. If you are shipping your household or office belongings overseas, your shipping costs will be based on the amount of stuff you are moving." },
        { type: "cta", text: "CALCULATE EXPORT & OVERSEAS COSTS" },
        { type: "h3", text: "Hiring a Mover Can Help" },
        { type: "p", text: "International movers can save you a lot of time and money by helping you pack and transport your items. Movers come with expert packing materials to ensure your belongings are packaged securely and will arrive as safely as possible at your new destination. When you hire the Master Movers team of professional movers, we work within your budget and timeframe." }
      ]
    }
  ];

  return (
    <AnimatePresence mode="wait">
      {activeArticle === null ? (
        <motion.div 
          key="list"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="pb-16"
        >
          <div className="flex items-center gap-4 mb-10">
            <div>
              <h3 className="heading-premium text-[32px] md:text-[40px] text-zinc-950 font-black tracking-tight">Intelligence & Operations Blog</h3>
              <p className="text-secondary text-sm">Essential logistics intelligence, guides, and corporate briefs for your next move.</p>
            </div>
            <span className="ml-auto font-mono text-[10px] bg-zinc-100 text-zinc-600 px-3 py-1 uppercase font-bold hidden sm:inline-block">
              Intelligence
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                key={idx} 
                onClick={() => {
                  setActiveArticle(idx);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group border border-zinc-200 bg-white hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer hover:border-premium-red/20"
              >
                <div className="h-56 overflow-hidden relative">
                   <img src={article.img} className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={article.title} />
                   <span className="absolute top-4 left-4 bg-zinc-950 text-white px-3 py-1 font-mono text-[9px] uppercase tracking-widest font-black">
                     {article.category}
                   </span>
                </div>
                <div className="p-8 flex flex-col grow">
                  <span className="font-mono text-[10px] text-zinc-400 mb-3 block border-b border-zinc-100 pb-2">{article.date}</span>
                  <h4 className="font-sans font-black text-lg text-zinc-950 mb-3 leading-snug group-hover:text-premium-red transition-colors">{article.title}</h4>
                  <p className="text-sm text-secondary leading-relaxed mb-8 block grow">{article.excerpt}</p>
                  <div className="flex items-center gap-2 mt-auto pt-4 border-t border-zinc-100">
                    <span className="font-mono text-[10px] text-premium-red uppercase font-bold tracking-widest group-hover:tracking-[0.2em] transition-all">Read Operations Brief</span>
                    <ArrowRight className="w-3.5 h-3.5 text-premium-red" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 bg-zinc-950 text-white p-12 text-center flex flex-col items-center">
            <ShieldCheck className="w-12 h-12 text-premium-red mb-6" />
            <h4 className="text-2xl font-black mb-4">Ready to Execute Your Move?</h4>
            <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed mb-8">Our pricing desk generates accurate quotes grounded in operational realities, ensuring transparency from loading dock to destination.</p>
            <motion.button 
              animate={{ boxShadow: ['0 0 0px rgba(220, 38, 38, 0)', '0 0 20px rgba(220, 38, 38, 0.4)', '0 0 0px rgba(220, 38, 38, 0)'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              onClick={onQuoteRequested}
              className="bg-premium-red text-white hover:bg-white hover:text-zinc-950 px-8 py-4 font-mono text-[11px] uppercase tracking-widest transition-all button-tactile font-black flex items-center justify-center gap-2"
            >
              Get Moving Quote
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="article"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white border border-zinc-200"
        >
          {/* Article Header */}
          <div className="p-8 md:p-12 border-b border-zinc-200 bg-zinc-50 relative overflow-hidden">
            <button 
              onClick={() => setActiveArticle(null)}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-950 transition-colors font-mono text-[10px] uppercase font-bold tracking-widest mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Intelligence
            </button>
            <div className="flex gap-3 mb-6">
              <span className="font-mono text-[10px] bg-zinc-950 text-white px-3 py-1 uppercase font-bold">{articles[activeArticle].category}</span>
              <span className="font-mono text-[10px] bg-zinc-200 text-zinc-600 px-3 py-1 uppercase font-bold">{articles[activeArticle].date}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-zinc-950 tracking-tight leading-tight max-w-4xl">{articles[activeArticle].title}</h1>
          </div>
          
          <div className="h-64 sm:h-96 w-full overflow-hidden">
             <img src={articles[activeArticle].img} alt="Article Cover" className="w-full h-full object-cover" />
          </div>

          <div className="max-w-3xl mx-auto p-8 md:p-16">
            <div className="prose prose-zinc prose-lg">
              {articles[activeArticle].content.map((block, i) => {
                if (block.type === 'p') {
                  return <p key={i} className="text-zinc-600 leading-relaxed mb-6 font-sans whitespace-pre-line">{block.text}</p>;
                } else if (block.type === 'h3') {
                  return <h3 key={i} className="text-2xl font-black text-zinc-950 tracking-tight mt-10 mb-4">{block.text}</h3>;
                } else if (block.type === 'cta') {
                  return (
                    <div key={i} className="my-10 p-8 border-l-4 border-premium-red bg-zinc-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div>
                        <h4 className="font-bold text-zinc-950 mb-1">Make Your Move Seamless</h4>
                        <p className="text-sm text-zinc-500">Contact Master Movers for accredited, professional service.</p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onQuoteRequested}
                        className="bg-premium-red text-white hover:bg-zinc-950 px-6 py-3 font-mono text-[11px] uppercase tracking-widest transition-colors font-bold whitespace-nowrap"
                      >
                        {block.text}
                      </motion.button>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            
            <div className="mt-16 pt-8 border-t border-zinc-200 flex justify-between items-center">
               <button 
                  onClick={() => setActiveArticle(null)}
                  className="flex items-center gap-2 text-zinc-500 hover:text-zinc-950 transition-colors font-mono text-[10px] uppercase font-bold tracking-widest"
                >
                  <ArrowLeft className="w-4 h-4" /> Explore More Articles
                </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

