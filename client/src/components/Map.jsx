import React, { useState } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import axios from "axios";

export default function MapContainer() {
  const [map, setMap] = useState();
  const [startPosition, setStartPosition] = useState();
  const [endPosition, setEndPosition] = useState();
  const [linePosition, setLinePosition] = useState();
  // console.log("!!", startPosition);
  // console.log("??", endPosition);
  // console.log("~~", linePosition);

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
    <Map
      center={{
        lat: 33.450701,
        lng: 126.570667,
      }}
      style={{ width: "100%", height: "100vh" }}
      level={3}
      onCreate={(map) => setMap(map)}
    >
      <MapMarker
        position={{
          lat: 33.450701,
          lng: 126.570667,
        }}
        image={start}
        draggable={true}
        onDragStart={() => setStart(startDragImage)}
        onDragEnd={() => {
          setStart(startImage);
          getPosition();
        }}
      />
      <MapMarker
        position={{
          lat: 33.450701,
          lng: 126.572667,
        }}
        image={end}
        draggable={true}
        onDragStart={() => setEnd(endDragImage)}
        onDragEnd={() => {
          setEnd(endImage);
          getPosition("end");
        }}
      />
      {linePosition && (
        <Polyline
          path={linePosition}
          // path={[
          //   [
          //     { lat: 33.450701290001874, lng: 126.57114003106764 },
          //     { lat: 33.4500702984696, lng: 126.57115037951364 },
          //     { lat: 33.448935966849774, lng: 126.57051292434296 },
          //   ],
          // ]}
          strokeWeight={5} // 선의 두께 입니다
          strokeColor={"#ff23cf"} // 선의 색깔입니다
          strokeOpacity={0.7} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle={"solid"} // 선의 스타일입니다
        />
      )}
    </Map>
  );
}
