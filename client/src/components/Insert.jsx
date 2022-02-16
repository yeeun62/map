import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import axios from "axios";
import "../style.css";

export default function Insert({
  startPosition,
  setStartPosition,
  endPosition,
  setEndPosition,
}) {
  const [open, setOpen] = useState({ boolean: false, point: null });
  const [address, setAddress] = useState({ start: "", end: "" });

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
    setAddress(data.address);
    try {
      let getPosition = await axios.post(
        "http://localhost:80/position",
        { address: data.address },
        { withCredentials: true }
      );
      if (open.point === "start") {
        setStartPosition(getPosition.data.data);
      } else if (open.point === "end") {
        console.log("!!");
        setEndPosition(getPosition.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="insertWrapper">
      <form className="insertForm">
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
            />
          </label>
        </div>
      </form>
      {open.boolean ? (
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
      ) : null}
    </div>
  );
}
