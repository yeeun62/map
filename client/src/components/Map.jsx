import React, { useState } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import axios from "axios";

export default function MapContainer() {
  const [map, setMap] = useState();
  const [startPosition, setStartPosition] = useState({
    lat: 33.450701,
    lng: 126.570667,
  });
  const [endPosition, setEndPosition] = useState({
    lat: 33.450701,
    lng: 126.572667,
  });
  const [linePosition, setLinePosition] = useState();
  // console.log("!!", startPosition);
  // console.log("??", endPosition);
  // console.log("~~", linePosition);
  const [isStart, setIsStart] = useState(true);

  const startImage = {
    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png",
    size: [50, 45],
    options: {
      offset: [15, 43],
    },
  };

  const startDragImage = {
    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_drag.png",
    size: [50, 64],
    options: {
      offset: [15, 54],
    },
  };

  const endImage = {
    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_b.png",
    size: [50, 45],
    options: {
      offset: [15, 43],
    },
  };

  const endDragImage = {
    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_drag.png",
    size: [50, 64],
    options: {
      offset: [15, 54],
    },
  };
  const [start, setStart] = useState(startImage);
  const [end, setEnd] = useState(endImage);

  function getPosition(point) {
    if (point === "end") {
      setEndPosition({
        lat: map.getCenter().getLat(),
        lng: map.getCenter().getLng(),
      });
    } else {
      setStartPosition({
        lat: map.getCenter().getLat(),
        lng: map.getCenter().getLng(),
      });
    }
    drawPolyline();
  }

  function positionHandler(mouseEvent) {
    let obj = {
      lat: mouseEvent.latLng.Ma,
      lng: mouseEvent.latLng.La,
    };
    if (isStart) {
      setStartPosition(obj, () => {
        return drawPolyline();
      });
    } else {
      setEndPosition(obj, drawPolyline());
      setEndPosition(obj, drawPolyline());
    }
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
      console.log(route.data.data);
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
          lat: 33.450701,
          lng: 126.570667,
        }}
        style={{ width: "100%", height: "50vh" }}
        level={3}
        onCreate={(map) => setMap(map)}
        onClick={(_t, mouseEvent) => {
          positionHandler(mouseEvent);
        }}
      >
        <MapMarker
          position={startPosition}
          image={start}
          // draggable={true}
          // onDragStart={() => setStart(startDragImage)}
          // onDragEnd={(e) => {
          //   console.log(e);
          //   setStart(startImage);
          //   getPosition();
          // }}
        />
        <MapMarker
          position={endPosition}
          image={end}
          // draggable={true}
          // onDragStart={() => setEnd(endDragImage)}
          // onDragEnd={() => {
          //   setEnd(endImage);
          //   getPosition("end");
          // }}
        />
        {linePosition && (
          <Polyline
            path={linePosition}
            strokeWeight={5} // 선의 두께 입니다
            strokeColor={"#ff23cf"} // 선의 색깔입니다
            strokeOpacity={0.7} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle={"solid"} // 선의 스타일입니다
          />
        )}
      </Map>
      <button onClick={() => setIsStart(!isStart)}>
        {isStart ? "도착 위치 변경" : "출발 위치 변경"}
      </button>
    </>
  );
}
