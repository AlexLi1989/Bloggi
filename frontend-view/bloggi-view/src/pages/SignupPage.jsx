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
    <section className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
      <div className="flex flex-col items-start text-left gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Create an account
        </h1>
        <p className="text-sm font-normal text-stone-500 pl-0.5">
          Join Bloggi to read more and share your thoughts.
        </p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {apiError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {apiError}
          </div>
        )}
        <div>
          <label
            htmlFor="userName"
            className="block text-sm font-medium text-stone-700 mb-1"
          >
            User Name:
          </label>
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
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500/20 transition"
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-600 px-1">{errors.username}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-stone-700 mb-1"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500/20 transition"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 px-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-stone-700 mb-1"
          >
            Password:
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500/20 transition pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              👁️
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600 px-1">{errors.password}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-stone-700 mb-1"
          >
            Confirm Password:
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              required
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500/20 transition pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              👁️
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600 px-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer"
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </section>
  );
}
