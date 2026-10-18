import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Video,
  Phone,
  Circle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Conversation, Message } from '../types';

interface ChatSectionProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  onSelectConversation: (conv: Conversation) => void;
  onSendMessage: (text: string) => void;
  onStartVideoCall: (contactName: string) => void;
  onStartVoiceCall: (contactName: string) => void;
  language?: string;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  conversations,
  activeConversation,
  messages,
  onSelectConversation,
  onSendMessage,
  onStartVideoCall,
  onStartVoiceCall,
  language = 'English',
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isSwahili = language === 'Swahili';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <section id="messages" className="py-12 max-w-6xl mx-auto px-4 border-t border-emerald-950/10 dark:border-emerald-500/15">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-emerald-50 tracking-tight font-editorial">
          {isSwahili ? 'Ujumbe na Mazungumzo' : 'Messages & Chat'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1">
          {isSwahili
            ? 'Mazungumzo ya faragha, mauzo na mawasiliano ya jamii.'
            : 'Private conversations, seller chats and community messaging.'}
        </p>
      </div>

      <div className="card-neon-gold rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Subtle top gold-neon decorative rim */}
        <div className="h-[2px] w-full md:col-span-12 bg-gradient-to-r from-emerald-500/20 via-[#ffd700]/70 to-emerald-500/20" />

        {/* Left Contacts List */}
        <div className="md:col-span-5 lg:col-span-4 border-r border-emerald-950/10 dark:border-emerald-500/15 flex flex-col">
          <div className="p-4 border-b border-emerald-950/10 dark:border-emerald-500/15 bg-slate-50/50 dark:bg-emerald-950/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-400/60">
              {isSwahili ? 'Mazungumzo Yanayoendelea' : 'Active Conversations'}
            </h3>
          </div>

          <div className="divide-y divide-emerald-950/10 dark:divide-emerald-500/15 overflow-y-auto max-h-[500px]">
            {conversations.map((conv) => {
              const isActive = activeConversation?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv)}
                  className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                    isActive
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/70'
                      : 'hover:bg-slate-50 dark:hover:bg-emerald-900/30'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.avatar || '/src/assets/images/boniphace_avatar_1791315268492.jpg'}
                      alt={conv.contactName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/20"
                    />
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0e1d15] rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50 truncate">
                        {conv.contactName}
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        {conv.lastMessageTime}
                      </span>
                    </div>
                    <span className="block text-[11px] text-slate-500 dark:text-emerald-300/70 truncate mt-0.5">
                      {conv.lastMessage}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Window */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between bg-slate-50/30 dark:bg-[#07120d]/50">
          {activeConversation ? (
            <>
              {/* Chat Topbar */}
              <div className="p-4 px-6 border-b border-emerald-950/10 dark:border-emerald-500/15 flex items-center justify-between bg-white dark:bg-[#0e1d15]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activeConversation.avatar || '/src/assets/images/boniphace_avatar_1791315268492.jpg'}
                      alt={activeConversation.contactName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
                    />
                    {activeConversation.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#0e1d15] rounded-full" />
                    )}
                  </div>
                  <div>
                    <strong className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-50">
                      {activeConversation.contactName}
                    </strong>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {activeConversation.isOnline
                        ? isSwahili ? 'Yuko mtandaoni' : 'Online now'
                        : isSwahili ? 'Nje ya mtandao' : 'Offline'}{' '}
                      · {activeConversation.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onStartVideoCall(activeConversation.contactName)}
                    className="p-2.5 rounded-xl border border-emerald-950/10 dark:border-emerald-500/20 text-slate-600 dark:text-emerald-200 hover:bg-slate-50 dark:hover:bg-emerald-900/40 transition-colors"
                    title={isSwahili ? 'Piga Simu ya Video' : 'Start Video Call'}
                  >
                    <Video className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onStartVoiceCall(activeConversation.contactName)}
                    className="p-2.5 rounded-xl border border-emerald-950/10 dark:border-emerald-500/20 text-slate-600 dark:text-emerald-200 hover:bg-slate-50 dark:hover:bg-emerald-900/40 transition-colors"
                    title={isSwahili ? 'Piga Simu ya Sauti' : 'Start Voice Call'}
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-3 min-h-[360px] max-h-[440px]">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                        m.isMe
                          ? 'bg-emerald-600 text-white rounded-br-xs'
                          : 'bg-white dark:bg-[#0e1d15] text-slate-800 dark:text-emerald-100 border border-emerald-950/10 dark:border-emerald-500/20 rounded-bl-xs'
                      }`}
                    >
                      <p>{m.text}</p>
                      <span
                        className={`text-[9px] block text-right mt-1 ${
                          m.isMe ? 'text-emerald-200' : 'text-slate-400'
                        }`}
                      >
                        {m.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer - Perfectly fitted into card */}
              <div className="p-3 sm:p-4 bg-white/95 dark:bg-[#0e1d15]/95 border-t border-emerald-950/10 dark:border-emerald-500/15">
                <form
                  onSubmit={handleSend}
                  className="relative flex items-center bg-slate-100/90 dark:bg-emerald-950/50 border border-emerald-950/15 dark:border-emerald-500/25 rounded-2xl p-1.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:shadow-[0_0_15px_-3px_rgba(5,120,75,0.25)] transition-all"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      isSwahili
                        ? `Andika ujumbe kwa ${activeConversation.contactName}...`
                        : `Write a message to ${activeConversation.contactName}...`
                    }
                    className="flex-1 min-w-0 bg-transparent px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-emerald-50 placeholder-slate-400 dark:placeholder-emerald-400/50 focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="h-9 sm:h-10 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 shadow-sm border border-emerald-500/30 active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="whitespace-nowrap">{isSwahili ? 'Tuma' : 'Send'}</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 mb-3 text-emerald-600/40" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-emerald-200">
                {isSwahili ? 'Chagua mazungumzo' : 'Select a conversation'}
              </h4>
              <p className="text-xs mt-1">
                {isSwahili
                  ? 'Chagua mtu kutoka kwenye orodha kushoto kuanza mazungumzo.'
                  : 'Choose a contact from the left list to start messaging.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
