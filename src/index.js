import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const App = () => {
  return (
    <main>
      <h1>Adopt-a-Pet</h1>
      <ul>
        <li>pets go here</li>
      </ul>
      <button>Add a Pet</button>
    </main>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
