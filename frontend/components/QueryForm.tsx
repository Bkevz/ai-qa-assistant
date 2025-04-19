import React from 'react';

interface QueryFormProps {
  question: string;
  setQuestion: (question: string) => void;
  sendMessage: () => void;
  loading: boolean;
}

const QueryForm: React.FC<QueryFormProps> = ({ question, setQuestion, sendMessage, loading }) => {
  return (
    <div className="px-6 py-4 bg-white border-t flex space-x-2">
      <textarea
        rows={1}
        value={question}
        onChange={e => setQuestion(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
        className="flex-1 resize-none border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your message..."
        disabled={loading}
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md flex items-center justify-center"
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        ) : (
          'Send'
        )}
      </button>
    </div>
  );
};

export default QueryForm;
