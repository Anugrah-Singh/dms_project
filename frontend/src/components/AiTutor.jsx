import React, { useState } from 'react';
import FormattedAiResponse from './FormattedAiResponse'; // Import the new component

const AiTutor = ({ prngType, currentParams, currentOutput }) => {
  const [query, setQuery] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a question.');
      return;
    }
    setIsLoading(true);
    setError('');
    setExplanation(''); // Clear previous explanation

    try {
      const response = await fetch('http://localhost:5001/api/ai/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any headers needed for streaming if your backend requires them
        },
        body: JSON.stringify({
          query: query,
          prng_type: prngType,
          params: currentParams,
          output: currentOutput,
          stream: true // Indicate to the backend that we want a streaming response
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response from server.' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            // Assuming the backend sends JSON objects or plain text chunks
            // If backend sends Server-Sent Events (SSE), parsing will be different
            setExplanation((prev) => prev + chunk);
          }
        }
      } else {
        // Fallback for non-streaming or if body is null
        const data = await response.json();
        setExplanation(data.explanation);
      }

    } catch (err) {
      setError(err.message || 'Failed to fetch explanation.');
      console.error("Error fetching AI explanation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-slate-800 rounded-lg shadow-xl"> {/* Responsive margin and padding */}
      <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-sky-400">Ask the AI Tutor</h3> {/* Responsive text and margin */}
      <form onSubmit={handleSubmitQuery} className="space-y-3 sm:space-y-4"> {/* Responsive spacing */}
        <div>
          <label htmlFor="aiQuery" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1"> {/* Responsive text */}
            Your Question:
          </label>
          <textarea
            id="aiQuery"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask something about ${prngType.toUpperCase()} or its output...`}
            rows="3"
            className="w-full p-2 sm:p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-slate-50 placeholder-slate-400 text-xs sm:text-sm" /* Responsive padding and text */
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 sm:px-6 sm:py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 text-xs sm:text-sm" /* Responsive padding and text */
        >
          {isLoading ? 'Thinking...' : 'Ask AI'}
        </button>
      </form>

      {error && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-700 border border-red-900 text-red-100 rounded-md text-xs sm:text-sm"> {/* Responsive margin, padding and text */}
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {explanation && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-700 border border-slate-600 rounded-md shadow"> {/* Responsive margin and padding */}
          <h4 className="text-lg sm:text-xl font-semibold mb-2 text-sky-500">AI Explanation:</h4> {/* Responsive text and margin */}
          <FormattedAiResponse content={explanation} />
        </div>
      )}
    </div>
  );
};

export default AiTutor;
