import React, { useEffect } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import "../style.css";

export default function MapContainer({
  startPosition,
  setStartPosition,
  endPosition,
  setEndPosition,
  drawPolyline,
  linePosition,
  getAddress,
  isStart,
  setIsStart,
  currentLocation,
}) {
  useEffect(() => {
    drawPolyline();
  }, [startPosition, endPosition]);

  const startImage = {
    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png",
    size: [50, 45],
    options: {
      offset: [15, 43],
    },
  };

  const endImage = {
    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_b.png",
    size: [50, 45],
    options: {
      offset: [15, 43],
    },
  };

  function positionHandler(mouseEvent) {
    console.log("얘는실행되면안됨");
    let obj = {
      lat: mouseEvent.latLng.getLat(),
      lng: mouseEvent.latLng.getLng(),
    };
    if (isStart) {
      getAddress(
        mouseEvent.latLng.getLng(),
        mouseEvent.latLng.getLat(),
        "start"
      );
      setStartPosition(obj);
    } else {
      getAddress(mouseEvent.latLng.getLng(), mouseEvent.latLng.getLat(), "end");
      setEndPosition(obj);
    }
  }

  return (
    <div className="mapContainer">
      <Map
        center={currentLocation}
        level={3}
        onClick={(_t, mouseEvent) => {
          positionHandler(mouseEvent);
        }}
        className="mapComponent"
      >
        <MapMarker position={startPosition} image={startImage} />
        <MapMarker position={endPosition} image={endImage} />
        {linePosition && (
          <Polyline
            path={linePosition}
            strokeWeight={5}
            strokeColor={"#ff23cf"}
            strokeOpacity={0.7}
            strokeStyle={"solid"}
          />
        )}
      </Map>
      <div className="pointButton" onClick={() => setIsStart(!isStart)}>
        {isStart ? (
          <span style={{ color: "#1ba5f5" }}>도착 </span>
        ) : (
          <span style={{ color: "#ed695a" }}>출발 </span>
        )}
        위치 변경
      </div>
    </div>
  );
}
