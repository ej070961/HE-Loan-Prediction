import { useState } from "react";
import * as A from "./app.style";
import HomeContent from "./HomeContent";
import PredictContent from "./PredictContent";
function App() {
  const [selectedMenu, setSelectedMenu] = useState("Home");

  const handleMenuChange = (event) => {
    setSelectedMenu(event.target.value);
  };
  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
      <A.Navigation>
        <div className="nav-wrapper">
          <span className="title">Navigation</span>
          <span style={{ marginTop: "15px" }}>Go to</span>
          <br />
          <div className="button-wrapper">
            <input
              type="radio"
              label="Home"
              name="radiobtn"
              value="Home"
              checked={selectedMenu === "Home"}
              onChange={handleMenuChange}
            />
            <label>Home</label>
          </div>
          <div className="button-wrapper">
            <input
              type="radio"
              label="Borrower Details"
              name="radiobtn"
              value="Borrower Details"
              checked={selectedMenu === "Borrower Details"}
              onChange={handleMenuChange}
            />
            <label>Predict</label>
          </div>
        </div>
      </A.Navigation>
      <div style={{ width: "100%" }}>
        {selectedMenu === "Home" && <HomeContent />}
        {selectedMenu === "Borrower Details" && <PredictContent />}
      </div>
    </div>
  );
}

export default App;
