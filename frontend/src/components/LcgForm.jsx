import React, { useState } from 'react';
import PrngChart from './PrngChart'; // Import the chart component
import AiTutor from './AiTutor'; // Import the AI Tutor component
import FormattedChiSquaredResults from './FormattedChiSquaredResults'; // Import the new component

function LcgForm() {
    const [seed, setSeed] = useState('1');
    const [multiplier, setMultiplier] = useState('1103515245');
    const [increment, setIncrement] = useState('12345');
    const [modulus, setModulus] = useState('2147483648'); // 2^31
    const [count, setCount] = useState('10');
    const [sequence, setSequence] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentParams, setCurrentParams] = useState({});
    const [statTestResults, setStatTestResults] = useState(null);
    const [statTestError, setStatTestError] = useState('');
    const [testingStats, setTestingStats] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSequence([]);
        setStatTestResults(null); // Reset stat test results on new generation
        setStatTestError('');

        // Basic client-side validation
        if (isNaN(parseInt(seed)) || isNaN(parseInt(multiplier)) || isNaN(parseInt(increment)) || isNaN(parseInt(modulus)) || isNaN(parseInt(count))) {
            setError('All inputs must be valid integers.');
            setLoading(false);
            return;
        }
        if (parseInt(count) <= 0) {
            setError('Count must be a positive integer.');
            setLoading(false);
            return;
        }
        if (parseInt(modulus) === 0) {
            setError('Modulus (m) cannot be zero.');
            setLoading(false);
            return;
        }

        const params = {
            seed: parseInt(seed),
            multiplier: parseInt(multiplier),
            increment: parseInt(increment),
            modulus: parseInt(modulus),
            count: parseInt(count),
        };
        setCurrentParams(params); // Store current params for AI Tutor

        try {
            const response = await fetch('http://127.0.0.1:5001/api/lcg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate sequence. Check console for details.');
            }

            setSequence(data.sequence);
        } catch (err) {
            console.error("API Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRunStatTest = async () => {
        if (sequence.length === 0) {
            setStatTestError("Please generate a sequence first.");
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
                    sequence: sequence,
                    test_type: 'chi_squared',
                    // num_bins: 10 // Default for LCG, or make it configurable
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
        <div className="w-full bg-slate-800 text-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
            <div className="bg-slate-700 p-4 sm:p-6 border-b border-slate-600"> {/* Adjusted padding */}
                 <h2 className="text-2xl sm:text-3xl font-bold text-center text-purple-400">Linear Congruential Generator (LCG)</h2> {/* Responsive text size */}
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8"> {/* Responsive padding and spacing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6"> {/* Responsive gap */}
                    <div>
                        <label htmlFor="seed" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-1.5">Seed (X₀):</label> {/* Responsive text and margin */}
                        <input
                            type="number"
                            id="seed"
                            value={seed}
                            onChange={(e) => setSeed(e.target.value)}
                            placeholder="e.g., 123"
                            className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm placeholder-slate-500 transition-all duration-150 ease-in-out" /* Responsive padding and text */
                        />
                    </div>
                    <div>
                        <label htmlFor="multiplier" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-1.5">Multiplier (a):</label> {/* Responsive text and margin */}
                        <input
                            type="number"
                            id="multiplier"
                            value={multiplier}
                            onChange={(e) => setMultiplier(e.target.value)}
                            placeholder="e.g., 1103515245"
                            className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm placeholder-slate-500 transition-all duration-150 ease-in-out" /* Responsive padding and text */
                        />
                    </div>
                    <div>
                        <label htmlFor="increment" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-1.5">Increment (c):</label> {/* Responsive text and margin */}
                        <input
                            type="number"
                            id="increment"
                            value={increment}
                            onChange={(e) => setIncrement(e.target.value)}
                            placeholder="e.g., 12345"
                            className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm placeholder-slate-500 transition-all duration-150 ease-in-out" /* Responsive padding and text */
                        />
                    </div>
                    <div>
                        <label htmlFor="modulus" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-1.5">Modulus (m):</label> {/* Responsive text and margin */}
                        <input
                            type="number"
                            id="modulus"
                            value={modulus}
                            onChange={(e) => setModulus(e.target.value)}
                            placeholder="e.g., 2147483648"
                            className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm placeholder-slate-500 transition-all duration-150 ease-in-out" /* Responsive padding and text */
                        />
                    </div>
                </div>
                <div className="md:col-span-2"> {/* Ensure count takes full width on larger screens if needed */}
                    <label htmlFor="count" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-1.5">Number of Values to Generate:</label> {/* Responsive text and margin */}
                    <input
                        type="number"
                        id="count"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        required
                        min="1"
                        max="10000" // Consider if max should be different for smaller screens or if input type="number" handles this well enough
                        placeholder="e.g., 10"
                        className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs sm:text-sm placeholder-slate-500 transition-all duration-150 ease-in-out" /* Responsive padding and text */
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-3 px-4 sm:py-3.5 border border-transparent rounded-lg shadow-lg text-sm sm:text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95" /* Responsive padding and text */
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : 'Generate Sequence'}
                </button>
            </form>

            {error && (
                <div className="p-4 sm:p-6 border-t border-slate-700"> {/* Responsive padding */}
                    <div className="bg-red-900/70 border border-red-700 text-red-200 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg shadow-md flex items-start space-x-2 sm:space-x-3"> {/* Responsive padding and spacing */}
                        <div className="py-1">
                            <svg className="fill-current h-5 w-5 sm:h-6 sm:w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM11.414 10l2.829-2.828a1 1 0 1 0-1.414-1.414L10 8.586 7.172 5.757a1 1 0 0 0-1.414 1.414L8.586 10l-2.828 2.828a1 1 0 1 0 1.414 1.414L10 11.414l2.828 2.828a1 1 0 0 0 1.414-1.414L11.414 10z"/></svg> {/* Responsive icon size */}
                        </div>
                        <div>
                            <p className="font-semibold text-red-100 text-sm sm:text-base">Error Generating Sequence</p> {/* Responsive text */}
                            <p className="text-xs sm:text-sm text-red-200">{error}</p> {/* Responsive text */}
                        </div>
                    </div>
                </div>
            )}

            {sequence.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-slate-700 space-y-4 sm:space-y-6"> {/* Responsive padding and spacing */}
                    <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-2 sm:mb-3">Generated Sequence:</h3> {/* Responsive text and margin */}
                        <div className="bg-slate-900 p-3 sm:p-4 rounded-lg shadow"> {/* Responsive padding */}
                            <pre className="text-xs sm:text-sm text-lime-300 overflow-x-auto whitespace-pre-wrap break-all">{sequence.join(', ')}</pre> {/* Responsive text */}
                        </div>
                    </div>

                    <div className="mt-4 sm:mt-6"> {/* Responsive margin */}
                         <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-3 sm:mb-4 text-center">Sequence Distribution:</h3> {/* Responsive text and margin */}
                        <div className="bg-slate-900 p-2 sm:p-4 rounded-lg shadow h-64 sm:h-80 md:h-96"> {/* Responsive padding and height */}
                            <PrngChart data={sequence} type="histogram" title="LCG Output Distribution" />
                        </div>
                    </div>

                    <div className="mt-4 sm:mt-6"> {/* Responsive margin */}
                        <button
                            onClick={handleRunStatTest}
                            disabled={testingStats || sequence.length === 0}
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
                            ) : 'Run Chi-Squared Test'}
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
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-200 mb-2 sm:mb-3">Chi-Squared Test Results:</h3> {/* Responsive text and margin */}
                    <FormattedChiSquaredResults results={statTestResults} />
                </div>
            )}
            
            {Object.keys(currentParams).length > 0 && (
                 <div className="p-4 sm:p-6 border-t border-slate-700"> {/* Responsive padding */}
                    <AiTutor
                        prngType="Linear Congruential Generator" // Renamed from prngName
                        params={currentParams}
                        sequence={sequence}
                        statTestResults={statTestResults}
                    />
                </div>
            )}
        </div>
    );
}

export default LcgForm;
