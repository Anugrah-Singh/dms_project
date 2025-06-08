import React, { useState, useEffect } from 'react';
import { gcd, isPrimeInteractive } from '../utils';

// BBS Keystream Generation (simplified for demo)
const generateBbsKeystream = (p, q, seed, length) => {
  if (!isPrimeInteractive(p) || p % 4 !== 3 || !isPrimeInteractive(q) || q % 4 !== 3 || p === q) {
    throw new Error("Invalid p or q for BBS.");
  }
  const n = p * q;
  if (gcd(seed, n) !== 1 || seed <= 1 || seed >= n) {
    throw new Error("Invalid seed for BBS.");
  }

  let current_x = seed;
  const keystream = [];
  for (let i = 0; i < length; i++) {
    current_x = (current_x * current_x) % n;
    keystream.push(current_x % 2); // LSB
  }
  return keystream;
};

// XOR operation for stream cipher
const applyXorCipher = (text, keystreamBits) => {
  const textBytes = new TextEncoder().encode(text);
  let encryptedBytes = new Uint8Array(textBytes.length);
  let keystreamIndex = 0;

  for (let i = 0; i < textBytes.length; i++) {
    let byteKey = 0;
    for (let j = 0; j < 8; j++) { // Construct a byte from keystream bits
      if (keystreamIndex < keystreamBits.length) {
        byteKey = (byteKey << 1) | keystreamBits[keystreamIndex++];
      } else {
        // If keystream is shorter than message, wrap around (not cryptographically sound, but for demo)
        keystreamIndex = 0; 
        byteKey = (byteKey << 1) | keystreamBits[keystreamIndex++];
      }
    }
    encryptedBytes[i] = textBytes[i] ^ byteKey;
  }
  return encryptedBytes;
};

const CryptoDemo = () => {
  const [message, setMessage] = useState('Hello World! This is a test of the stream cipher.');
  const [p, setP] = useState(11); // BBS p
  const [q, setQ] = useState(19); // BBS q
  const [seed, setSeed] = useState(3); // BBS seed
  
  const [keystream, setKeystream] = useState([]);
  const [encryptedMessageHex, setEncryptedMessageHex] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [error, setError] = useState('');

  const handleGenerateAndCipher = () => {
    setError('');
    setKeystream([]);
    setEncryptedMessageHex('');
    setDecryptedMessage('');

    if (!message) {
      setError("Please enter a message to encrypt.");
      return;
    }

    try {
      const messageByteLength = new TextEncoder().encode(message).length;
      const requiredKeystreamBitLength = messageByteLength * 8;
      
      const bbs_p = parseInt(p);
      const bbs_q = parseInt(q);
      const bbs_seed = parseInt(seed);

      if (isNaN(bbs_p) || isNaN(bbs_q) || isNaN(bbs_seed)) {
        setError("BBS parameters (p, q, seed) must be valid numbers.");
        return;
      }
      
      const ks = generateBbsKeystream(bbs_p, bbs_q, bbs_seed, requiredKeystreamBitLength);
      setKeystream(ks);

      const encryptedBytes = applyXorCipher(message, ks);
      const hexString = Array.from(encryptedBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      setEncryptedMessageHex(hexString);

      // For demonstration, decrypt immediately
      const decryptedBytes = applyXorCipher(new TextDecoder().decode(encryptedBytes), ks);
      setDecryptedMessage(new TextDecoder().decode(decryptedBytes));

    } catch (err) {
      console.error("Cipher Error:", err);
      setError(err.message || "Failed to perform cipher operation.");
    }
  };

  // Auto-run on initial load or when BBS params change and message exists
  useEffect(() => {
    if (message && p && q && seed) {
        handleGenerateAndCipher();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, q, seed]); // Removed message from deps to avoid re-ciphering on every message keystroke initially

  return (
    <div className="w-full bg-slate-800 text-white rounded-xl shadow-2xl overflow-hidden p-4 sm:p-6 md:p-8 transition-all duration-300 ease-in-out"> {/* Responsive padding */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-teal-400 mb-6 sm:mb-8 md:mb-10">Simple Stream Cipher Demo (using BBS)</h2> {/* Responsive text and margin */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8"> {/* Responsive gap and margin */}
        {/* Column 1: Message Input */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6 bg-slate-700/50 p-4 sm:p-6 rounded-lg shadow-lg"> {/* Responsive padding and spacing */}
          <div>
            <label htmlFor="message" className="block text-base sm:text-lg font-semibold text-slate-200 mb-1.5 sm:mb-2">Enter Message:</label> {/* Responsive text and margin */}
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              placeholder="Type your secret message here..."
              className="w-full p-2.5 sm:p-3 bg-slate-900 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm placeholder-slate-500 text-slate-100 transition-all" /* Responsive padding and text */
            />
          </div>
           <button
            onClick={handleGenerateAndCipher}
            className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 text-sm sm:text-base" /* Responsive padding and text */
          >
            Encrypt / Decrypt
          </button>
        </div>

        {/* Column 2: BBS Parameters */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6 bg-slate-700/50 p-4 sm:p-6 rounded-lg shadow-lg"> {/* Responsive padding and spacing */}
          <h3 className="text-base sm:text-lg font-semibold text-slate-200 mb-1 border-b border-slate-600 pb-1.5 sm:pb-2">BBS Parameters:</h3> {/* Responsive text and padding/margin */}
          <div>
            <label htmlFor="bbs_p" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">Prime (p): <span className="text-xs text-slate-400">(≡ 3 mod 4)</span></label> {/* Responsive text */}
            <input
              type="number"
              id="bbs_p"
              value={p}
              onChange={(e) => setP(parseInt(e.target.value) || 0)}
              className="mt-1 block w-full px-2.5 py-2 sm:px-3 sm:py-2.5 bg-slate-900 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm placeholder-slate-500 transition-all" /* Responsive padding and text */
            />
          </div>
          <div>
            <label htmlFor="bbs_q" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">Prime (q): <span className="text-xs text-slate-400">(≡ 3 mod 4, p ≠ q)</span></label> {/* Responsive text */}
            <input
              type="number"
              id="bbs_q"
              value={q}
              onChange={(e) => setQ(parseInt(e.target.value) || 0)}
              className="mt-1 block w-full px-2.5 py-2 sm:px-3 sm:py-2.5 bg-slate-900 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm placeholder-slate-500 transition-all" /* Responsive padding and text */
            />
          </div>
          <div>
            <label htmlFor="bbs_s" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">Seed (s): <span className="text-xs text-slate-400">(coprime to n)</span></label> {/* Responsive text */}
            <input
              type="number"
              id="bbs_s"
              value={seed}
              onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
              className="mt-1 block w-full px-2.5 py-2 sm:px-3 sm:py-2.5 bg-slate-900 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm placeholder-slate-500 transition-all" /* Responsive padding and text */
            />
          </div>
        </div>
        
        {/* Column 3: Keystream Display */}
        <div className="lg:col-span-1 space-y-3 sm:space-y-4 bg-slate-700/50 p-4 sm:p-6 rounded-lg shadow-lg"> {/* Responsive padding and spacing */}
            <h3 className="text-base sm:text-lg font-semibold text-slate-200">Generated Keystream (BBS):</h3> {/* Responsive text */}
            <div className="p-2.5 sm:p-3 bg-slate-900 rounded-lg shadow-inner h-32 sm:h-40 overflow-y-auto resize-y"> {/* Responsive padding and height */}
              <pre className="text-xs text-lime-400 break-all whitespace-pre-wrap">{keystream.join('') || 'Press button to generate...'}</pre>
            </div>
            <p className="text-xs text-slate-400">
                Note: Keystream length is determined by message length. For demonstration, it wraps if shorter (not secure for real use).
            </p>
        </div>
      </div>

      {error && (
        <div className="my-4 sm:my-6 p-3 sm:p-4 bg-red-900/70 border border-red-700 text-red-200 rounded-lg shadow-md flex items-start space-x-2 sm:space-x-3"> {/* Responsive margin, padding and spacing */}
            <div className="py-1">
                <svg className="fill-current h-5 w-5 sm:h-6 sm:w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM11.414 10l2.829-2.828a1 1 0 1 0-1.414-1.414L10 8.586 7.172 5.757a1 1 0 0 0-1.414 1.414L8.586 10l-2.828 2.828a1 1 0 1 0 1.414 1.414L10 11.414l2.828 2.828a1 1 0 0 0 1.414-1.414L11.414 10z"/></svg> {/* Responsive icon size */}
            </div>
            <div>
                <p className="font-semibold text-red-100 text-sm sm:text-base">Operation Error</p> {/* Responsive text */}
                <p className="text-xs sm:text-sm text-red-200">{error}</p> {/* Responsive text */}
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8"> {/* Responsive gap and margin */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-2 sm:mb-3">Encrypted Message (Hex):</h3> {/* Responsive text and margin */}
          <div className="p-3 sm:p-4 bg-slate-900 rounded-lg shadow-inner min-h-[80px] sm:min-h-[100px] h-auto max-h-48 sm:max-h-60 overflow-y-auto resize-y"> {/* Responsive padding and height */}
            <pre className="text-xs sm:text-sm text-orange-400 break-all whitespace-pre-wrap">{encryptedMessageHex || '...'}</pre> {/* Responsive text */}
          </div>
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-2 sm:mb-3">Decrypted Message:</h3> {/* Responsive text and margin */}
          <div className="p-3 sm:p-4 bg-slate-900 rounded-lg shadow-inner min-h-[80px] sm:min-h-[100px] h-auto max-h-48 sm:max-h-60 overflow-y-auto resize-y"> {/* Responsive padding and height */}
            <pre className="text-xs sm:text-sm text-green-400 break-all whitespace-pre-wrap">{decryptedMessage || '...'}</pre> {/* Responsive text */}
          </div>
        </div>
      </div>
      
      <div className="mt-8 sm:mt-10 p-4 bg-slate-700/40 rounded-lg text-center">
        <p className="text-sm sm:text-base text-slate-400">
          This demo illustrates a basic stream cipher. In real cryptographic applications, PRNGs like BBS would need to meet much stricter security requirements, and cipher implementations would be more robust.
        </p>
      </div>
    </div>
  );
};

export default CryptoDemo;
