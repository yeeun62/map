import React, { useEffect } from "react";
import { Map, MapMarker, Polyline, ZoomControl } from "react-kakao-maps-sdk";
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
        <ZoomControl position={kakao.maps.ControlPosition.TOPRIGHT} />
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
    </div>
  );
}
