const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

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
    console.log(req.body.start);
    console.log("!", req.body.end);
    let navi = await axios.get(
      `https://apis-navi.kakaomobility.com/v1/directions?origin=${req.body.start}&destination=${req.body.end}`,
      {
        headers: {
          Authorization: "KakaoAK c08c1de5f67a02bb8fc6421fb3b5233c",
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

app.post("/coord", async (req, res) => {
  let query = req.body.query;
  console.log(req.body.query);
  try {
    let coord = await axios.get(
      `https:///v2/local/search/address.json?query=${query}`,
      {
        headers: { Authorization: "KakaoAK " + process.env.KAKAO_REST_API_KEY },
      },
      { withCredentials: true }
    );

    console.log(coord);
    if (coord.satus === 200) {
      res.status(200).json({ message: "성공" });
    } else {
      res.status(400).json({ message: "요청 실패" });
    }
  } catch (err) {
    //console.log(err, "에러");
    res.status(400).json({ message: "올바른 요청이 아닙니다" });
  }
});

app.listen(80, () => console.log("네비서버"));
