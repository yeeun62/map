import React, { useState, useEffect } from "react";
import DaumPostcode from "react-daum-postcode";
import axios from "axios";
import "../css/insert.css";

export default function Insert({
  startPosition,
  endPosition,
  setStartPosition,
  setEndPosition,
  address,
  setAddress,
  naviResult,
  point,
  setPoint,
  drawPolyline,
  naviOption,
  setNaviOption,
  wayPointPosition,
  setWayPointPosition,
  map,
  bounds,
}) {
  const [postCodeOpen, setPostCodeOpen] = useState({
    boolean: false,
    point: null,
  });
  const [isInsertOpen, setIsInsertOpen] = useState(false);
  const [naviList, setNaviList] = useState(false);
  const [naviOptionName, setNaviOptionName] = useState("추천경로");
  const [wayPointCount, setWayPointCount] = useState([]);

  useEffect(() => {
    drawPolyline();
  }, [naviOption]);

  const postCodeStyle = {
    display: "block",
    position: "absolute",
    top: "6.8%",
    right: "-400px",
    width: "400px",
    height: "470px",
    zIndex: 1,
    border: "1px solid #999",
  };

  const findWay = () => {
    if (startPosition && endPosition) {
      drawPolyline();
      map.setBounds(bounds, 100, 50, 100, 400);
    } else {
      alert("출발지와 도착지를 선택해주세요!");
    }
  };

  async function handleComplete(data) {
    setPostCodeOpen({ ...postCodeOpen, boolean: false });
    try {
      let getPosition = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/navi/position`,
        { address: data.address },
        { withCredentials: true }
      );
      if (postCodeOpen.point === "start") {
        setAddress({ ...address, start: data.address });
        setStartPosition(getPosition.data.data);
      } else if (postCodeOpen.point === "end") {
        setAddress({ ...address, end: data.address });
        setEndPosition(getPosition.data.data);
      } else {
        setAddress({ ...address, [postCodeOpen.point]: data.address });
        setWayPointPosition({
          ...wayPointPosition,
          [postCodeOpen.point]: getPosition.data.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  function changePosition(num) {
    for (let i = Number(num); i <= 4; i++) {
      if (wayPointPosition[i]) {
        wayPointPosition[i] = wayPointPosition[i + 1];
        address[i] = address[i + 1];
      }
    }
    setWayPointPosition({ ...wayPointPosition, [5]: false });
    setAddress({
      ...address,
      [5]: "",
    });
  }

  return (
    <div className="sidebar">
      <div
        className="insertWrapper"
        style={isInsertOpen ? { display: "block" } : { display: "none" }}
      >
        <div className="insertTop">
          <h2 className="logo">handle</h2>
          <form className="insertForm" onSubmit={(e) => e.preventDefault()}>
            <label>
              <span>출발지 입력</span>
              <input
                placeholder="출발지를 입력해주세요"
                onFocus={() =>
                  setPostCodeOpen({ boolean: true, point: "start" })
                }
                value={address.start}
                readOnly
              />
              <button
                className="positionBtn"
                style={
                  point === "start"
                    ? { background: "#fe7364", color: "#fff" }
                    : { background: "none", color: "#fe7364" }
                }
                onClick={() => setPoint("start")}
              >
                출
              </button>
            </label>
            {wayPointCount &&
              wayPointCount.map((el, i) => {
                return (
                  <label key={el}>
                    <span>경유지 입력</span>
                    <input
                      placeholder="경유지를 입력해주세요"
                      onFocus={() =>
                        setPostCodeOpen({ boolean: true, point: el })
                      }
                      value={address[el]}
                      readOnly
                    />
                    <button
                      className="subTractWayPoint"
                      onClick={() => {
                        let countArr = [...wayPointCount];
                        countArr.pop();
                        setWayPointCount(countArr);
                        setPoint(null);
                        changePosition(el);
                      }}
                    >
                      -
                    </button>
                    <button
                      className="positionBtn"
                      name={el}
                      style={
                        point === el
                          ? { background: "#ddda29", color: "#fff" }
                          : { background: "none", color: "#ddda29" }
                      }
                      onClick={(e) => {
                        setPoint(Number(e.target.name));
                      }}
                    >
                      경
                    </button>
                  </label>
                );
              })}
            <label>
              <span>도착지 입력</span>
              <input
                placeholder="도착지를 입력해주세요"
                onFocus={() => setPostCodeOpen({ boolean: true, point: "end" })}
                value={address.end}
                readOnly
              />
              <button
                className="positionBtn"
                style={
                  point === "end"
                    ? { background: "#385cfb", color: "#fff" }
                    : { background: "none", color: "#385cfb" }
                }
                onClick={() => setPoint("end")}
              >
                도
              </button>
            </label>
            <div className="insertFormBtn">
              <button
                className="addWaypointBtn"
                onClick={() => {
                  if (wayPointCount.length < 5) {
                    let countArr = [...wayPointCount];
                    let counter;
                    wayPointCount.length
                      ? (counter = countArr.slice(-1)[0])
                      : (counter = 0);
                    counter += 1;
                    countArr.push(counter);
                    setWayPointCount(countArr);
                  } else {
                    alert("경유지는 5개까지 가능합니다!");
                  }
                }}
              >
                + 경유지
              </button>
              <button className="findWayBtn" onClick={findWay}>
                길찾기
              </button>
            </div>
          </form>
        </div>
        <div className="insertBottom">
          {naviResult ? (
            <>
              <div
                className="naviChoice"
                onClick={() => setNaviList(!naviList)}
              >
                <p>
                  {naviOptionName + " "}
                  <img
                    src={naviList ? "./up-arrow.png" : "./down-arrow.png"}
                    alt="화살표"
                    style={{ width: "1.2rem", verticalAlign: "middle" }}
                  />
                </p>
                {naviList && (
                  <ul className="naviList">
                    <li>
                      <a
                        href="#"
                        data-id="RECOMMEND"
                        onClick={(e) => {
                          setNaviOption(e.target.dataset.id);
                          setNaviOptionName(e.target.outerText);
                        }}
                      >
                        추천경로
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        data-id="TIME"
                        onClick={(e) => {
                          setNaviOption(e.target.dataset.id);
                          setNaviOptionName(e.target.outerText);
                        }}
                      >
                        최단시간
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        data-id="DISTANCE"
                        onClick={(e) => {
                          setNaviOption(e.target.dataset.id);
                          setNaviOptionName(e.target.outerText);
                        }}
                      >
                        최단경로
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        data-id="motorway"
                        onClick={(e) => {
                          setNaviOption(e.target.dataset.id);
                          setNaviOptionName(e.target.outerText);
                        }}
                      >
                        자동차전용도로
                      </a>
                    </li>
                  </ul>
                )}
              </div>
              <div className="naviInfo">
                <p className="duration">{naviResult.duration}</p>
                <p className="distance">{naviResult.distance}</p>
              </div>
            </>
          ) : (
            <div className="naviResultBefore">
              <p>🚗</p>어디로 떠나볼까요
            </div>
          )}
        </div>
      </div>
      <button
        className="insertBtn"
        style={
          isInsertOpen ? { display: "block", left: "25rem" } : { left: "0" }
        }
        onClick={() => setIsInsertOpen(!isInsertOpen)}
      >
        {isInsertOpen ? "<" : ">"}
      </button>
      {postCodeOpen.boolean && (
        <>
          <button
            className="closeModalBtn"
            onClick={() => setPostCodeOpen({ ...postCodeOpen, boolean: false })}
          >
            X
          </button>
          <DaumPostcode style={postCodeStyle} onComplete={handleComplete} />
        </>
      )}
    </div>
  );
}
