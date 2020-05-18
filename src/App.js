import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
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
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Onfido React Sample App</h2>
            <nav>
              <ul className="App-links">
                <li className="App-link"><Link to="/">Home</Link></li>
                <li className="App-link"><Link to="/identity">Identity Check</Link></li>
                <li className="App-link"><Link to="/about">About</Link></li>
              </ul>
            </nav>

            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/identity">
                <OnfidoLoader
                  locale={this.state.locale}
                  person={this.state.applicant}
                  updatePerson={this.submitCheckOnComplete} />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </header>
        </div>
      </Router>
    );
  }

  submitCheckOnComplete = (updatedPerson) => {
    console.log("* submit check for applicant:", updatedPerson);
    this.setState({ applicant: updatedPerson })
  }

}

const Home = () => <div><h2>Home</h2><p>Content for Home page</p></div>;
const About = () => <div><h2>About</h2><p>Content for About page</p></div>;
// const Identity = () => <div><h2>Identity Check</h2><p>Page with Onfido SDK</p></div>;

export default App;
