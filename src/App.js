import "./App.css";
import { Container } from "@mui/system";
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useLocation } from "react-router-dom";
import auth0 from "auth0-js";
import GoogleIcon from "@mui/icons-material/Google";

function App() {
  const [tabIndex, setTabIndex] = useState("1");
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorUser, setErrorUser] = useState({
    error: "incorrect username and password",
  });
  const [noUser, setNoUser] = useState(false);
  const [userData, setUserData] = useState({});
  const userName = useRef("");
  const userPassword = useRef("");
  const signupName = useRef("");
  const signupEmail = useRef("");
  const signupPassword = useRef("");
  const forgotPassword = useRef("");
  const location = useLocation();

  // mui Tab Toggle
  const toggleTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  // domain: "yourDomainFromAuth0",
  // clientID: "yourClientIdFromAuth0",

  // auth0 Setup
  const webAuth = new auth0.WebAuth({
    domain: "yourdomain.us.auth0.com",
    clientID: "yourClientID",
    responseType: "token id_token",
    redirectUri: "http://localhost:3001",
  });
  const databaseConnection = "Username-Password-Authentication";

  // auth0 Login handler
  const loginHandler = (username, password) => {
    webAuth.login(
      {
        realm: databaseConnection,
        email: username,
        password: password,
      },
      function (err) {
        if (err) {
          console.log(err);
          setErrorUser({
            error: "Username or password is incorrect",
          });
          setErrorAlert(true);
        }
      }
    );
  };

  // auth0 login
  const loginSubmit = (event) => {
    event.preventDefault();
    let userInput = userName.current.value;
    let passwordInput = userPassword.current.value.trim();
    if (userInput.length === 0) {
      setErrorUser({
        error: "Please enter email",
      });
      setErrorAlert(true);
    }
    if (passwordInput.length === 0) {
      setErrorUser({
        error: "Please enter password",
      });
      setErrorAlert(true);
    }
    if (userInput.length === 0 && passwordInput.length === 0) {
      setErrorUser({
        error: "Please enter username and Password",
      });
      setErrorAlert(true);
    } else {
      loginHandler(userInput, passwordInput);
    }
  };

  // auth0 Signup
  const signupSubmit = (e) => {
    e.preventDefault();
    let nameInput = signupName.current.value;
    let emailInput = signupEmail.current.value.trim().toLowerCase();
    let passwordInput = signupPassword.current.value.trim();
    let hasNumber = /\d/;
    let hasSpecialCharacter = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let validEmail =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (
      nameInput.length === 0 &&
      emailInput.length === 0 &&
      passwordInput.length === 0
    ) {
      setErrorUser({
        error: "please fill the form",
      });
      setErrorAlert(true);
    } else if (nameInput.length === 0) {
      setErrorUser({
        error: "please enter Username",
      });
      setErrorAlert(true);
    } else if (emailInput.length === 0) {
      setErrorUser({
        error: "please enter Email",
      });
      setErrorAlert(true);
    } else if (!emailInput.match(validEmail)) {
      setErrorUser({
        error: "please enter valid Email ID",
      });
      setErrorAlert(true);
    } else if (
      passwordInput.length < 8 ||
      !hasNumber.test(passwordInput) ||
      !hasSpecialCharacter.test(passwordInput)
    ) {
      console.log("i am in");
      setErrorUser({
        error:
          "Password must contain 8 characters, 1 Capital Letter, 1 Number and 1 Special character",
      });
      setErrorAlert(true);
    } else {
      webAuth.signup(
        {
          connection: databaseConnection,
          email: emailInput,
          username: nameInput,
          password: passwordInput,
          user_metadata: { plan: "silver", team_id: "a111" },
        },
        function (err) {
          if (err) {
            setErrorUser({
              error: "username or email already exist",
            });
            setErrorAlert(true);
            console.log(err.message);
          } else {
            loginHandler(emailInput, passwordInput);
          }
        }
      );
      setErrorAlert(false);
    }
  };

  // auth0 forgotPassword
  const forgotPasswordHandler = () => {
    let forgotPasswordInput = forgotPassword.current.value;
    webAuth.changePassword(
      {
        connection: databaseConnection,
        email: forgotPasswordInput,
      },
      function (err, resp) {
        if (err) {
          console.log(err.message);
        } else {
          console.log(resp);
        }
      }
    );
  };

  // auth0 google signup
  const googleSignUp = () => {
    webAuth.authorize(
      {
        responseType: "token",
        connection: "google",
      },
      function (err, authResult) {
        if (err) console.log(err);
        if (authResult) console.log(authResult);
      }
    );
  };

  // running useEffect to get the data of user after login
  useEffect(() => {
    // user details accessing from auth0
    if (location.hash.length > 0 && location.pathname === "/") {
      webAuth.parseHash(
        { hash: window.location.hash },
        function (err, authResult) {
          if (err) {
            return console.log(err);
          }
          if (authResult?.accessToken != null) {
            webAuth.client.userInfo(
              authResult?.accessToken,
              function (err, user) {
                if (user) {
                  setUserData(user);
                  setNoUser(true);
                }
              }
            );
          }
        }
      );
    }
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome, this is auth0 Custom Login</p>
        <Container maxWidth="sm">
          <Grid item xs={12}>
            <h1>
              User Email: {noUser ? userData.email : "login to get email"}
            </h1>
            <TabContext value={tabIndex}>
              <div className="logForCon">
                <Box className="loginForm">
                  <TabList onChange={toggleTab}>
                    <Tab label="Login" value="1" />
                    <Tab label="SignUp" value="2" />
                    <Tab label="Forgot Password" value="3" />
                  </TabList>
                  <TabPanel value="3">
                    <label>User Email:</label>
                    <TextField
                      name="username"
                      fullWidth
                      inputRef={forgotPassword}
                    />
                    <Button
                      variant="contained"
                      onClick={forgotPasswordHandler}
                      fullWidth
                    >
                      Send password email
                    </Button>
                  </TabPanel>
                  <TabPanel value="1">
                    {errorAlert && (
                      <Alert
                        severity="error"
                        action={
                          <IconButton
                            aria-label="close"
                            color="error"
                            size="small"
                            onClick={() => {
                              setErrorAlert(false);
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        }
                        sx={{ mb: 2 }}
                      >
                        {errorUser.error}
                      </Alert>
                    )}
                    <label>User Name Email:</label>
                    <TextField name="username" fullWidth inputRef={userName} />

                    <label>Password:</label>
                    <TextField
                      name="passowrd"
                      type="password"
                      fullWidth
                      inputRef={userPassword}
                    />
                    <Button
                      onClick={loginSubmit}
                      variant="contained"
                      size="large"
                      fullWidth
                    >
                      Sign in
                    </Button>
                    <p className="lfThirLog">Or log in with</p>
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      spacing={5}
                      width="100%"
                      pt={2}
                    >
                      <IconButton onClick={googleSignUp}>
                        <GoogleIcon />
                      </IconButton>
                    </Stack>
                  </TabPanel>
                  <TabPanel value="2">
                    {errorAlert && (
                      <Alert
                        severity="error"
                        action={
                          <IconButton
                            aria-label="close"
                            color="error"
                            size="small"
                            onClick={() => {
                              setErrorAlert(false);
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        }
                        sx={{ mb: 2 }}
                      >
                        {errorUser.error}
                      </Alert>
                    )}
                    <label>Your Name:</label>
                    <TextField
                      name="signupname"
                      fullWidth
                      inputRef={signupName}
                    />
                    <label>Your Email:</label>
                    <TextField
                      name="signupname"
                      type="email"
                      fullWidth
                      inputRef={signupEmail}
                    />

                    <label>Password:</label>
                    <TextField
                      name="passowrd"
                      type="password"
                      fullWidth
                      inputRef={signupPassword}
                    />
                    <Button
                      onClick={signupSubmit}
                      variant="contained"
                      fullWidth
                      size="large"
                    >
                      SignUp
                    </Button>
                  </TabPanel>
                </Box>
              </div>
            </TabContext>
          </Grid>
        </Container>
      </header>
    </div>
  );
}

export default App;
