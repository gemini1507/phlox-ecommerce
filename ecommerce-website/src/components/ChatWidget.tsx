import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const messages = [
  { from: 'agent', text: 'Hi there! 👋 How can I help you today?' },
  { from: 'agent', text: 'Feel free to ask about products, shipping, or anything else!' },
];

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState(messages);

  const send = () => {
    if (!input.trim()) return;
    setChat(prev => [
      ...prev,
      { from: 'user', text: input },
      { from: 'agent', text: 'Thanks for reaching out! Our team will respond shortly. 😊' },
    ]);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden border border-gray-100 animate-fade-up">
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Customer Support</p>
                <p className="text-white/70 text-xs">Online • Replies instantly</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64 bg-gray-50">
            {chat.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${m.from === 'user'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-white text-gray-700 rounded-bl-none shadow-sm border border-gray-100'
                  }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              type="text"
              placeholder="Type a message..."
              className="flex-1 outline-none text-sm border border-gray-200 rounded-full px-3 py-2 focus:border-primary transition-colors"
            />
            <button
              onClick={send}
              className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-all hover:scale-110 active:scale-95 relative"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
      </button>
    </div>
  );
};

export default ChatWidget;
