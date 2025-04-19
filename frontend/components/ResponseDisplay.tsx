import React, { useRef, useEffect, useState } from 'react';
import TypingAnimation from './TypingAnimation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

interface ResponseDisplayProps {
  messages: Message[];
  currentStreamingMessage: string;
  loading: boolean;
  clearHistory: () => void;
  darkMode?: boolean;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ 
  messages, 
  currentStreamingMessage, 
  loading, 
  clearHistory,
  darkMode = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStreamingMessage]);

  return (
    <>
      <header className="px-6 py-4 bg-white border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold">AI Q&A Assistant</h1>
        <button
          onClick={clearHistory}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Clear history
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {/* Debugging message count */}
        <div className="text-xs text-gray-400 mb-2">
          {messages.length} messages in history | {currentStreamingMessage ? 'Streaming active' : 'Not streaming'}
        </div>
        
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`${msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-800 shadow border border-gray-100'} 
                  px-4 py-3 rounded-lg max-w-[80%]`}
              >
                {msg.role === 'assistant' ? (
                  <TypingAnimation text={msg.content || '(Empty message)'} speed={15} />
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content || '(Empty message)'}</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-8">No message history</div>
        )}
        
        {currentStreamingMessage && loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 shadow border border-gray-100 px-4 py-3 rounded-lg max-w-[80%]">
              <TypingAnimation text={currentStreamingMessage} speed={10} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
};

export default ResponseDisplay;
