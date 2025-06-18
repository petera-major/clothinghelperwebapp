import React, { useState } from 'react';
import LandingPage from "./LandingPage";
import OutfitForm from './OutfitForm';

function App() {
  const [showCloset, setShowCloset] = useState(false);

  return (
    <div>
      {showCloset ? (
        <OutfitForm playMusic={true} /> 
      ) : (
        <LandingPage onEnter={() => setShowCloset(true)} />
      )}
    </div>
  );
}

export default App;
