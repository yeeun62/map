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
  const [address, setAddress] = useState({ start: "", end: "" });
  const [isStart, setIsStart] = useState(false);
  const [naviResult, setNaviResult] = useState({ duration: "", distance: "" });

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
      setNaviResult(route.data.route);
      setLinePosition(linePositionList);
    }
  }

  async function getAddress(lng, lat, point) {
    if (lng && lat) {
      let address = await axios.post(
        "http://localhost:80/coord",
        {
          lng,
          lat,
        },
        { withCredentials: true }
      );
      if (point === "start") {
        setAddress({ ...address, start: address.data.address });
      } else {
        setAddress({ ...address, end: address.data.address });
      }
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
        getAddress={getAddress}
        isStart={isStart}
      />
      <Insert
        startPosition={startPosition}
        endPosition={endPosition}
        setStartPosition={setStartPosition}
        setEndPosition={setEndPosition}
        drawPolyline={drawPolyline}
        address={address}
        setAddress={setAddress}
        naviResult={naviResult}
        isStart={isStart}
        setIsStart={setIsStart}
      />
    </div>
  );
}

export default App;
