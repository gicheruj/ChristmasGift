// src/App.jsx
import React, { useState } from "react";

import WarmWelcome from "./Components/WarmWelcome";
import Welcome from "./Components/Welcome";
import Mystery from "./Components/Mystery";
import Riddle from "./Components/Riddle";
import Memory from "./Components/Memory";
import Matching from "./Components/Matching";
import Quiz from "./Components/Quiz";
import Tree from "./Components/Tree";
import Video from "./Components/Video";


function App() {
  const [currentPage, setCurrentPage] = useState(1);

  // Navigate to next page
  const handleNext = () => setCurrentPage((prev) => prev + 1);

  // Navigate to previous page
  const handlePrevious = () => setCurrentPage((prev) => prev - 1);

  return (
    <>
      {currentPage === 1 && <WarmWelcome onContinue={handleNext} />}
      {currentPage === 2 && (
        <Welcome onContinue={handleNext} onPrevious={handlePrevious} />
      )}
      {currentPage === 3 && (
        <Mystery onContinue={handleNext} onPrevious={handlePrevious} />
      )}
      {currentPage === 4 && (
        <Riddle onContinue={handleNext} onPrevious={handlePrevious} />
      )}
      {currentPage === 5 && (
        <Memory onContinue={handleNext} onPrevious={handlePrevious} />
      )}
      {currentPage === 6 && (
        <Matching onContinue={handleNext} onPrevious={handlePrevious} />
      )}
      {currentPage === 7 && (
        <Quiz onContinue={handleNext} onPrevious={handlePrevious} />
      )}
      {currentPage === 8 && (
        <Tree onContinue={handleNext} onPrevious={handlePrevious} />
      )}
      {currentPage === 9 && (
        <Video onContinue={handleNext} onPrevious={handlePrevious} />
      )}
    </>
  );
}

export default App;
