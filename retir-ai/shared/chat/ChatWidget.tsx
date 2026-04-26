'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { detectIntent, getResponse } from './chatEngine';
import { useTier } from '@/shared/TierProvider';
import { useChat } from './ChatProvider';
import { usePicture } from '@/modules/identity/PictureProvider';
import type { ChatMessage } from '@/shared/types';
import type { PartialPicture } from '@/modules/identity/picture-types';

function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

/**
 * Welcome message adapts to the user's state so brand-new users don't see
 * Mats's personalised briefing as if it were theirs. Three states:
 *  - mock demo  → the fully-loaded "3 things" briefing
 *  - user mode with a populated picture → a greeting by first name
 *  - user mode with an empty picture → a teaching onboarding prompt
 */
function welcomeFor(mode: 'mock' | 'user', picture: PartialPicture): ChatMessage {
  if (mode === 'mock') {
    return {
      role: 'bot',
      text: `Hello Mats! I'm your Prevista advisor. I've analysed your career across France, Switzerland, and Luxembourg.\n\n**3 things need your attention:**\n1. Your **Luxembourg employer pension (RCP)** hasn't been located yet — typically the second-largest slice for LU residents\n2. You have **2 contribution gaps** and a **freelance year** with unclear attribution\n3. Retiring at **64** carries a risk of permanent French pension penalty\n\nYour projected income is **€1,660/month below your goal**.`,
      suggestions: [
        'What is my LU RCP?',
        'Explain my gaps',
        'Is retiring at 64 safe?',
        'What documents am I missing?',
      ],
    };
  }

  const hasOpening = picture.residenceCountry != null && picture.age != null;
  if (!hasOpening) {
    return {
      role: 'bot',
      text: `Welcome to Prevista. I'm your pension advisor, and I'll get more useful as you fill in your picture.\n\nStart by answering the first few questions on the **Your picture** page — it takes about 2 minutes. Once I know where you live, your age, and your career countries, I can flag gaps, model retirement scenarios, and help you find forgotten pensions.`,
      suggestions: [
        'How does Prevista work?',
        'What countries are supported?',
        'Why do you need my age?',
      ],
    };
  }

  const name = picture.firstName ?? 'there';
  const worked = picture.countriesWorked ?? [];
  const countries = picture.residenceCountry ? [picture.residenceCountry, ...worked] : worked;
  const countryLine =
    countries.length > 0
      ? `I can see your career across ${countries.length} ${countries.length === 1 ? 'country' : 'countries'}.`
      : 'I can help once you\u2019ve added where you\u2019ve worked.';
  return {
    role: 'bot',
    text: `Hi ${name} — I'm your Prevista advisor. ${countryLine}\n\nAsk me anything about your pension picture, or tap a suggestion to start.`,
    suggestions: [
      'Explain my pension gaps',
      'What documents should I upload?',
      'Is retiring at 64 safe?',
    ],
  };
}

export function ChatWidget() {
  const { isPro } = useTier();
  const { registerHandler } = useChat();
  const { mode, picture } = usePicture();
  const welcomeMessage = useMemo(() => welcomeFor(mode, picture), [mode, picture]);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setBadgeVisible(false);
        if (messages.length === 0) setMessages([welcomeMessage]);
      }
      return next;
    });
  }, [messages.length, welcomeMessage]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: ChatMessage = { role: 'user', text, suggestions: [] };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setInputValue('');

    setTimeout(() => {
      const intent = detectIntent(text);
      const resp = getResponse(intent, isPro);
      const botMsg: ChatMessage = { role: 'bot', text: resp.text, suggestions: resp.suggestions };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  }, [isPro, isTyping]);

  // Register an external-open handler. External CTAs call ChatProvider's
  // `openWithSeed`, which invokes this handler directly (event-handler
  // context, not effect body) — so setState calls below are fine.
  useEffect(() => {
    const handleSeed = (seed: string) => {
      setBadgeVisible(false);
      setIsOpen(true);
      setMessages((prev) => (prev.length === 0 ? [welcomeMessage] : prev));
      // Defer slightly so the panel has rendered before the seeded
      // user message appears.
      setTimeout(() => sendMessage(seed), 120);
    };
    return registerHandler(handleSeed);
  }, [registerHandler, sendMessage, welcomeMessage]);

  return (
    <>
      {/* Panel */}
      <div
        className="fixed z-[91] flex flex-col overflow-hidden"
        style={{
          bottom: 92, right: 24, width: 420, maxWidth: 'calc(100vw - 48px)',
          height: 560, maxHeight: 'calc(100vh - 140px)',
          background: 'var(--navy-2)', border: '1px solid var(--border)', borderRadius: 20,
          boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
          opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div className="px-5 py-[18px] flex items-center gap-3 shrink-0"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--navy-2)' }}>
          <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-base font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', fontFamily: 'var(--font-playfair)', color: 'var(--navy)' }}>
            P
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Pension Advisor</div>
            <div className="text-[11.5px] flex items-center gap-[5px]" style={{ color: 'var(--green)' }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--green)' }} />
              Online · knows your profile
            </div>
          </div>
          <button className="text-lg px-2 py-1 rounded-md cursor-pointer transition-all"
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)' }}
            onClick={handleOpen}>✕</button>
        </div>

        {/* Body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'items-start'}`}>
              {msg.role === 'bot' && (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                  style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)', fontFamily: 'var(--font-playfair)', color: 'var(--gold)' }}>
                  P
                </div>
              )}
              <div className="max-w-[85%] px-3.5 py-2.5 text-[12.5px] leading-relaxed"
                style={{
                  borderRadius: msg.role === 'bot' ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
                  background: msg.role === 'bot' ? 'var(--navy-3)' : 'var(--gold)',
                  border: msg.role === 'bot' ? '1px solid var(--border)' : 'none',
                  color: msg.role === 'bot' ? 'var(--text-muted)' : '#000',
                  fontWeight: msg.role === 'user' ? 450 : 400,
                }}>
                <span dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }} />
                {msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {msg.suggestions.map((s) => (
                      <button key={s} onClick={() => sendMessage(s)}
                        className="text-[11.5px] font-medium px-3 py-[5px] rounded-[20px] cursor-pointer transition-all"
                        style={{
                          background: 'var(--navy-2)', border: '1px solid var(--gold-border)',
                          color: 'var(--gold-light)', fontFamily: 'var(--font-sans)',
                        }}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2 items-start">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)', fontFamily: 'var(--font-playfair)', color: 'var(--gold)' }}>
                P
              </div>
              <div className="px-3.5 py-2.5 rounded-[14px] rounded-bl-[4px]"
                style={{ background: 'var(--navy-3)', border: '1px solid var(--border)' }}>
                <div className="flex gap-1 py-1">
                  {[0, 1, 2].map((j) => (
                    <span key={j} className="w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--text-dim)', animation: `chatBounce 1.4s infinite ${j * 0.2}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="text-[10px] text-center px-4 pb-2.5 leading-snug" style={{ color: 'var(--text-dim)' }}>
          AI-generated pension information, not financial advice.
        </div>

        {/* Input */}
        <div className="px-4 py-3 flex gap-2 items-center shrink-0"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--navy-2)' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputValue); } }}
            placeholder="Ask about your pension..."
            className="flex-1 rounded-xl px-3.5 py-2.5 text-[13px] outline-none transition-all"
            style={{
              background: 'var(--navy-3)', border: '1px solid var(--border)',
              color: 'var(--text)', fontFamily: 'var(--font-sans)',
            }}
          />
          <button onClick={() => sendMessage(inputValue)}
            className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center cursor-pointer transition-all text-[15px] shrink-0"
            style={{ background: 'var(--gold)', border: 'none' }}>
            →
          </button>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={handleOpen}
        className="fixed z-[90] w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 text-[22px]"
        style={{
          bottom: 24, right: 24, border: 'none',
          background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
          boxShadow: '0 4px 20px rgba(201,168,76,0.4)',
        }}
      >
        <span style={{ transition: 'transform 0.3s', transform: isOpen ? 'rotate(45deg)' : 'none', display: 'flex' }}>💬</span>
        {badgeVisible && (
          <div className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: 'var(--red)', color: '#fff', border: '2px solid var(--navy)' }}>
            1
          </div>
        )}
      </button>
    </>
  );
}
