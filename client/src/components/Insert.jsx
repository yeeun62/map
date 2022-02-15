import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import axios from "axios";

export default function Insert() {
  // const [sePoint, setSePoint] = useState({ start: "", end: "" });
  const [address, setAddress] = useState("");
  const [open, setOpen] = useState(false);

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
    // let fullAddr = data.address;
    // let extraAddr = "";
    // setAddress(fullAddr);

    try {
      await axios
        .get(
          `https://v2/local/search/address.json`,
          { params: { query: data.address } },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Host: process.env.REACT_APP_HOST,
              Authorization:
                "KakaoAK " + process.env.REACT_APP_KAKAO_REST_API_KEY,
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res);
        });
    } catch (err) {
      console.log(err);
    }
    // let coord = await axios.get(
    //   `http://v2/local/search/address.json`,
    //   { params: { query: data.address } },
    //   {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //       Host: process.env.REACT_APP_HOST,
    //       Authorization: "KakaoAK " + process.env.REACT_APP_KAKAO_REST_API_KEY,
    //     },
    //     withCredentials: true,
    //   }
    // );
  }

  return (
    <div className="insertWrapper">
      {/* onSubmit={} */}
      <form>
        <label>
          출발지 입력
          <input
            className="start"
            placeholder="출발지를 입력해주세요"
            name="start"
            onFocus={() => setOpen(true)}
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
            onFocus={() => setOpen(true)}
          />
        </label>
      </form>

      {open ? (
        <>
          <DaumPostcode
            style={postCodeStyle}
            onComplete={handleComplete}
            autoClose
            animation={true}
          />
          {/* <p onClick={() => setOpen(false)}>X</p> */}
        </>
      ) : null}
    </div>
  );
}
