import React from 'react';
import GardenerProfiles from '../components/GardenerProfiles';
import Catalogue from '../components/Catalogue';

const Planner = () => {

  return (
    <div className="container mx-auto px-4 py-8">
      <GardenerProfiles />
      <Catalogue />
    </div>
  );
};

export default Planner;
