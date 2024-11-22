import { useState } from "react";
import "../CSS/AuthForm.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      const user = auth.currentUser;
      console.log(user);
      console.log("user registered successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
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
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button>Login</button>
              <p>
                Not a Member?{" "}
                <a href="#" onClick={() => setIsLogin(false)}>
                  Sign Up now
                </a>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form">
              <h2>Sign Up Form</h2>
              <input
                type="email"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
              <input type="password" placeholder="Confirm Password" />
              <button>Sign Up</button>
              <p>
                Already a member?
                <a href="#" onClick={() => setIsLogin(true)}>
                  Login now
                </a>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
