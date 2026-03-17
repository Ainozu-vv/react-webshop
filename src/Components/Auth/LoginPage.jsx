import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router";
import InputField from "../utils/InputField";
import { useAuth } from "../Contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const usernameRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) return;

    try {
      setSubmitting(true);
      await login({ username, password });
      navigate("/users");
    } catch {
      setError("Invalid username or password");
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="max-w-xl">
        <p className="text-slate-700">You are already logged in.</p>
        <Link className="text-blue-700 hover:underline" to="/users">
          Go to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Login</h1>
      {error ? <div className="mb-4 text-red-700">{error}</div> : null}
      <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <InputField field="username" field_name="Username" col_span={2} refField={usernameRef} />
        <InputField field="password" field_name="Password" type="password" col_span={2} refField={passwordRef} />
        <button
          className="col-span-2 bg-blue-700 text-white rounded-md px-4 py-2 hover:bg-blue-800 disabled:opacity-50"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
