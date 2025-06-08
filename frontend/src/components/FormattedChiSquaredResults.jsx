import React from 'react';

const FormattedChiSquaredResults = ({ results }) => {
  if (!results) {
    return null;
  }

  const {
    test_type,
    chi2_statistic,
    p_value,
    degrees_freedom,
    bins,
    expected_freq,
    observed_freq,
    message
  } = results;

  return (
    <div className="mt-2 p-3 sm:p-4 bg-slate-700 border border-slate-600 rounded-md shadow"> {/* Responsive padding */}
      <h5 className="text-sm sm:text-md font-semibold mb-2 sm:mb-3 text-sky-300 capitalize">{test_type || "Chi-squared Test Results"}</h5> {/* Responsive text and margin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm"> {/* Responsive gap and text */}
        <div className="flex justify-between">
          <span className="text-slate-400">Chi-squared Statistic (χ²):</span>
          <span className="text-slate-200 font-medium">{chi2_statistic?.toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">P-value:</span>
          <span className="text-slate-200 font-medium">{p_value?.toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Degrees of Freedom:</span>
          <span className="text-slate-200 font-medium">{degrees_freedom}</span>
        </div>
        {bins && (
          <div className="flex justify-between">
            <span className="text-slate-400">Number of Bins:</span>
            <span className="text-slate-200 font-medium">{bins}</span>
          </div>
        )}
      </div>

      {expected_freq && observed_freq && (
        <div className="mt-3 sm:mt-4"> {/* Responsive margin */}
          <h6 className="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-sky-400">Frequency Distribution:</h6> {/* Responsive text and margin */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full text-xs bg-slate-800 rounded-md"> {/* Base text size for table */}
              <thead>
                <tr>
                  <th className="p-1.5 sm:p-2 border-b border-slate-600 text-left text-slate-400">Bin</th> {/* Responsive padding */}
                  <th className="p-1.5 sm:p-2 border-b border-slate-600 text-right text-slate-400">Observed</th> {/* Responsive padding */}
                  <th className="p-1.5 sm:p-2 border-b border-slate-600 text-right text-slate-400">Expected</th> {/* Responsive padding */}
                </tr>
              </thead>
              <tbody>
                {observed_freq.map((obs, index) => (
                  <tr key={index} className="border-t border-slate-700 hover:bg-slate-750">
                    <td className="p-1.5 sm:p-2 text-slate-300">{index + 1}</td> {/* Responsive padding */}
                    <td className="p-1.5 sm:p-2 text-slate-300 text-right">{obs}</td> {/* Responsive padding */}
                    <td className="p-1.5 sm:p-2 text-slate-300 text-right">{expected_freq[index]?.toFixed(2)}</td> {/* Responsive padding */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {message && (
        <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-600"> {/* Responsive margin and padding */}
          <p className="text-xs sm:text-sm text-slate-300 bg-slate-800 p-2 sm:p-3 rounded-md">{message}</p> {/* Responsive text and padding */}
        </div>
      )}
    </div>
  );
};

export default FormattedChiSquaredResults;
