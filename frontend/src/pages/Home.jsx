/* eslint-disable no-unused-vars */
import React from 'react';
import Hero from '../components/Hero';
import PlantIdentificationAd from '../components/PlantIdentificationAd';
import GardenPlanner from '../components/GardenPlanner';
import ErrorBoundary from '../components/ErrorBoundary';
import Catalogue from '../components/catalogue';
import Why_Us from '../components/Why_Us'



const Home = () => {
  return (
    <div>
      <Hero/>
      <Why_Us />
      <Catalogue />
      <ErrorBoundary>
      <PlantIdentificationAd />
      </ErrorBoundary>
      <GardenPlanner />
     <div>
     </div>
    </div>
  );
}

export default Home;


