import React, { useState } from 'react';
import { gcd, isPrimeInteractive } from '../utils'; // Import from utils

const EducationalModules = () => {
  // State for LCG Interactive Exercise
  const [lcgParams, setLcgParams] = useState({
    seed: '1',
    multiplier: '5',
    increment: '3',
    modulus: '16',
    count: '10',
  });
  const [lcgInteractiveSequence, setLcgInteractiveSequence] = useState([]);
  const [lcgInteractiveError, setLcgInteractiveError] = useState('');

  // State for BBS Interactive Exercise
  const [bbsParams, setBbsParams] = useState({
    p: '7', // Must be prime, p % 4 === 3
    q: '11', // Must be prime, q % 4 === 3, p !== q
    seed: '3', // gcd(seed, p*q) === 1
    count: '20',
  });
  const [bbsInteractiveSequence, setBbsInteractiveSequence] = useState([]);
  const [bbsInteractiveError, setBbsInteractiveError] = useState('');

  const handleLcgParamChange = (e) => {
    const { name, value } = e.target;
    setLcgParams(prevParams => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const generateLcgInteractiveSequence = () => {
    setLcgInteractiveError('');
    setLcgInteractiveSequence([]);
    const seed = parseInt(lcgParams.seed);
    const multiplier = parseInt(lcgParams.multiplier);
    const increment = parseInt(lcgParams.increment);
    const modulus = parseInt(lcgParams.modulus);
    const count = parseInt(lcgParams.count);

    if (isNaN(seed) || isNaN(multiplier) || isNaN(increment) || isNaN(modulus) || isNaN(count)) {
      setLcgInteractiveError('All parameters must be valid integers.');
      return;
    }
    if (modulus === 0) {
      setLcgInteractiveError('Modulus (m) cannot be zero.');
      return;
    }
    if (count <= 0 || count > 50) { // Limiting count for this small exercise
      setLcgInteractiveError('Count must be between 1 and 50.');
      return;
    }

    let current_x = seed;
    const sequence = [];
    for (let i = 0; i < count; i++) {
      sequence.push(current_x);
      current_x = (multiplier * current_x + increment) % modulus;
    }
    setLcgInteractiveSequence(sequence);
  };

  const handleBbsParamChange = (e) => {
    const { name, value } = e.target;
    setBbsParams(prevParams => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const generateBbsInteractiveSequence = () => {
    setBbsInteractiveError('');
    setBbsInteractiveSequence([]);

    const p = parseInt(bbsParams.p);
    const q = parseInt(bbsParams.q);
    const seed = parseInt(bbsParams.seed);
    const count = parseInt(bbsParams.count);

    if (isNaN(p) || isNaN(q) || isNaN(seed) || isNaN(count)) {
      setBbsInteractiveError('All parameters must be valid integers.');
      return;
    }
    if (!isPrimeInteractive(p) || p % 4 !== 3) {
      setBbsInteractiveError('p must be a prime number congruent to 3 (mod 4).');
      return;
    }
    if (!isPrimeInteractive(q) || q % 4 !== 3) {
      setBbsInteractiveError('q must be a prime number congruent to 3 (mod 4).');
      return;
    }
    if (p === q) {
      setBbsInteractiveError('p and q must be different prime numbers.');
      return;
    }
    const n = p * q;
    if (gcd(seed, n) !== 1 || seed <= 1 || seed >= n) {
      setBbsInteractiveError(`Seed must be between 1 and ${n-1}, and coprime to n (${n}).`);
      return;
    }
    if (count <= 0 || count > 100) { // Limiting count for this small exercise
      setBbsInteractiveError('Count must be between 1 and 100.');
      return;
    }

    let current_x = seed_val; // Use validated seed_val
    const bitSequence = [];
    for (let i = 0; i < count; i++) {
      current_x = (current_x * current_x) % n_val; // Use validated n_val
      bitSequence.push(current_x % 2);
    }
    setBbsInteractiveSequence(bitSequence);
  };


  const lcgTheory = [
    {
      heading: "What is a Linear Congruential Generator?",
      content: "A Linear Congruential Generator (LCG) is one of the oldest and simplest pseudo-random number generator algorithms. It generates a sequence of numbers based on a linear equation.",
      formula: "Xₙ₊₁ = (a * Xₙ + c) mod m",
      list: [
        "Xₙ is the current number in the sequence.",
        "X₀ is the seed (initial value).",
        "a is the multiplier.",
        "c is the increment.",
        "m is the modulus."
      ]
    },
    {
      heading: "How LCG Works",
      content: "The LCG uses the recurrence relation Xₙ₊₁ = (a * Xₙ + c) mod m to generate a sequence of pseudo-random numbers. The quality of the generated sequence depends on the choice of parameters a, c, m, and the seed.",
    },
    {
      heading: "LCG Parameters",
      content: "Choosing the right parameters for the LCG is crucial. The multiplier a and the increment c should be chosen carefully to ensure a long period and good statistical properties.",
    },
    {
      heading: "Period of LCG",
      content: "The period of an LCG is the length of the sequence before it starts repeating. A good LCG should have a long period, ideally equal to the modulus m.",
    },
    {
      heading: "Limitations of LCG",
      content: "LCGs are simple and fast, but they have limitations. The quality of randomness is not very high, and the period can be short if the parameters are not chosen properly.",
    },
  ];

  const bbsTheory = [
    {
      heading: "What is the Blum Blum Shub Generator?",
      content: "The Blum Blum Shub (BBS) generator is a cryptographically secure pseudo-random number generator. It is based on the difficulty of factoring the product of two large prime numbers.",
      formula: "xᵢ₊₁ = (xᵢ²) mod n",
      list: [
        "n = p * q, where p and q are large prime numbers, both congruent to 3 (mod 4).",
        "The seed x₀ is an integer co-prime to n (i.e., gcd(x₀, n) = 1).",
        "The output is typically the least significant bit (LSB) of xᵢ₊₁, or several LSBs."
      ]
    },
    {
      heading: "How BBS Works",
      content: "The BBS generator uses the recurrence relation xᵢ₊₁ = (xᵢ²) mod n to produce a sequence of bits. The security of BBS is based on the difficulty of the quadratic residuosity problem.",
    },
    {
      heading: "BBS Parameters",
      content: "For BBS, p and q should be large prime numbers congruent to 3 (mod 4). The seed must be co-prime to n and should not be too small.",
    },
    {
      heading: "Period of BBS",
      content: "The period of the BBS generator is approximately the least common multiple (LCM) of the periods of the two prime factors p and q.",
    },
    {
      heading: "Advantages of BBS",
      content: "BBS is considered secure and has good statistical properties. It is suitable for cryptographic applications where high-quality randomness is essential.",
    },
  ];

  const chiSquaredTheory = [
    {
      heading: "Understanding the Chi-Squared Test",
      content: "The Chi-Squared test is a statistical method used to determine if there is a significant difference between the expected and observed frequencies in one or more categories.",
    },
    {
      heading: "Chi-Squared Test Formula",
      content: "The formula for the Chi-Squared test is χ² = Σ((Oᵢ - Eᵢ)² / Eᵢ), where Oᵢ is the observed frequency and Eᵢ is the expected frequency.",
      formula: "χ² = Σ((Oᵢ - Eᵢ)² / Eᵢ)",
    },
    {
      heading: "Interpreting Chi-Squared Results",
      content: "A high Chi-Squared value indicates a significant difference between observed and expected values, while a low value indicates no significant difference.",
    },
    {
      heading: "Applications of Chi-Squared Test",
      content: "The Chi-Squared test is widely used in hypothesis testing, quality control, and research to determine the goodness of fit between observed data and a theoretical model.",
    },
  ];


  const renderTheorySection = (title, theoryArray, accentColor = "purple") => (
    <div className="mb-12 bg-slate-800 p-6 md:p-8 rounded-xl shadow-2xl hover:shadow-purple-500/30 transition-shadow duration-300">
      <h2 className={`text-3xl md:text-4xl font-bold text-${accentColor}-400 mb-8 text-center`}>{title}</h2>
      {theoryArray.map((item, index) => (
        <div key={index} className="mb-6 bg-slate-700/50 p-5 rounded-lg shadow-lg">
          {item.heading && <h3 className={`text-xl md:text-2xl font-semibold text-${accentColor}-300 mb-3`}>{item.heading}</h3>}
          {item.content && <p className="text-slate-300 leading-relaxed text-base md:text-lg whitespace-pre-line">{item.content}</p>}
          {item.formula && <div className="my-4 p-4 bg-slate-900 rounded-md shadow text-center"><pre className={`text-lg md:text-xl text-yellow-300 overflow-x-auto`}>{item.formula}</pre></div>}
          {item.code && <div className="my-4 p-4 bg-slate-900 rounded-md shadow"><pre className="text-sm text-lime-300 overflow-x-auto">{item.code}</pre></div>}
          {item.list && (
            <ul className="list-disc list-inside text-slate-300 mt-2 pl-4 space-y-1 text-base md:text-lg">
              {item.list.map((li, i) => <li key={i}>{li}</li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  );


  return (
    <div className="space-y-8 sm:space-y-12 px-2 sm:px-4 md:px-0"> {/* Responsive spacing and padding */}

      {/* General Introduction */}
      <section className="p-4 sm:p-6 bg-slate-800 rounded-xl shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-400 mb-4 sm:mb-6">Welcome to the PRNG Learning Center!</h2> {/* Responsive text and margin */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed text-center">
          Explore different Pseudo-Random Number Generators (PRNGs), understand their mechanics, and see how they are used in cryptography.
        </p>
      </section>

      {/* LCG Explanation and Interactive Exercise */}
      <section className="p-4 sm:p-6 bg-slate-800 rounded-xl shadow-2xl">
        <h3 className="text-xl sm:text-2xl font-semibold text-purple-400 mb-3 sm:mb-4">Linear Congruential Generator (LCG)</h3> {/* Responsive text and margin */}
        <p className="text-sm sm:text-base text-slate-300 mb-4 leading-relaxed">
          The LCG is one of the oldest and simplest PRNG algorithms. It produces a sequence of numbers based on a linear recurrence relation:
          <code className="block bg-slate-900 p-2 sm:p-3 rounded-md my-2 text-xs sm:text-sm text-lime-300 overflow-x-auto">Xn+1 = (a * Xn + c) mod m</code>
          Where: <br />
          - <code className="text-purple-300">Xn</code> is the current number in the sequence. <br />
          - <code className="text-purple-300">a</code> is the multiplier. <br />
          - <code className="text-purple-300">c</code> is the increment. <br />
          - <code className="text-purple-300">m</code> is the modulus. <br />
          - <code className="text-purple-300">X0</code> is the seed (the starting value).
        </p>
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-700 rounded-lg shadow-lg">
          <h4 className="text-lg sm:text-xl font-medium text-slate-200 mb-3">Try LCG Yourself:</h4> {/* Responsive text and margin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4"> {/* Responsive grid and gap */}
            {/* LCG Parameter Inputs */}
            {Object.entries(lcgParams).map(([key, value]) => (
              <div key={key}>
                <label htmlFor={`lcg-${key}`} className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                <input
                  type="number"
                  id={`lcg-${key}`}
                  name={key}
                  value={value}
                  onChange={handleLcgParamChange}
                  className="w-full p-2 bg-slate-900 border border-slate-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm placeholder-slate-500" /* Responsive padding and text */
                />
              </div>
            ))}
          </div>
          <button
            onClick={generateLcgInteractiveSequence}
            className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md shadow-md text-xs sm:text-sm" /* Responsive padding and text */
          >
            Generate LCG Sequence
          </button>
          {lcgInteractiveError && <p className="text-red-400 text-xs sm:text-sm mt-2">{lcgInteractiveError}</p>} {/* Responsive text */}
          {lcgInteractiveSequence.length > 0 && (
            <div className="mt-3 sm:mt-4">
              <h5 className="text-sm sm:text-base font-medium text-slate-300 mb-1">Generated Sequence:</h5> {/* Responsive text */}
              <pre className="bg-slate-900 p-2 sm:p-3 rounded-md text-xs sm:text-sm text-lime-300 overflow-x-auto">{lcgInteractiveSequence.join(', ')}</pre> {/* Responsive padding and text */}
            </div>
          )}
        </div>
      </section>

      {/* BBS Explanation and Interactive Exercise */}
      <section className="p-4 sm:p-6 bg-slate-800 rounded-xl shadow-2xl">
        <h3 className="text-xl sm:text-2xl font-semibold text-pink-400 mb-3 sm:mb-4">Blum Blum Shub (BBS)</h3> {/* Responsive text and margin */}
        <p className="text-sm sm:text-base text-slate-300 mb-4 leading-relaxed">
          BBS is a cryptographically secure PRNG. It generates a sequence of bits. The algorithm is:
          <code className="block bg-slate-900 p-2 sm:p-3 rounded-md my-2 text-xs sm:text-sm text-lime-300 overflow-x-auto">Xn+1 = (Xn^2) mod N</code>
          Where: <br />
          - <code className="text-pink-300">N = p * q</code>, where p and q are large prime numbers, both congruent to 3 (mod 4). <br />
          - <code className="text-pink-300">X0</code> is the seed, which must be coprime to N. <br />
          - The output bit is typically the least significant bit (LSB) of Xn+1.
        </p>
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-700 rounded-lg shadow-lg">
          <h4 className="text-lg sm:text-xl font-medium text-slate-200 mb-3">Try BBS Yourself:</h4> {/* Responsive text and margin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4"> {/* Responsive grid and gap */}
            {/* BBS Parameter Inputs */}
            {Object.entries(bbsParams).map(([key, value]) => (
              <div key={key}>
                <label htmlFor={`bbs-${key}`} className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                <input
                  type="number"
                  id={`bbs-${key}`}
                  name={key}
                  value={value}
                  onChange={handleBbsParamChange}
                  className="w-full p-2 bg-slate-900 border border-slate-600 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-xs sm:text-sm placeholder-slate-500" /* Responsive padding and text */
                />
              </div>
            ))}
          </div>
          <button
            onClick={generateBbsInteractiveSequence}
            className="w-full sm:w-auto px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-md shadow-md text-xs sm:text-sm" /* Responsive padding and text */
          >
            Generate BBS Bit Sequence
          </button>
          {bbsInteractiveError && <p className="text-red-400 text-xs sm:text-sm mt-2">{bbsInteractiveError}</p>} {/* Responsive text */}
          {bbsInteractiveSequence.length > 0 && (
            <div className="mt-3 sm:mt-4">
              <h5 className="text-sm sm:text-base font-medium text-slate-300 mb-1">Generated Bit Sequence:</h5> {/* Responsive text */}
              <pre className="bg-slate-900 p-2 sm:p-3 rounded-md text-xs sm:text-sm text-lime-300 overflow-x-auto whitespace-pre-wrap break-all">{bbsInteractiveSequence.join('')}</pre> {/* Responsive padding and text */}
            </div>
          )}
        </div>
      </section>
      
      {/* Cryptographic Applications */}
      <section className="p-4 sm:p-6 bg-slate-800 rounded-xl shadow-2xl">
        <h3 className="text-xl sm:text-2xl font-semibold text-teal-400 mb-3 sm:mb-4">Cryptographic Applications</h3> {/* Responsive text and margin */}
        <p className="text-sm sm:text-base text-slate-300 mb-3 leading-relaxed">
          Cryptographically Secure Pseudo-Random Number Generators (CSPRNGs) like BBS are vital for many security applications:
        </p>
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-sm sm:text-base text-slate-300"> {/* Responsive padding and text */}
          <li><strong>Key Generation:</strong> Creating unpredictable keys for encryption algorithms.</li>
          <li><strong>Nonces & Initialization Vectors (IVs):</strong> Ensuring that encryption processes are unique even with the same key.</li>
          <li><strong>Stream Ciphers:</strong> Generating a keystream that is XORed with plaintext to produce ciphertext.</li>
          <li><strong>Digital Signatures:</strong> Introducing randomness in signature schemes.</li>
        </ul>
        <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
          The unpredictability and statistical randomness of CSPRNGs are crucial. If an attacker can predict the output of a PRNG used in a cryptographic context, they might be able to break the security of the system.
        </p>
      </section>

       {/* Statistical Testing Explanation */}
       <section className="p-4 sm:p-6 bg-slate-800 rounded-xl shadow-2xl">
        <h3 className="text-xl sm:text-2xl font-semibold text-sky-400 mb-3 sm:mb-4">Statistical Testing of PRNGs</h3> {/* Responsive text and margin */}
        <p className="text-sm sm:text-base text-slate-300 mb-3 leading-relaxed">
          To ensure the "randomness" of PRNG outputs, sequences are subjected to various statistical tests. These tests check for patterns, biases, or other non-random characteristics.
        </p>
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-sm sm:text-base text-slate-300"> {/* Responsive padding and text */}
          <li><strong>Chi-Squared Test:</strong> Checks if the observed frequencies of numbers (or bits) in different bins match the expected frequencies for a truly random sequence. A high chi-squared statistic or a low p-value might indicate non-randomness.</li>
          <li><strong>Frequency Test (Monobit Test):</strong> Checks if the number of 0s and 1s in a bit sequence are approximately equal.</li>
          <li><strong>Runs Test:</strong> Examines the number of "runs" (consecutive sequences of identical bits or numbers). Too many or too few runs can indicate a lack of randomness.</li>
          <li>Many other tests exist, often bundled in suites like NIST SP 800-22 or Diehard tests.</li>
        </ul>
        <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
          Passing statistical tests is a necessary but not sufficient condition for a PRNG to be cryptographically secure. A CSPRNG must also be unpredictable even if an attacker knows the algorithm and previous outputs (unless they know the seed).
        </p>
      </section>
    </div>
  );
};

export default EducationalModules;
