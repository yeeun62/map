import React, { useState } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";

// const options = {
//   //지도를 생성할 때 필요한 기본 옵션
//   center: new window.kakao.maps.LatLng(37.544697, 127.055371), //지도의 중심좌표.
//   level: 3, //지도의 레벨(확대, 축소 정도)
// };

export default function MapContainer() {
  const [location, setLocation] = useState({ x: "", y: "" });

  return (
    <Map
      center={{ lat: 33.5563, lng: 126.79581 }}
      style={{ width: "100%", height: "360px" }}
    >
      <MapMarker position={{ lat: 33.55635, lng: 126.795841 }} draggable={true}>
        <div style={{ color: "#000" }}>Hello World!</div>
      </MapMarker>
      <Polyline
        path={[
          [
            { lat: 33.452344169439975, lng: 126.56878163224233 },
            { lat: 33.452739313807456, lng: 126.5709308145358 },
            { lat: 33.45178067090639, lng: 126.572688693875 },
          ],
        ]}
        strokeWeight={5} // 선의 두께 입니다
        strokeColor={"#FFAE00"} // 선의 색깔입니다
        strokeOpacity={0.7} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle={"solid"} // 선의 스타일입니다
      />
    </Map>
  );
}
