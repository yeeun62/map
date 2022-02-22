import React, { useEffect } from "react";
import { Map, MapMarker, Polyline, ZoomControl } from "react-kakao-maps-sdk";

export default function MapContainer({
  startPosition,
  setStartPosition,
  endPosition,
  setEndPosition,
  drawPolyline,
  linePosition,
  getAddress,
  currentLocation,
  point,
  wayPointPosition,
  setWayPointPosition,
}) {
  useEffect(() => {
    drawPolyline();
  }, [startPosition, endPosition, wayPointPosition]);

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
    let position = {
      lat: String(mouseEvent.latLng.getLat()),
      lng: String(mouseEvent.latLng.getLng()),
    };
    if (point === "start") {
      getAddress(
        mouseEvent.latLng.getLng(),
        mouseEvent.latLng.getLat(),
        "start"
      );
      setStartPosition(position);
    } else if (point === "end") {
      getAddress(mouseEvent.latLng.getLng(), mouseEvent.latLng.getLat(), "end");
      setEndPosition(position);
    } else {
      getAddress(mouseEvent.latLng.getLng(), mouseEvent.latLng.getLat(), point);
      setWayPointPosition({ ...wayPointPosition, [point]: position });
    }
  }

  return (
    <div>
      <Map
        center={currentLocation}
        level={3}
        onClick={(_t, mouseEvent) => {
          positionHandler(mouseEvent);
        }}
        style={{ width: "100%", height: "100vh" }}
      >
        <ZoomControl position={{ right: 10, top: 10 }} />
        {startPosition && (
          <MapMarker position={startPosition} image={startImage} />
        )}
        {endPosition && <MapMarker position={endPosition} image={endImage} />}
        {wayPointPosition.one && <MapMarker position={wayPointPosition.one} />}
        {wayPointPosition.two && <MapMarker position={wayPointPosition.two} />}
        {wayPointPosition.three && (
          <MapMarker position={wayPointPosition.three} />
        )}
        {wayPointPosition.four && (
          <MapMarker position={wayPointPosition.four} />
        )}
        {wayPointPosition.five && (
          <MapMarker position={wayPointPosition.five} />
        )}
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
