import React, { useState } from 'react';
import PrngChart from './PrngChart'; // Import the chart component
import AiTutor from './AiTutor'; // Import the AI Tutor component
import FormattedChiSquaredResults from './FormattedChiSquaredResults'; // Import the new component

function BbsForm() {
    const [p, setP] = useState('11'); // Example prime p = 3 (mod 4)
    const [q, setQ] = useState('19'); // Example prime q = 3 (mod 4), p != q
    const [seed, setSeed] = useState('3'); // Example seed, gcd(seed, p*q) = 1
    const [count, setCount] = useState('100');
    const [sequenceBits, setSequenceBits] = useState([]);
    const [generatedN, setGeneratedN] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentParams, setCurrentParams] = useState({});
    const [statTestResults, setStatTestResults] = useState(null); // Added for stat test
    const [statTestError, setStatTestError] = useState(''); // Added for stat test
    const [testingStats, setTestingStats] = useState(false); // Added for stat test

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSequenceBits([]);
        setGeneratedN(null);
        setStatTestResults(null); // Reset stat test results
        setStatTestError('');    // Reset stat test error

        // Basic client-side validation
        const pVal = parseInt(p);
        const qVal = parseInt(q);
        const seedVal = parseInt(seed);
        const countVal = parseInt(count);

        if (isNaN(pVal) || isNaN(qVal) || isNaN(seedVal) || isNaN(countVal)) {
            setError('All inputs p, q, seed, and count must be valid integers.');
            setLoading(false);
            return;
        }
        if (countVal <= 0) {
            setError('Count must be a positive integer.');
            setLoading(false);
            return;
        }
        // Further specific BBS validation is handled by the backend, but basic checks can be here.

        const params = {
            p: pVal,
            q: qVal,
            seed: seedVal,
            count: countVal,
        };
        setCurrentParams(params); // Store current params for AI Tutor

        try {
            const response = await fetch('http://127.0.0.1:5001/api/bbs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate BBS sequence. Check console for details.');
            }
            setGeneratedN(data.parameters.n);
            setSequenceBits(data.sequence_bits);
        } catch (err) {
            console.error("API Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRunStatTest = async () => {
        if (sequenceBits.length === 0) {
            setStatTestError("Please generate a bit sequence first.");
            return;
        }
        setTestingStats(true);
        setStatTestError('');
        setStatTestResults(null);

        try {
            const response = await fetch('http://127.0.0.1:5001/api/stats/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sequence: sequenceBits, // Use sequenceBits for BBS
                    test_type: 'chi_squared',
                    // For BBS, the backend expects a list of 0s and 1s.
                    // It will handle binning appropriately (e.g., counts of 0s and 1s).
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to perform statistical test.');
            }
            setStatTestResults(data);
        } catch (err) {
            console.error("Stat Test Error:", err);
            setStatTestError(err.message);
        } finally {
            setTestingStats(false);
        }
    };

    return (
        <div className="w-full bg-slate-800 text-white rounded-xl shadow-2xl overflow-hidden mt-6 sm:mt-8 transition-all duration-300 ease-in-out"> {/* Responsive margin */}
            <div className="bg-slate-700 p-4 sm:p-6 border-b border-slate-600"> {/* Responsive padding */}
                 <h2 className="text-2xl sm:text-3xl font-bold text-center text-pink-400">Blum Blum Shub (BBS)</h2> {/* Responsive text */}
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8"> {/* Responsive padding and spacing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6"> {/* Responsive gap */}
                    <div>
                        <label htmlFor="p_val" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-1.5">Prime (p): <span className="text-xs text-slate-400">(must be ≡ 3 mod 4)</span></label> {/* Responsive text and margin */}
                        <input
                            type="number"
                            id="p_val"
                            value={p}
                            onChange={(e) => setP(e.target.value)}
                            placeholder="e.g., 11"
                            className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-xs sm:text-sm placeholder-slate-500 transition-all duration-150 ease-in-out" /* Responsive padding and text */
                        />
                    </div>
                    <div>
                        <label htmlFor="q_val" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-1.5">Prime (q): <span className="text-xs text-slate-400">(must be ≡ 3 mod 4, p ≠ q)</span></label> {/* Responsive text and margin */}
                        <input
                            type="number"
                            id="q_val"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="e.g., 19"
                            className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-xs sm:text-sm placeholder-slate-500 transition-all duration-150 ease-in-out" /* Responsive padding and text */
                        />
                    </div>
                    <div>
                        <label htmlFor="bbs_seed" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-1.5">Seed (s): <span className="text-xs text-slate-400">(1 &lt; s &lt; n, gcd(s, n)=1)</span></label> {/* Responsive text and margin */}
                        <input
                            type="number"
                            id="bbs_seed"
                            value={seed}
                            onChange={(e) => setSeed(e.target.value)}
                            placeholder="e.g., 3"
                            className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-xs sm:text-sm placeholder-slate-500 transition-all duration-150 ease-in-out" /* Responsive padding and text */
                        />
                    </div>
                    <div>
                        <label htmlFor="bbs_count" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-1.5">Number of Bits to Generate:</label> {/* Responsive text and margin */}
                        <input
                            type="number"
                            id="bbs_count"
                            value={count}
                            onChange={(e) => setCount(e.target.value)}
                            required
                            min="1"
                            max="10000"
                            placeholder="e.g., 100"
                            className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-xs sm:text-sm placeholder-slate-500 transition-all duration-150 ease-in-out" /* Responsive padding and text */
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-3 px-4 sm:py-3.5 border border-transparent rounded-lg shadow-lg text-sm sm:text-base font-semibold text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95" /* Responsive padding and text */
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Bits...
                        </>
                    ) : 'Generate Bit Sequence'}
                </button>
            </form>

            {error && (
                <div className="p-4 sm:p-6 border-t border-slate-700"> {/* Responsive padding */}
                    <div className="bg-red-900/70 border border-red-700 text-red-200 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg shadow-md flex items-start space-x-2 sm:space-x-3"> {/* Responsive padding and spacing */}
                        <div className="py-1">
                            <svg className="fill-current h-5 w-5 sm:h-6 sm:w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM11.414 10l2.829-2.828a1 1 0 1 0-1.414-1.414L10 8.586 7.172 5.757a1 1 0 0 0-1.414 1.414L8.586 10l-2.828 2.828a1 1 0 1 0 1.414 1.414L10 11.414l2.828 2.828a1 1 0 0 0 1.414-1.414L11.414 10z"/></svg> {/* Responsive icon size */}
                        </div>
                        <div>
                            <p className="font-semibold text-red-100 text-sm sm:text-base">Error Generating BBS Sequence</p> {/* Responsive text */}
                            <p className="text-xs sm:text-sm text-red-200">{error}</p> {/* Responsive text */}
                        </div>
                    </div>
                </div>
            )}

            {sequenceBits.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-slate-700 space-y-4 sm:space-y-6"> {/* Responsive padding and spacing */}
                    {generatedN && (
                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-1.5 sm:mb-2">Modulus (n = p * q):</h3> {/* Responsive text and margin */}
                            <p className="text-base sm:text-lg text-pink-300 bg-slate-900 p-2 sm:p-3 rounded-md shadow">{generatedN}</p> {/* Responsive text and padding */}
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-2 sm:mb-3">Generated Bit Sequence:</h3> {/* Responsive text and margin */}
                        <div className="bg-slate-900 p-3 sm:p-4 rounded-lg shadow max-h-40 sm:max-h-48 overflow-y-auto"> {/* Responsive padding and max-height */}
                            <pre className="text-xs sm:text-sm text-lime-300 whitespace-pre-wrap break-all">{sequenceBits.join('')}</pre> {/* Responsive text */}
                        </div>
                    </div>
                     <div className="mt-4 sm:mt-6"> {/* Responsive margin */}
                         <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3 sm:mb-4 text-center">Bit Sequence Distribution (0s vs 1s):</h3> {/* Responsive text and margin */}
                        <div className="bg-slate-900 p-2 sm:p-4 rounded-lg shadow h-64 sm:h-80 md:h-96"> {/* Responsive padding and height */}
                            <PrngChart data={sequenceBits} type="bit_distribution" title="BBS Bit Distribution (0s vs 1s)" />
                        </div>
                    </div>
                     <div className="mt-4 sm:mt-6"> {/* Responsive margin */}
                        <button
                            onClick={handleRunStatTest}
                            disabled={testingStats || sequenceBits.length === 0}
                            className="w-full md:w-auto flex items-center justify-center py-2.5 px-5 sm:py-3 sm:px-6 border border-transparent rounded-lg shadow-lg text-sm sm:text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95" /* Responsive padding and text */
                        >
                            {testingStats ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Running Test...
                                </>
                            ) : 'Run Chi-Squared Test on Bits'}
                        </button>
                    </div>
                </div>
            )}

            {statTestError && (
                 <div className="p-4 sm:p-6 border-t border-slate-700"> {/* Responsive padding */}
                    <div className="bg-red-900/70 border border-red-700 text-red-200 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg shadow-md flex items-start space-x-2 sm:space-x-3"> {/* Responsive padding and spacing */}
                        <div className="py-1">
                            <svg className="fill-current h-5 w-5 sm:h-6 sm:w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM11.414 10l2.829-2.828a1 1 0 1 0-1.414-1.414L10 8.586 7.172 5.757a1 1 0 0 0-1.414 1.414L8.586 10l-2.828 2.828a1 1 0 1 0 1.414 1.414L10 11.414l2.828 2.828a1 1 0 0 0 1.414-1.414L11.414 10z"/></svg> {/* Responsive icon size */}
                        </div>
                        <div>
                            <p className="font-semibold text-red-100 text-sm sm:text-base">Statistical Test Error</p> {/* Responsive text */}
                            <p className="text-xs sm:text-sm text-red-200">{statTestError}</p> {/* Responsive text */}
                        </div>
                    </div>
                </div>
            )}

            {statTestResults && (
                <div className="p-4 sm:p-6 border-t border-slate-700"> {/* Responsive padding */}
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-2 sm:mb-3">Chi-Squared Test Results (Bits):</h3> {/* Responsive text and margin */}
                    <FormattedChiSquaredResults results={statTestResults} />
                </div>
            )}

            {Object.keys(currentParams).length > 0 && (
                <div className="p-4 sm:p-6 border-t border-slate-700"> {/* Responsive padding */}
                    <AiTutor
                        prngType="Blum Blum Shub" // Renamed from prngName
                        params={currentParams}
                        sequence={sequenceBits} // Pass sequenceBits
                        statTestResults={statTestResults}
                        isBBS={true} // Indicate BBS for tailored advice
                    />
                </div>
            )}
        </div>
    );
}

export default BbsForm;
