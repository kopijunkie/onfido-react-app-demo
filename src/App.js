import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import OnfidoLoader from "./OnfidoLoader.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applicant: { id: "abc123" },
      locale: null
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <OnfidoLoader
            locale={this.state.locale}
            person={this.state.applicant}
            updatePerson={this.submitCheckOnComplete} />
        </header>
      </div>
    );
  }

  submitCheckOnComplete = (updatedPerson) => {
    console.log("* submit check for applicant:", updatedPerson);
    this.setState({ applicant: updatedPerson })
  }

}

export default App;
