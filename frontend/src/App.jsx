import React, { useState } from 'react';
import LcgForm from './components/LcgForm';
import BbsForm from './components/BbsForm';
import EducationalModules from './components/EducationalModules';
import CryptoDemo from './components/CryptoDemo'; // Import the new component
import './index.css'; // Ensure Tailwind is processed

function App() {
  const [activeTab, setActiveTab] = useState('lcg'); // 'lcg', 'bbs', 'learn', or 'demo'

  const renderContent = () => {
    switch (activeTab) {
      case 'lcg':
        return <LcgForm />;
      case 'bbs':
        return <BbsForm />;
      case 'learn':
        return <EducationalModules />;
      case 'demo':
        return <CryptoDemo />;
      default:
        return <LcgForm />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 selection:bg-purple-500 selection:text-white">
      <header className="w-full max-w-5xl py-10 mb-8 md:mb-12"> {/* Increased max-width, py, mb */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 pb-3"> {/* Enhanced gradient, pb */}
            CryptoRand Playground
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mt-3"> {/* Adjusted text size and color */}
            Exploring Discrete Mathematics in Pseudo-Random Number Generators
          </p>
        </div>
      </header>

      {/* Generator Selection Tabs */}
      <nav className="w-full max-w-2xl mb-10"> {/* Increased max-width, mb */}
        <div className="flex space-x-2 bg-slate-800 p-2 rounded-xl shadow-lg"> {/* Increased padding, rounded, shadow, space */}
          <button
            onClick={() => setActiveTab('lcg')}
            className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out transform hover:scale-105
                        ${activeTab === 'lcg' ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400' : 'bg-slate-700 text-slate-300 hover:bg-purple-500 hover:text-white'}`}
          >
            Linear Congruential (LCG)
          </button>
          <button
            onClick={() => setActiveTab('bbs')}
            className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out transform hover:scale-105
                        ${activeTab === 'bbs' ? 'bg-pink-600 text-white shadow-md ring-2 ring-pink-400' : 'bg-slate-700 text-slate-300 hover:bg-pink-500 hover:text-white'}`}
          >
            Blum Blum Shub (BBS)
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out transform hover:scale-105
                        ${activeTab === 'learn' ? 'bg-sky-500 text-white shadow-md ring-2 ring-sky-300' : 'bg-slate-700 text-slate-300 hover:bg-sky-400 hover:text-white'}`}
          >
            Learn & Explore
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out transform hover:scale-105
                        ${activeTab === 'demo' ? 'bg-teal-500 text-white shadow-md ring-2 ring-teal-300' : 'bg-slate-700 text-slate-300 hover:bg-teal-400 hover:text-white'}`} /* Changed demo color to teal */
          >
            Crypto Demo
          </button>
        </div>
      </nav>

      <main className="w-full max-w-4xl mb-auto"> {/* Increased max-width */}
        {renderContent()}
      </main>

      <footer className="w-full max-w-5xl py-10 mt-16 text-center border-t border-slate-700"> {/* Increased py, mt, added border */}
        <p className="text-slate-400 text-base"> {/* Adjusted color and size */}
          CryptoRand - A Discrete Mathematics Showcase Project
        </p>
        <p className="text-slate-500 text-sm mt-2"> {/* Adjusted color and size */}
          Powered by Vite, React, Flask, TailwindCSS, and Gemini
        </p>
      </footer>
    </div>
  );
}

export default App;
