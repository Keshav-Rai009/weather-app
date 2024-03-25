import logo from "./logo.svg";
import "./App.css";
import UserLocation from "./components/UserLocation";
import BG2 from "./assets/BG1.jpg";

function App() {
  return (
    <>
      <div
        className="w-container"
        // style={{
        //   backgroundImage: `url(${BG2})`,
        //   width: "100%",
        //   float: "left",
        //   backgroundSize: "cover",
        //   position: "relative",
        //   // "background-position-x": "-30px",
        //   height: "80%",
        //   //"min-width": "965px",
        // }}
      >
        <UserLocation></UserLocation>
      </div>
      <div className="footer-info">
        <a href="https://github.com/Keshav-Rai009/weather-app.git">
          Download Source Code
        </a>{" "}
        | Developed by{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.linkedin.com/in/keshav-rai-3b6048199/"
        >
          Keshav Rai
        </a>{" "}
        | Powered by{" "}
        <a target="_blank" rel="noreferrer" href="https://react.dev/">
          React
        </a>
      </div>
    </>
  );
}

export default App;
