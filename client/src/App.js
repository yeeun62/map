import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import MapContainer from "./components/Map";
import Insert from "./components/Insert";
import axios from "axios";
import "./App.css";

function App() {
  const [startPosition, setStartPosition] = useState(null); // 출발지 경위도
  const [endPosition, setEndPosition] = useState(null); // 도착지 경위도
  const [wayPointPosition, setWayPointPosition] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  }); // 경유지 경위도
  const [address, setAddress] = useState({
    start: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    end: "",
  }); // 출발지, 도착지, 경유지 주소
  const [linePosition, setLinePosition] = useState(null); // polyline 경위도 배열
  const [currentLocation, setCurrentLocation] = useState(null); // gps로 현재위치 받아옴
  const [naviResult, setNaviResult] = useState(null);
  const [point, setPoint] = useState(null); // 출발지 도착지 경유지중 어떤것을 변경할것인지
  const [naviOption, setNaviOption] = useState("RECOMMEND"); // 네비옵션

  const naviURL = decodeURI(window.location.href);
  const searchParams = naviURL.split("?")[1];
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    if (searchParams) {
      let start = params.get("출발지").split(",");
      let end = params.get("도착지").split(",");
      setStartPosition({ lng: start[0], lat: start[1] });
      setEndPosition({ lng: end[0], lat: end[1] });
      getAddress(
        Number(start[0]),
        Number(start[1]),
        "start",
        Number(end[0]),
        Number(end[1]),
        "end"
      );
    } else if (navigator.geolocation) {
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
      let avoid = "";
      let priority = naviOption;
      if (naviOption === "motorway") {
        avoid = "motorway";
        priority = "RECOMMEND";
      }
      let wayPoint = "&waypoints=";
      for (let key in wayPointPosition) {
        if (wayPointPosition[key] && wayPoint.length === 11) {
          wayPoint += `${wayPointPosition[key].lng},${wayPointPosition[key].lat}`;
        } else if (wayPointPosition[key] && wayPoint.length !== 11) {
          wayPoint += `|${wayPointPosition[key].lng},${wayPointPosition[key].lat}`;
        }
      }
      try {
        let route = await axios.post(
          `${process.env.REACT_APP_API_URL}/v1/navi`,
          {
            start: `${startPosition.lng},${startPosition.lat}`,
            end: `${endPosition.lng},${endPosition.lat}`,
            wayPoint,
            priority,
            avoid,
          },
          { withCredentials: true }
        );
        let linePosition = route.data.data.routes[0].sections.map(
          (el) => el.guides
        );
        let linePositionList = linePosition.flat().map((el) => {
          return { lng: el.x, lat: el.y };
        });
        setNaviResult(route.data.route);
        setLinePosition(linePositionList);
      } catch (err) {
        alert(`${err.response.data.data.result_msg}`);
      }
    }
  }

  async function getAddress(lng, lat, point, endlng, endlat) {
    if (lng && lat && point) {
      let findAddress = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/navi/coord`,
        {
          lng,
          lat,
          endlng,
          endlat,
        },
        { withCredentials: true }
      );
      if (findAddress.data.address2) {
        setAddress({
          ...address,
          [point]: findAddress.data.address,
          end: findAddress.data.address2,
        });
      } else {
        setAddress({ ...address, [point]: findAddress.data.address });
      }
    }
  }

  return (
    <BrowserRouter>
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
              wayPointPosition={wayPointPosition}
              setWayPointPosition={setWayPointPosition}
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
              wayPointPosition={wayPointPosition}
              setWayPointPosition={setWayPointPosition}
            />
          </>
        ) : (
          <p>현재위치를 불러오는중 입니다.</p>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
