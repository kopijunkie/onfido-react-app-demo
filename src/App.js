import React from 'react';
import logo from './logo.svg';
import './App.css';

import OnfidoLoader from './OnfidoLoader.js';

const App = () => (
    <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <OnfidoLoader />
        </header>
    </div>
);

export default App;
