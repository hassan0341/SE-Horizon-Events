import { useState } from "react";
import "../CSS/AuthForm.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [role, setRole] = useState("Regular User");
  const [roleErr, setRoleErr] = useState("");
  const [regUsernameErr, setRegUsernameErr] = useState("");
  const [regEmailErr, setRegEmailErr] = useState("");
  const [regPasswordErr, setRegPasswordErr] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [signUpError, setSignUpError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegEmailErr("");
    setRegPasswordErr("");
    setRegUsernameErr("");
    setRoleErr("");
    setSignUpError("");
    setLoading(true);

    if (!regUsername) {
      setRegUsernameErr("Username is required");
      setLoading(false);
      return;
    }

    if (!regEmail) {
      setRegEmailErr("Email is required");
      setLoading(false);
      return;
    }

    if (!regPassword) {
      setRegPasswordErr("Password is required");
      setLoading(false);
      return;
    }

    if (!role) {
      setRoleErr("A role is required");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          username: regUsername,
          role: role,
          signedUpEvents: [],
        });
      }
      navigate("/");
    } catch (error) {
      if (error.code === "auth/weak-password") {
        setRegPasswordErr(error.message);
      } else {
        setSignUpError(error.code);
        console.log(error.code);
      }
    }
    setLoading(false);
  };

  const handleRegUsernameChange = (e) => {
    setRegUsername(e.target.value);
    if (regUsernameErr) {
      setRegUsernameErr("");
    }
  };

  const handleRegEmailChange = (e) => {
    setRegEmail(e.target.value);
    if (regEmailErr) {
      setRegEmailErr("");
    }
  };

  const handleRegPasswordChange = (e) => {
    setRegPassword(e.target.value);
    if (regPasswordErr) {
      setRegPasswordErr("");
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    if (roleErr) {
      setRoleErr("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setLoginError("");
    setLoading(true);

    if (!email) {
      setEmailError("Email is required");
      setLoading(false);
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        setLoginError(
          "Invalid credentials. Please check your email and password."
        );
      } else if (error.code === "auth/invalid-email") {
        setEmailError("Invalid Email format");
      } else if (error.code === "auth/missing-password") {
        setPasswordError("Incorrect password.");
      } else {
        console.error(error.message);
      }
    }
    setLoading(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setPasswordError("");
    }
    setLoginError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError("");
    }
    setLoginError("");
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-toggle">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="form">
              <h2>Login Form</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && <p className="error-text">{emailError}</p>}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              {passwordError && <p className="error-text">{passwordError}</p>}
              <button>{loading ? "Loading..." : "Login"}</button>
              {loginError && <p className="error-text">{loginError}</p>}
              <p>
                Not a Member?{" "}
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up now
                </a>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form">
              <h2>Sign Up Form</h2>
              <div className="role-selection">
                <p>Register as a: {role}</p>
                <label>
                  <input
                    type="radio"
                    value="Regular User"
                    checked={role === "Regular User"}
                    onChange={handleRoleChange}
                  />
                  Regular User
                </label>
                <label>
                  <input
                    type="radio"
                    value="Staff Member"
                    checked={role === "Staff Member"}
                    onChange={handleRoleChange}
                  />
                  Staff Member
                </label>
                {roleErr && <p className="error-text">{roleErr}</p>}
              </div>
              <input
                type="text"
                placeholder="Username"
                value={regUsername}
                onChange={handleRegUsernameChange}
              />
              {regUsernameErr && <p className="error-text">{regUsernameErr}</p>}

              <input
                type="email"
                placeholder="Email"
                value={regEmail}
                onChange={handleRegEmailChange}
              />
              {regEmailErr && <p className="error-text">{regEmailErr}</p>}
              <input
                type="password"
                placeholder="Password"
                value={regPassword}
                onChange={handleRegPasswordChange}
              />
              {regPasswordErr && <p className="error-text">{regPasswordErr}</p>}
              <button>{loading ? "Loading..." : "Sign Up"}</button>

              <p>
                Already a member?{" "}
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsLogin(true)}
                >
                  Login now
                </a>
              </p>
              {signUpError && (
                <p className="error-text-signup">{signUpError}</p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
