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

app.listen(80, () => console.log("네비서버"));