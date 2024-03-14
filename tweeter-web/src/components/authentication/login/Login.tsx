import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, User } from "tweeter-shared";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../authenticationFields/AuthenticationFields";
import useUserInfo from "../../userInfo/UserInfoHook";
import { LoginPresenter } from "../../../presenter/LoginPresenter";
import { AuthView } from "../../../presenter/AuthPresenter";

interface Props {
  originalUrl?: string;
  presenterGenerator: (view: AuthView) => LoginPresenter;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { updateUserInfo } = useUserInfo();

  const { displayErrorMessage } = useToastListener();

  const rememberMeRef = useRef(rememberMe);
  rememberMeRef.current = rememberMe;

  const listener: AuthView = {
    displayErrorMessage: displayErrorMessage,
    navigate: useNavigate(),
    authenticate: (user: User, authtoken: AuthToken) => updateUserInfo(user, user, authtoken, rememberMeRef.current),
  };

  const [presenter] = useState(props.presenterGenerator(listener));

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const inputFieldGenerator = () => {
    return (
      <AuthenticationFields setAlias={setAlias} setPassword={setPassword} isBottomField={false} />
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      submit={() => presenter.authenticateUser(alias, password, props.originalUrl!)}
    />
  );
};

export default Login;
