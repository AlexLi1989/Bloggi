import validator from "validator";
import { useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const newErrors = {};

    //email validation
    if (validator.isEmpty(email, { ignore_whitespace: true })) {
      newErrors.email = "Please enter email.";
    } else if (!validator.isEmail(email)) {
      newErrors.email = "Incorrect email format.";
    }

    //password validation
    if (validator.isEmpty(password)) {
      newErrors.password = "Please enter password.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true); //to prevent repeat submitting
      //send data
      try {
        const res = await api.post("/auth/login", {
          email: validator.trim(email),
          password,
        });
        login(res.data.token);
        return navigate("/");
      } catch (error) {
        const message =
          error.response?.data?.errors?.[0]?.msg ||
          error.response?.data?.message ||
          "Email or password incorrect, please try again.";
        setApiError(message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} noValidate>
        {apiError && <div>{apiError}</div>}
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
            autoComplete="email"
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
              autoComplete="current-password"
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </section>
  );
}
