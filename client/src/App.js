import { useState } from "react";
import MapContainer from "./components/Map";
import Insert from "./components/Insert";
import "./App.css";

function App() {
  const [startPosition, setStartPosition] = useState();
  const [endPosition, setEndPosition] = useState();

  return (
    <div className="App">
      <MapContainer
        startPosition={startPosition}
        setStartPosition={setStartPosition}
        endPosition={endPosition}
        setEndPosition={setEndPosition}
      />
      <Insert
        startPosition={startPosition}
        setStartPosition={setStartPosition}
        endPosition={endPosition}
        setEndPosition={setEndPosition}
      />
    </div>
  );
}

export default App;
