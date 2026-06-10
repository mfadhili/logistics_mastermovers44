/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Shield, Clock } from 'lucide-react';
import { RelocationBrief } from '../types';

interface WhatsAppWidgetProps {
  briefs: RelocationBrief[];
}

interface Message {
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export default function WhatsAppWidget({ briefs }: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'agent',
      text: 'Greetings. This is the Master Movers Premium Intel Desk. Please specify your Operational Brief ID or ask anything about premium relocation, pricing models, or POPI Act protocols.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add User Message
    const newMessages: Message[] = [...messages, { sender: 'user', text: userText, timestamp: userTimestamp }];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    // Simulate Agent Reply after 1 second
    setTimeout(() => {
      let replyText = '';
      const textLower = userText.toLowerCase();

      if (textLower.includes('track') || textLower.includes('brief') || textLower.includes('status') || textLower.includes('id')) {
        // Try to identify if there's any brief
        if (briefs.length > 0) {
          const matched = briefs.find(b => textLower.includes(b.id.toLowerCase()) || textLower.includes(b.fullName.toLowerCase()));
          if (matched) {
            replyText = `Status update on Record [${matched.id}] for ${matched.fullName}: Currently set to "${matched.status.replace('_', ' ')}". Transit route: ${matched.origin} to ${matched.destination}. Est Weight: ${matched.estimatedVolumeCbm.toFixed(1)} CBM. Standard cost calculated: ZAR ${matched.calculatedCostZar.toLocaleString()}. All assets are fully insured.`;
          } else {
            replyText = `I found ${briefs.length} total briefs in our secure local intelligence index. Available IDs: ${briefs.map(b => b.id).join(', ')}. Please input a specific ID to pull coordinates and flight parameters.`;
          }
        } else {
          replyText = 'There are currently no active relocation briefs on this device index. Please scroll down to the "Initiate Request" dashboard section to dispatch a brief.';
        }
      } else if (textLower.includes('price') || textLower.includes('cost') || textLower.includes('quote') || textLower.includes('zar')) {
        replyText = 'Our volumetric algorithm calculates pricing based on container space. Base premium cargo fee stands at ZAR 2,500 per Cubic Meter (CBM). Special handling (Fine Arts, piano boxes) incurs a custom 15% protocol rider. Submit your inventory checklist in the form for a precise logistics estimation.';
      } else if (textLower.includes('bee') || textLower.includes('level') || textLower.includes('safety')) {
        replyText = 'Master Movers is a verified BEE Level 1 provider, ensuring maximum transformation and absolute protocol compliance. We execute moves under strict maritime and domestic security standards.';
      } else if (textLower.includes('popi') || textLower.includes('privacy') || textLower.includes('leak')) {
        replyText = 'Under South African POPI Act guidelines, all customer legal brief inputs, phone credentials, and asset lists are stored on cloud server partitions, encrypted symmetrically, and auto-purged post-delivery.';
      } else if (textLower.includes('hello') || textLower.includes('hi') || textLower.includes('hey')) {
        replyText = 'Hello. I am Rene Dreyer from the Executive Relocation Board. Are you looking to coordinate a private residence move or an enterprise office layout today?';
      } else {
        replyText = 'I have relayed your operational parameters to our senior analysts desk. Standard brief turnaround is under 180 minutes. For immediate dispatch assistance, you can call our direct line at +27 11 493 7569.';
      }

      setMessages(prev => [...prev, {
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] font-sans">
      {/* Absolute Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="whatsapp-trigger-btn"
          className="bg-zinc-950 text-white h-14 w-14 flex items-center justify-center shadow-2xl hover:bg-safety-green hover:text-zinc-950 transition-all group overflow-hidden border border-white/10 rounded-full cursor-pointer relative"
          title="Open Live Chat Desk"
        >
          <MessageSquare className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="absolute top-1 right-1 w-3 h-3 bg-safety-green border-2 border-zinc-950 rounded-full animate-bounce"></span>
        </button>
      )}

      {/* Actual Live Chat Drawer */}
      {isOpen && (
        <div className="w-[340px] md:w-[380px] bg-white border border-zinc-200 shadow-2xl flex flex-col rounded-lg overflow-hidden animate-slide-up">
          {/* Chat Header */}
          <div className="bg-zinc-950 text-white p-4 flex justify-between items-center border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-premium-red text-white flex items-center justify-center font-bold text-sm tracking-tighter">
                  MM
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-safety-green border border-zinc-950 rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold tracking-wider uppercase leading-tight">
                  Logistical Intel Desk
                </span>
                <span className="text-[10px] text-white/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-safety-green rounded-full inline-block"></span>
                  Operators Active Online
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white p-1 hover:bg-white/10 transition-all rounded cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Info Bar */}
          <div className="bg-zinc-100 px-4 py-2 flex items-center justify-between text-[9px] font-mono text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-safety-green" /> Compliance Secure</span>
            <span>Est. Response: &lt; 2m</span>
          </div>

          {/* Chat Body Scroll Frame */}
          <div className="h-[280px] overflow-y-auto p-4 bg-zinc-50 space-y-3 flex flex-col">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg p-3 text-[13px] leading-relaxed select-text ${
                  msg.sender === 'user'
                    ? 'bg-zinc-950 text-white self-end rounded-br-none'
                    : 'bg-white text-zinc-900 self-start border border-zinc-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="font-mono text-[9px] font-bold text-premium-red uppercase mb-1">
                  {msg.sender === 'user' ? 'Client Request' : 'Rene Dreyer (Intel)'}
                </div>
                <p className="whitespace-pre-line">{msg.text}</p>
                <div className="text-[9px] text-zinc-400 mt-1 text-right font-mono flex items-center justify-end gap-1">
                  {msg.timestamp}
                  {msg.sender === 'user' && <span className="text-safety-green">✓✓</span>}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="bg-white text-zinc-500 self-start border border-zinc-200 rounded-lg rounded-bl-none p-3 text-[12px] shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Prompts */}
          <div className="px-3 py-2 bg-white border-t border-zinc-100 flex flex-nowrap overflow-x-auto gap-2 scrollbar-none">
            <button 
              onClick={() => setInputValue('How is the moving cost calculated?')}
              className="text-[10px] font-mono px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 shrink-0 border border-zinc-200 transition-all"
            >
              Estimate Pricing
            </button>
            <button 
              onClick={() => setInputValue('Are you BEE Level 1 Compliant?')}
              className="text-[10px] font-mono px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 shrink-0 border border-zinc-200 transition-all"
            >
              BEE Status
            </button>
            <button 
              onClick={() => setInputValue('Check status of brief BRIEF-1998A')}
              className="text-[10px] font-mono px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 shrink-0 border border-zinc-200 transition-all"
            >
              Track Sample
            </button>
          </div>

          {/* Chat Form Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-zinc-200 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type message or Brief ID..."
              className="flex-1 bg-zinc-50 border border-zinc-300 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 px-3 py-2 text-xs font-sans placeholder:text-zinc-400"
            />
            <button
              type="submit"
              className="bg-zinc-950 hover:bg-premium-red text-white p-2 transition-colors flex items-center justify-center button-tactile shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
