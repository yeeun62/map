import React, { useEffect, useState, useMemo } from "react";
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
  const { kakao } = window;
  const [map, setMap] = useState();

  useEffect(() => {
    drawPolyline();
    if (map && startPosition && endPosition)
      map.setBounds(bounds, 100, 50, 100, 400);
  }, [startPosition, endPosition, wayPointPosition]);

  const startImage = {
    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png",
    size: [50, 45],
    options: {
      offset: { x: 15, y: 43 },
    },
  };

  const endImage = {
    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_b.png",
    size: [50, 45],
    options: {
      offset: { x: 15, y: 43 },
    },
  };

  function positionHandler(mouseEvent) {
    let position = {
      lat: String(mouseEvent.latLng.getLat()),
      lng: String(mouseEvent.latLng.getLng()),
    };
    if (point === null) {
      return;
    } else {
      getAddress(mouseEvent.latLng.getLng(), mouseEvent.latLng.getLat(), point);
      if (point === "start") {
        setStartPosition(position);
      } else if (point === "end") {
        setEndPosition(position);
      } else {
        setWayPointPosition({ ...wayPointPosition, [point]: position });
      }
    }
  }

  const bounds = useMemo(() => {
    if (startPosition && endPosition) {
      const bounds = new kakao.maps.LatLngBounds();
      let points = [startPosition, endPosition];

      points.forEach((point) => {
        bounds.extend(new kakao.maps.LatLng(point.lat, point.lng));
      });

      return bounds;
    }
  }, [startPosition, endPosition, wayPointPosition]);

  return (
    <div>
      <Map
        center={currentLocation}
        level={6}
        onClick={(_t, mouseEvent) => {
          positionHandler(mouseEvent);
        }}
        style={{ width: "100%", height: "100vh" }}
        onCreate={setMap}
      >
        <ZoomControl position={{ right: 10, top: 10 }} />
        {startPosition && (
          <MapMarker position={startPosition} image={startImage} />
        )}
        {endPosition && <MapMarker position={endPosition} image={endImage} />}
        {wayPointPosition[1] && <MapMarker position={wayPointPosition[1]} />}
        {wayPointPosition[2] && <MapMarker position={wayPointPosition[2]} />}
        {wayPointPosition[3] && <MapMarker position={wayPointPosition[3]} />}
        {wayPointPosition[4] && <MapMarker position={wayPointPosition[4]} />}
        {wayPointPosition[5] && <MapMarker position={wayPointPosition[5]} />}
        {linePosition && (
          <Polyline
            path={linePosition}
            strokeWeight={5}
            strokeColor="#ff23cf"
            strokeOpacity={0.7}
            strokeStyle="solid"
          />
        )}
      </Map>
    </div>
  );
}
