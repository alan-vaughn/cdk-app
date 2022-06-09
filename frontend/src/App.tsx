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

// NOTE: Right now these have to be manually toggled

// StagingAuthorizationStack.CognitoUserPoolId = us-east-1_2kTItzclp
// StagingAuthorizationStack.CognitoUserPoolWebClientId = 4cpsqk94f2io9vu9oq8aks4sae
// Staging API Endpoint: https://yhy1n74j62.execute-api.us-east-1.amazonaws.com/prod/

// ProdAuthorizationStack.CognitoUserPoolId = us-east-1_2xc9unjFE
// ProdAuthorizationStack.CognitoUserPoolWebClientId = 3e52fuh1oj40523mv6vljf0fjt
// ProdCdkAppStack.prodrestApiEndpointAAD788BA = https://p921vbrclg.execute-api.us-east-1.amazonaws.com/prod/

Amplify.configure({
  Auth: {
    region: "ap-northeast-1",
    userPoolId: "us-east-1_2xc9unjFE",
    userPoolWebClientId: "3e52fuh1oj40523mv6vljf0fjt",
  },
});

export const apiEndpoint =
  "https://p921vbrclg.execute-api.us-east-1.amazonaws.com/prod";

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
