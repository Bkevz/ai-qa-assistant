import React, { useState, useRef, useEffect, useReducer } from 'react';
import QueryForm from '../components/QueryForm';
import ResponseDisplay from '../components/ResponseDisplay';
import DarkModeToggle from '../components/DarkModeToggle';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; id: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('dark-mode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      // Some messages you can see in console but not in UI, this helps diagnose why
      console.log('Saving messages to localStorage, count:', messages.length);
      console.table(messages.map(m => ({ role: m.role, id: m.id, contentLength: m.content.length })));
      localStorage.setItem('chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Ensure all messages have an id (for backward compatibility)
        const messagesWithIds = parsed.map((msg: any) => ({
          ...msg,
          id: msg.id || Date.now().toString() + Math.random().toString(36).substring(2, 9)
        }));
        setMessages(messagesWithIds);
      } catch (e) {
        console.error('Failed to parse saved messages', e);
      }
    }
  }, []);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Force a complete UI refresh to fix rendering issues
const forceUpdate = useReducer((x) => x + 1, 0)[1];

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('dark-mode', newDarkMode.toString());
  };

const sendMessage = async () => {
    if (!question.trim()) return;
    const content = question.trim();
    const msgId = Date.now().toString();
    setMessages(prev => [...prev, { role: 'user', content, id: msgId }]);
    setQuestion('');
    setLoading(true);
    setCurrentStreamingMessage('');
    
    try {
      // Close any existing EventSource
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      
      // Create new EventSource for SSE connection
        // Create the EventSource with a direct POST request at the query endpoint
        const eventSource = new EventSource(`${baseUrl}/api/query/stream?question=${encodeURIComponent(content)}`);
        eventSourceRef.current = eventSource;
        
        console.log('Created EventSource at:', `${baseUrl}/api/query/stream?question=${encodeURIComponent(content)}`);
      
      // Create a variable to accumulate message outside React state
      let fullMessage = '';
      
      eventSource.onmessage = (event) => {
        console.log('Received chunk:', event.data);
        fullMessage += event.data; // Accumulate in local variable first
        setCurrentStreamingMessage(fullMessage); // Update state with complete message so far
      };
      
      eventSource.onerror = () => {
        console.log('SSE Connection closed');
        eventSource.close();
        eventSourceRef.current = null;
        setLoading(false);
        
        // Add the complete message to the chat history
        console.log('Connection closed, fullMessage:', fullMessage);
        
        // Don't rely on React state, use our local accumulated message
        if (fullMessage.trim()) {
          const assistantMsgId = Date.now().toString();
          console.log('Adding message to history with ID:', assistantMsgId);
          
          // Use the local accumulated message
          setMessages(prev => {
            const newMessages = [...prev, { role: 'assistant' as const, content: fullMessage, id: assistantMsgId }];
            console.log('New messages state:', newMessages);
            return newMessages;
          });
          
          // Clear streaming message
          setCurrentStreamingMessage('');
          
          // Force re-render of component
          forceUpdate();
        } else {
          console.error('No message content accumulated');
          setMessages(prev => [
            ...prev, 
            { role: 'assistant' as const, content: 'Sorry, there was an error getting a response.', id: Date.now().toString() }
          ]);
        }
      };
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to fetch answer.', id: Date.now().toString() }]);
      setLoading(false);
    }
  };

  return (
    <div className={`h-screen flex items-center justify-center p-4 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`flex flex-col w-full max-w-3xl h-full rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`flex justify-between items-center px-6 py-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
          <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Q&A Assistant</h1>
          <div className="flex items-center space-x-2">
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <button
              onClick={() => {
                localStorage.removeItem('chat-history');
                setMessages([]);
              }}
              className={`text-xs underline ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Clear history
            </button>
          </div>
        </div>
        
        <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {/* Debugging message count */}
          <div className="text-xs text-gray-400 mb-2">{messages.length} messages in history | {currentStreamingMessage ? 'Streaming active' : 'Not streaming'}</div>
          
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`${msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : darkMode 
                      ? 'bg-gray-700 text-gray-100 border-gray-600' 
                      : 'bg-white text-gray-800 border-gray-100'} 
                    px-4 py-3 rounded-lg max-w-[80%] shadow border`}
                >
                  <div className="whitespace-pre-wrap">{msg.content || '(Empty message)'}</div>
                </div>
              </div>
            ))
          ) : (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No message history</div>
          )}
          
          {currentStreamingMessage && loading && (
            <div className="flex justify-start">
              <div className={`px-4 py-3 rounded-lg max-w-[80%] shadow border ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-800 border-gray-100'}`}>
                <div className="whitespace-pre-wrap">
                  {currentStreamingMessage}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <QueryForm 
          question={question} 
          setQuestion={setQuestion} 
          sendMessage={sendMessage} 
          loading={loading} 
        />
      </div>
    </div>
  );
}
