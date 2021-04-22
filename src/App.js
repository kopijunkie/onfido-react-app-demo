import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import OnfidoLoader from "./OnfidoLoader.js";

class App extends Component {
  render() {
    return (
      <div className="App">
        <OnfidoLoader />
      </div>
    );
  }
}

export default App;
