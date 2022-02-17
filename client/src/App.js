import { useState, useEffect } from "react";
import MapContainer from "./components/Map";
import Insert from "./components/Insert";
import axios from "axios";
import "./App.css";

function App() {
  const [startPosition, setStartPosition] = useState(null);
  const [endPosition, setEndPosition] = useState(null);
  const [linePosition, setLinePosition] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState({ start: "", end: "" });
  const [isStart, setIsStart] = useState(false);
  const [naviResult, setNaviResult] = useState({ duration: "", distance: "" });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setStartPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setEndPosition({
          lat: position.coords.latitude + 0.001,
          lng: position.coords.longitude,
        });
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      console.log("GPS를 지원하지 않습니다");
    }
  }, []);

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
      {startPosition && endPosition && currentLocation ? (
        <>
          <MapContainer
            startPosition={startPosition}
            setStartPosition={setStartPosition}
            endPosition={endPosition}
            setEndPosition={setEndPosition}
            drawPolyline={drawPolyline}
            linePosition={linePosition}
            getAddress={getAddress}
            isStart={isStart}
            currentLocation={currentLocation}
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
        </>
      ) : (
        <p>불러오는즁</p>
      )}
    </div>
  );
}

export default App;
