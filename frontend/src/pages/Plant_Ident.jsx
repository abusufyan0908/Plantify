/* eslint-disable no-unused-vars */
import React from 'react';
import PlantId from '../components/PlantId'; // Ensure the component file exists
import GardenPlanner from '../components/GardenPlanner'; // Ensure the component file exists
import ErrorBoundary from '../components/ErrorBoundary';

const Plant_Ident = () => {
  return (
    <div>
      <ErrorBoundary>
      <PlantId />
      <GardenPlanner />
      </ErrorBoundary>
    </div>
  );
};

export default Plant_Ident;
