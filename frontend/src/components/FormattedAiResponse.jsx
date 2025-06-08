import React from 'react';

const applyInlineFormatting = (text) => {
  let html = text;

  // Escape HTML special characters to prevent XSS if not already handled
  // For simplicity, assuming AI output is generally safe or will be sanitized if necessary.
  // html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Code: ``code`` or `code` - process longer `` first
  html = html.replace(/``(.*?)``/gs, '<code class="bg-slate-700 text-pink-400 px-1 sm:px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono mx-0.5">$1</code>'); // Responsive padding and text
  html = html.replace(/`(.*?)`/gs, '<code class="bg-slate-700 text-pink-400 px-1 sm:px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono mx-0.5">$1</code>'); // Responsive padding and text

  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>');
  
  return html;
};

const FormattedAiResponse = ({ content }) => {
  if (!content) return null;

  const elements = [];
  let currentList = null;
  let currentParagraphLines = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const paragraphText = currentParagraphLines.join('\n'); // Re-join lines of a paragraph
      elements.push(
        <p 
          key={`p-${elements.length}`} 
          className="my-2 sm:my-3 text-slate-300 leading-relaxed text-xs sm:text-sm" /* Responsive margin and text */
          dangerouslySetInnerHTML={{ __html: applyInlineFormatting(paragraphText) }} 
        />
      );
      currentParagraphLines = [];
    }
  };

  const flushList = () => {
    if (currentList) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-5 sm:pl-7 my-2 sm:my-3 space-y-1 sm:space-y-1.5 text-slate-300 text-xs sm:text-sm"> {/* Responsive padding, margin, spacing and text */}
          {currentList.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      );
      currentList = null;
    }
  };

  const lines = content.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      flushParagraph(); // End current paragraph before starting a list
      if (!currentList) {
        currentList = { items: [] };
      }
      currentList.items.push(applyInlineFormatting(trimmedLine.substring(2)));
    } else if (trimmedLine === '---') {
      flushParagraph();
      flushList();
      elements.push(<hr key={`hr-${elements.length}`} className="my-4 sm:my-6 border-slate-700" />); {/* Responsive margin */}
    } else {
      flushList(); // End current list if we encounter a non-list item
      if (trimmedLine === '') { // An empty line signifies a paragraph break
        flushParagraph(); 
        // Add an empty paragraph for spacing if desired, or just break
        // For now, consecutive empty lines will result in one paragraph break.
      } else {
        currentParagraphLines.push(line); // Add line to current paragraph buffer
      }
    }
  }

  flushParagraph(); // Flush any remaining paragraph
  flushList(); // Flush any remaining list

  return <div className="text-left whitespace-pre-line text-xs sm:text-sm">{elements}</div>; /* Responsive base text size */
};

export default FormattedAiResponse;
