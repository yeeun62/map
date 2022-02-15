import { useState } from "react";

export default function Insert() {
  const [sePoint, setSePoint] = useState({ start: "", end: "" });

  function insertHandler(e) {
    setSePoint({ ...sePoint, [e.target.name]: e.target.value });
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
            onChange={insertHandler}
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
            onChange={insertHandler}
          />
        </label>
      </form>
    </div>
  );
}
