import React from 'react';
import { motion } from 'framer-motion';

const gifs = [
  "https://media.giphy.com/media/3ohs7PreQz9D9ZpVUk/giphy.gif", // Racing car drift
  "https://media.giphy.com/media/3GBG6spebKtmGlCM15/giphy.gif", // Toyota Supra
  "https://media.giphy.com/media/l4KhPz18S3Untyj6g/giphy.gif", // Racing car zooming by
];

const CarShowcase: React.FC = () => {
  return (
    <section className="py-8 md:py-12">
      <motion.div 
        className="container mx-auto px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center mb-8">
          <motion.h2 
            className="text-2xl md:text-3xl font-racing mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            PERFORMANCE <span className="text-racing-red-500">SHOWCASE</span>
          </motion.h2>
          <motion.p 
            className="text-dark-300 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Experience the thrill of Toyota's legendary performance and precision engineering
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gifs.map((gif, index) => (
            <motion.div 
              key={index}
              className="relative overflow-hidden rounded-lg racing-border h-48 md:h-64"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src={gif} 
                alt={`Racing showcase ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-60" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CarShowcase;