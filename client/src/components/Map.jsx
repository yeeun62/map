import React, { useState, useEffect } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";

export default function MapContainer({
  startPosition,
  setStartPosition,
  endPosition,
  setEndPosition,
  drawPolyline,
  linePosition,
}) {
  const [isStart, setIsStart] = useState(false);

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
    let obj = {
      lat: mouseEvent.latLng.getLat(),
      lng: mouseEvent.latLng.getLng(),
    };
    if (isStart) {
      setStartPosition(obj);
    } else {
      setEndPosition(obj);
    }
  }

  return (
    <>
      <Map
        center={{
          lat: 37.604684142482995,
          lng: 127.13980450970118,
        }}
        style={{ width: "100%", height: "80vh" }}
        level={3}
        onClick={(_t, mouseEvent) => {
          positionHandler(mouseEvent);
        }}
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
      <button onClick={() => setIsStart(!isStart)}>
        {isStart ? "도착 위치 변경" : "출발 위치 변경"}
      </button>
    </>
  );
}
