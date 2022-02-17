import React, { useState, useEffect } from "react";
import DaumPostcode from "react-daum-postcode";
import axios from "axios";
import "../style.css";

export default function Insert({
  setStartPosition,
  setEndPosition,
  address,
  setAddress,
  naviResult,
  isStart,
  setIsStart,
}) {
  const [open, setOpen] = useState({ boolean: false, point: null });
  const [isInsertOpen, setIsInsertOpen] = useState(true);

  const postCodeStyle = {
    display: "block",
    position: "absolute",
    top: "10%",
    right: "-400px",
    width: "400px",
    height: "500px",
    zIndex: 300,
  };

  async function handleComplete(data) {
    setOpen({ ...open, boolean: false });
    try {
      let getPosition = await axios.post(
        "http://localhost:80/position",
        { address: data.address },
        { withCredentials: true }
      );
      if (open.point === "start") {
        setAddress({ ...address, start: data.address });
        setStartPosition(getPosition.data.data);
      } else if (open.point === "end") {
        setAddress({ ...address, end: data.address });
        setEndPosition(getPosition.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="sidebar">
      <div
        className="insertWrapper"
        style={isInsertOpen ? { display: "block" } : { display: "none" }}
      >
        <form className="insertForm" onSubmit={(e) => e.preventDefault()}>
          <div className="formHeader">
            {/* <img src="./menubar.png" className="menuBtn" /> */}
            <h1 className="insertTitle logo">handle navigate</h1>
          </div>
          <div className="inputContainer">
            <label>
              출발지 입력
              <input
                className="start"
                placeholder="출발지를 입력해주세요"
                name="start"
                onFocus={() => setOpen({ boolean: true, point: "start" })}
                value={address.start}
                readOnly
              />
          </label>
          <label>
            도착지 입력
            <input
              className="end"
              placeholder="도착지를 입력해주세요"
              name="end"
              onFocus={() => setOpen({ boolean: true, point: "end" })}
              value={address.end}
              readOnly
            />
          </label>
        </div>
      </form>
      {open.boolean && (
        <>
          <p
            className="closeModal"
            onClick={() => setOpen({ ...open, boolean: false })}
          >
            X
          </p>
          <DaumPostcode style={postCodeStyle} onComplete={handleComplete} />
        </>
      )}
      <div className="naviResult">
        <div className="naviDuration">
          <h2>시간</h2>
          {naviResult.duration && <p>{naviResult.duration}</p>}
        </div>
        <div className="naviDistance">
          <h2>거리</h2>
          {naviResult.distance && <p>{naviResult.distance}</p>}
        </div>
      </div>
      <div
        className="isInsertOpen"
        style={
          isInsertOpen
            ? open.boolean
              ? { display: "none" }
              : { display: "block", left: "25rem" }
            : { left: "0" }
        }
        onClick={() => setIsInsertOpen(!isInsertOpen)}
      >
        {isInsertOpen ? "<" : ">"}
      </div>
    </div>
  );
}
