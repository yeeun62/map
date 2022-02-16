import React, { useState, useEffect } from "react";
import DaumPostcode from "react-daum-postcode";
import axios from "axios";
import "../style.css";

export default function Insert({
  startPosition,
  endPosition,
  setStartPosition,
  setEndPosition,
  drawPolyline,
  address,
  setAddress,
}) {
  const [open, setOpen] = useState({ boolean: false, point: null });

  useEffect(() => {
    drawPolyline();
  }, [startPosition, endPosition]);

  const postCodeStyle = {
    display: "block",
    position: "absolute",
    top: "10%",
    right: "-400px",
    width: "400px",
    height: "500px",
    zIndex: 100,
  };

  async function handleComplete(data) {
    try {
      setOpen({ ...open, boolean: false });
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
    <div className="insertWrapper">
      <form className="insertForm" onSubmit={(e) => e.preventDefault()}>
        <div className="formHeader">
          <img src="./menubar.png" className="menuBtn" />
          <h1 className="insertTitle logo">handle</h1>
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
          <DaumPostcode
            style={postCodeStyle}
            onComplete={handleComplete}
            autoClose
          />
        </>
      )}
      <div style={{ background: "#fff", width: "100%", height: "100%" }}></div>
    </div>
  );
}
