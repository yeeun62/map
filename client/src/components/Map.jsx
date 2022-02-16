import React, { useState } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import axios from "axios";

export default function MapContainer({
  startPosition,
  setStartPosition,
  endPosition,
  setEndPosition,
}) {
  const [map, setMap] = useState();
  const [linePosition, setLinePosition] = useState();
  const [isStart, setIsStart] = useState(false);
  // conole.log("!!", startPosition);
  // console.log("??", endPosition);

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

  // function getPosition(point) {
  //   console.log("실행");
  //   if (point === "end") {
  //     setEndPosition({
  //       lat: map.getCenter().getLat(),
  //       lng: map.getCenter().getLng(),
  //     });
  //   } else {
  //     console.log("!", map.getCenter().getLat());
  //     setStartPosition({
  //       ...startPosition,
  //       lat: map.getCenter().getLat(),
  //       lng: map.getCenter().getLng(),
  //     });
  //   }
  //   // drawPolyline();
  // }

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
    drawPolyline();
  }

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
      console.log(route.data.data.routes[0].sections);
      let linePosition = route.data.data.routes[0].sections[0].guides;
      let linePositionList = linePosition.map((el) => {
        return { lat: el.y, lng: el.x };
      });
      setLinePosition(linePositionList);
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
        onCreate={(map) => setMap(map)}
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
