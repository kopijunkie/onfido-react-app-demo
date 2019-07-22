import React, { Component } from 'react';

// FIXME
// import { init } from 'onfido-sdk-ui';

import * as Onfido from "onfido-sdk-ui/dist/onfido.min.js";
import "onfido-sdk-ui/dist/style.css";

class OnfidoLoader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            onfidoSdk: null,
            jwtToken: null,
            error: null
        }
    }

    componentDidMount() {
        getJwtToken().then(jwtToken => {
            this.initializeSdk(jwtToken);
        }, reason => {
            this.setState({
                error: reason.statusText
            });
        });
    }

    componentWillUnmount() {
        if (this.state.onfidoSdk) {
            this.state.onfidoSdk.tearDown();
        }
    }

    render() {
        return (
            <div className="onfido-container">
                <div>{this.state.error}</div>
                <div id="onfido-mount"></div>
            </div>
        );
    }

    initializeSdk = (jwtToken) => {
        if (Onfido && jwtToken) {
            const onfidoSdk = Onfido.init({
                useModal: false,
                token: jwtToken,
                onComplete: (data) => {
                    // callback for when everything is complete
                    console.log("Everything is complete", data);
                },
                steps: [
                {
                    type:'welcome',
                    options:{ title:'Open your new bank account' }
                },
                    'document',
                    'face',
                    'complete'
                ]
            });
            this.setState({
                onfidoSdk,
                jwtToken
            });
        } else {
            return <div>Unable to initialize Onfido SDK</div>
        }
    }

}

const getJwtToken = () => {
    const url = "https://token-factory.onfido.com/sdk_token";
    const request = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        request.onreadystatechange = () => {
			// Only run if the request is complete
			if (request.readyState !== 4) {
                return;
            }

            // Process the response
			if (request.status >= 200 && request.status < 300) {
                // Success
                try {
                    const data = JSON.parse(request.responseText);
                    const jwtToken = data.message;
                    resolve(jwtToken);
                } catch {
                    reject({
                        statusText: "Failed to retrieve JWT token"
                    });
                }
			} else {
                // Failed
				reject({
					status: request.status,
					statusText: request.statusText
				});
			}
        };

        request.open("GET", url, true);
        request.send();
    });
}

export default OnfidoLoader;
