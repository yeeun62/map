import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import axios from "axios";

export default function Insert({
  startPosition,
  setStartPosition,
  endPosition,
  setEndPosition,
}) {
  const [open, setOpen] = useState({ boolean: false, point: null });

  const postCodeStyle = {
    display: "block",
    position: "absolute",
    top: "20%",
    width: "400px",
    height: "400px",
    padding: "7px",
    zIndex: 100,
  };

  async function handleComplete(data) {
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
      <form>
        <label>
          출발지 입력
          <input
            className="start"
            placeholder="출발지를 입력해주세요"
            name="start"
            onFocus={() => setOpen({ boolean: true, point: "start" })}
          />
        </label>
        <br />
        <br />
        <label>
          도착지 입력
          <input
            className="end"
            placeholder="도착지를 입력해주세요"
            name="end"
            onFocus={() => setOpen({ boolean: true, point: "end" })}
          />
        </label>
      </form>
      {open.boolean ? (
        <>
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
