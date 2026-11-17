import validator from "validator";
import { useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const newErrors = {};

    //username validation
    if (validator.isEmpty(username, { ignore_whitespace: true })) {
      newErrors.username = "Please enter username.";
    } else if (!validator.isLength(username, { min: 1, max: 50 })) {
      newErrors.username = "Username must be between 1 and 50 characters.";
    }

    //email validation
    if (validator.isEmpty(email, { ignore_whitespace: true })) {
      newErrors.email = "Please enter email.";
    } else if (!validator.isEmail(email)) {
      newErrors.email = "Incorrect email format.";
    }

    //password validation
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        maxLength: 72,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      newErrors.password =
        "Password must be 8 - 72 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    //confirm password validation
    if (validator.isEmpty(confirmPassword)) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (!validator.equals(confirmPassword, password)) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true); //to prevent repeat submitting
      //send data
      try {
        await api.post("/auth/signup", {
          username: validator.trim(username),
          email: validator.trim(email),
          password,
          confirmPassword,
        });
        const autoLogin = await api.post("/auth/login", {
          email: validator.trim(email),
          password,
        });
        login(autoLogin.data.token);
        return navigate("/");
      } catch (error) {
        const message =
          error.response?.data?.errors?.[0]?.msg ||
          error.response?.data?.message ||
          "Sign up failed, please try again.";
        setApiError(message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} noValidate>
        {apiError && <div>{apiError}</div>}
        <div>
          <label htmlFor="userName">User Name:</label>
          <input
            type="text"
            id="userName"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            required
          />
          {errors.username && <p>{errors.username}</p>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              👁️
            </button>
            {errors.password && <p>{errors.password}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              👁️
            </button>
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          </div>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </section>
  );
}
