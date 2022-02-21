const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
  })
);

app.get("/", (req, res) => {
  res.send("네비 서버");
});

function msToTime(duration) {
  let minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);
  if (hours === 0) {
    return `${minutes}분`;
  }
  return `${hours}시간 ${minutes}분`;
}

//! 길찾기
app.post("/navi", async (req, res) => {
  try {
    let navi = await axios.get(
      encodeURI(
        `https://apis-navi.kakaomobility.com/v1/directions?origin=${req.body.start}&destination=${req.body.end}&priority=${req.body.priority}`
      ),
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );
    if (navi.status === 200) {
      res.status(200).json({
        data: navi.data,
        route: {
          duration: msToTime(navi.data.routes[0].sections[0].duration * 1000),
          distance: `${navi.data.routes[0].sections[0].distance / 1000}km`,
        },
      });
    } else {
      res.status(500).json({ message: "에러에러" });
    }
  } catch (err) {
    console.log(err.response);
  }
});

//! 선 그리기 좌표
app.post("/position", async (req, res) => {
  try {
    let position = await axios.get(
      encodeURI(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${req.body.address}`
      ),
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );
    let data = {
      lat: Number(position.data.documents[0].y),
      lng: Number(position.data.documents[0].x),
    };
    res.status(200).json({ data });
  } catch (err) {
    console.log(err.response);
  }
});

//! 좌표를 행정구역으로 변환
app.post("/coord", async (req, res) => {
  try {
    let coord = await axios.get(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${req.body.lng}&y=${req.body.lat}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );
    res.status(200).json({ address: coord.data.documents[0].address_name });
  } catch (err) {
    console.log(err.response);
  }
});

app.listen(80, () => console.log("네비서버"));
