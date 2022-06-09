import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import Amplify from "aws-amplify";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import {
  AmplifyAuthContainer,
  AmplifyAuthenticator,
  AmplifySignIn,
} from "@aws-amplify/ui-react";
import { BalancesPage } from "./BalancesPage";

// StagingAuthorizationStack.CognitoUserPoolId = us-east-1_2kTItzclp
// StagingAuthorizationStack.CognitoUserPoolWebClientId = 4cpsqk94f2io9vu9oq8aks4sae
// Staging API Endpoint: https://yhy1n74j62.execute-api.us-east-1.amazonaws.com/prod/

Amplify.configure({
  Auth: {
    region: "ap-northeast-1",
    userPoolId: "us-east-1_2kTItzclp", // Please change this value.
    userPoolWebClientId: "4cpsqk94f2io9vu9oq8aks4sae", // Please change this value.
  },
});

export const apiEndpoint =
  "https://g25mo4z2c4.execute-api.us-east-1.amazonaws.com/prod"; // Please change this value. (Don't include '/api')

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>();
  const [user, setUser] = useState<object | undefined>();

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <div className="App">
      <BalancesPage />
    </div>
  ) : (
    <AmplifyAuthContainer>
      <AmplifyAuthenticator>
        <AmplifySignIn slot="sign-in" hideSignUp={true} />
      </AmplifyAuthenticator>
    </AmplifyAuthContainer>
  );
};

export default App;
