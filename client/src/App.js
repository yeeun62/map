import { useState } from "react";
import MapContainer from "./components/Map";
import Insert from "./components/Insert";
import "./App.css";

function App() {
  const [startPosition, setStartPosition] = useState({
    lat: 37.604684142482995,
    lng: 127.13980450970118,
  });
  const [endPosition, setEndPosition] = useState({
    lat: 37.604684142482995,
    lng: 127.13980450970118,
  });

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
