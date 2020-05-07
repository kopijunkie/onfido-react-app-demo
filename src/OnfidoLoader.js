import React, { Component } from 'react';

import { init } from "onfido-sdk-ui";
import "onfido-sdk-ui/dist/style.css";

class OnfidoLoader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            onfidoSdk: null,
            jwt: null,
            error: null
        }
    }

    componentDidMount() {
        if (process.env.REACT_APP_DEBUG_CONSOLE) {
            console.log('DEBUG: this.props',this.props);
        }
        getJwt().then(jwt => {
            this.setState({ jwt })
            this.initializeSdk();
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

    initializeSdk = () => {
        const customConfig = {
          useModal: false,
          token: this.state.jwt,
          onComplete: (data) => {
            if (process.env.REACT_APP_DEBUG_CONSOLE) {
              console.log('DEBUG: SDK data at onComplete:',data);
            }
            this.props.updatePerson({
              person: {
                onfido_document_id_1: data.document_front.id,
                onfido_document_id_2: data.document_back ? data.document_back.id : null,
                ...this.props.person,
              },
            });
          },
          steps: [
            {
              type: 'welcome',
              options: {
                title: "Welcome",
                descriptions: ["Sample"],
              },
            },
            {
              type: 'document',
              options: {
                documentTypes: {
                  passport: true,
                  driving_licence: this.props.locale === 'new-york',
                },
              },
            },
              'complete',
            ],
        };
        if (this.state.jwt) {
            const defaultConfig = {
                useModal: false,
                token: this.state.jwt,
                onComplete: (data) => {
                    // callback for when everything is complete
                    console.log("Everything is complete", data);
                },
                steps: [
                {
                    type:'welcome',
                    options: { title: 'Open your new bank account' }
                },
                    'document',
                    'face',
                    'complete'
                ]
            }
            const config = customConfig ? customConfig : defaultConfig;
            this.setState({ onfidoSdk: init(config) });
        } else {
            return <div class="App-error">Error: Unable to initialize Onfido SDK</div>
        }
    }

}

const getJwt = () => {
    // NOTE: SDK token factory is an internal service
    //       all photos uploaded using a token factory JWT will end up in a dummy client account
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
                    const jwt = data.message;
                    resolve(jwt);
                } catch {
                    reject({ statusText: "Failed to retrieve JWT" });
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
        request.setRequestHeader('Authorization', 'BASIC ' + process.env.REACT_APP_SDK_TOKEN_FACTORY_SECRET);
        request.send();
    });
}

export default OnfidoLoader;
