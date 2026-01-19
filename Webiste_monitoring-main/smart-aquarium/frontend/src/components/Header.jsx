import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-cyan-600 to-blue-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Smart Aquarium Monitoring
              </h1>
              <p className="text-cyan-100 text-sm">Comet Goldfish Water Quality Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Live</span>
            </div>
            
            <button className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 transition-all duration-200 px-4 py-2 rounded-lg group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center border-2 border-white/30">
                <span className="text-white font-semibold text-sm">AQ</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-white text-sm font-medium">Admin</p>
                <p className="text-cyan-100 text-xs">Aquarium Manager</p>
              </div>
              <svg className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
