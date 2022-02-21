import { useState, useEffect } from "react";
import MapContainer from "./components/Map";
import Insert from "./components/Insert";
import axios from "axios";
import "./App.css";

function App() {
  const [startPosition, setStartPosition] = useState(null); // 출발지 경위도
  const [endPosition, setEndPosition] = useState(null); // 도착지 경위도
  const [linePosition, setLinePosition] = useState(null); // polyline 경위도 배열
  const [currentLocation, setCurrentLocation] = useState(null); // gps로 현재위치 받아옴
  const [address, setAddress] = useState({ start: "", end: "" }); // 출발지, 도착지 주소
  const [naviResult, setNaviResult] = useState(null);
  const [point, setPoint] = useState(null); // 출발지를 변경할 것인지 도착지를 변경할것인지
  const [wayPoint, setWayPoint] = useState(null);
  const [naviOption, setNaviOption] = useState("RECOMMEND");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
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
      let avoid = null;
      let priority = naviOption;
      if (naviOption === "motorway") {
        avoid = "motorway";
        priority = "RECOMMEND";
      }
      let route = await axios.post(
        "http://localhost:80/navi",
        {
          start: `${startPosition.lng},${startPosition.lat}`,
          end: `${endPosition.lng},${endPosition.lat}`,
          priority,
          avoid,
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
      } else if (point === "end") {
        setAddress({ ...address, end: address.data.address });
      }
    }
  }

  return (
    <div className="App">
      {currentLocation ? (
        <>
          <Insert
            startPosition={startPosition}
            endPosition={endPosition}
            setStartPosition={setStartPosition}
            setEndPosition={setEndPosition}
            address={address}
            setAddress={setAddress}
            naviResult={naviResult}
            point={point}
            setPoint={setPoint}
            drawPolyline={drawPolyline}
            naviOption={naviOption}
            setNaviOption={setNaviOption}
            wayPoint={wayPoint}
            setWayPoint={setWayPoint}
          />
          <MapContainer
            startPosition={startPosition}
            setStartPosition={setStartPosition}
            endPosition={endPosition}
            setEndPosition={setEndPosition}
            drawPolyline={drawPolyline}
            linePosition={linePosition}
            getAddress={getAddress}
            currentLocation={currentLocation}
            point={point}
            wayPoint={wayPoint}
            setWayPoint={setWayPoint}
          />
        </>
      ) : (
        <p>현재위치를 불러오는중 입니다.</p>
      )}
    </div>
  );
}

export default App;
