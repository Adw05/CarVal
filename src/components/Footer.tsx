import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 mt-10 border-t border-dark-800 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-dark-400">
          &copy; {new Date().getFullYear()} CarVal - Price Prediction Tool
        </p>
        <p className="text-xs text-dark-500 mt-1">
          Powered by advanced machine learning algorithms and market analysis
        </p>
      </div>
    </footer>
  );
};

export default Footer;