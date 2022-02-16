import { useState } from "react";
import MapContainer from "./components/Map";
import Insert from "./components/Insert";
import axios from "axios";
import "./App.css";

function App() {
  const [startPosition, setStartPosition] = useState({
    lat: 37.603684142482995,
    lng: 127.13980450970118,
  });
  const [endPosition, setEndPosition] = useState({
    lat: 37.604684142482995,
    lng: 127.13980450970118,
  });
  const [linePosition, setLinePosition] = useState(null);

  async function drawPolyline() {
    if (startPosition && endPosition) {
      let route = await axios.post(
        "http://localhost:80/navi",
        {
          start: `${startPosition.lng},${startPosition.lat}`,
          end: `${endPosition.lng},${endPosition.lat}`,
        },
        { withCredentials: true }
      );
      let linePosition = route.data.data.routes[0].sections[0].guides;
      let linePositionList = linePosition.map((el) => {
        return { lat: el.y, lng: el.x };
      });
      setLinePosition(linePositionList);
    }
  }

  return (
    <div className="App">
      <MapContainer
        startPosition={startPosition}
        setStartPosition={setStartPosition}
        endPosition={endPosition}
        setEndPosition={setEndPosition}
        drawPolyline={drawPolyline}
        linePosition={linePosition}
      />
      <Insert
        startPosition={startPosition}
        endPosition={endPosition}
        setStartPosition={setStartPosition}
        setEndPosition={setEndPosition}
        drawPolyline={drawPolyline}
      />
    </div>
  );
}

export default App;
