import React, { Component } from "react";

import { init } from "onfido-sdk-ui";
import "onfido-sdk-ui/dist/style.css";

class OnfidoLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onfidoSdk: null,
      jwt: null,
      error: null,
      isModalOpen: false,
    };
  }

  componentDidMount() {
    if (process.env.REACT_APP_DEBUG_CONSOLE) {
      console.log("DEBUG: this.props", this.props);
    }
    getJwt().then(
      (jwt) => {
        this.setState({ jwt });
        // this.initializeSdk();
      },
      (reason) => {
        this.setState({
          error: reason.statusText,
        });
      }
    );
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
        <div>
          <h2>Identity verification</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <button type="button" onClick={() => this.openModal("onfido-mount")}>
            Start IDV
          </button>
        </div>
        <div id="onfido-mount"></div>
      </div>
    );
  }

  getSteps = () => {
    const steps = ["document"];
    return [
      {
        type: "welcome",
        options: {
          title: "Submit identity document",
          descriptions: [
            "To finish verifying your identity, we need an identity document.",
            "Please follow these steps to upload a document.",
          ],
        },
      },
      ...steps.map((step) => {
        if (step === "face") {
          return {
            type: "face",
            options: {
              requestedVariant: "video",
            },
          };
        }
        return step;
      }),
      {
        type: "complete",
        options: {
          message: "Upload complete!",
        },
      },
    ];
  };

  openModal(containerId) {
    this.destroy();

    return new Promise((res) => {
      this.onfidoHandler = init({
        token: this.token,
        containerId,
        useModal: true,
        isModalOpen: true,
        onModalRequestClose: () => {
          res({ type: "success", action: "modal_request_close" });
          this.closeModal();
        },
        onComplete: (data) => {
          res({ type: "success", action: "completed", data });
        },
        onError: (ex) => {
          res({ type: "error", exception: ex });
        },
      });
    });
  }

  closeModal() {
    console.log("close?");
    if (this.onfidoHandler) {
      console.log("close!");
      this.onfidoHandler.setOptions({ isModalOpen: false });
    }
  }

  destroy() {
    console.log("destroy?");
    if (this.onfidoHandler) {
      console.log("destroy!", this.onfidoHandler);
      this.onfidoHandler.tearDown();
    }
  }

  initializeSdk = () => {
    const customConfig = null;
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
            type: "welcome",
            options: { title: "Open your new bank account" },
          },
          "document",
          "face",
          "complete",
        ],
      };
      const config = customConfig ? customConfig : defaultConfig;
      this.setState({ onfidoSdk: init(config) });
    } else {
      return <div class="App-error">Error: Unable to initialize Onfido SDK</div>;
    }
  };
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
          statusText: request.statusText,
        });
      }
    };

    request.open("GET", url, true);
    request.setRequestHeader("Authorization", "BASIC " + process.env.REACT_APP_SDK_TOKEN_FACTORY_SECRET);
    request.send();
  });
};

export default OnfidoLoader;
