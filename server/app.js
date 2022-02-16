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

app.post("/navi", async (req, res) => {
  try {
    console.log("?", req.body.start);
    // console.log("!", req.body.end);
    let navi = await axios.get(
      `https://apis-navi.kakaomobility.com/v1/directions?origin=${req.body.start}&destination=${req.body.end}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );
    if (navi.status === 200) {
      res.status(200).json({ data: navi.data });
    } else {
      res.status(500).json({ message: "에러에러" });
    }
  } catch (err) {
    console.log(err.response);
  }
});

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
      lan: Number(position.data.documents[0].x),
    };
    res.status(200).json({ data });
  } catch (err) {
    console.log(err.response);
  }
});

app.listen(80, () => console.log("네비서버"));
