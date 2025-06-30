import React, { useEffect } from 'react';
import Collection from '../components/Collection';

const Shop = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    // Update page title
    document.title = 'Fertilizers & Tools | Plantify';
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white">
      <div className="py-8">
        <Collection />
      </div>
    </main>
  );
};

export default Shop;
