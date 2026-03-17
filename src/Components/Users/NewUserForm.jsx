import React, { useMemo, useRef, useState } from "react";
import InputField from "../utils/InputField";
import { useNavigate } from "react-router";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import * as usersApi from "../../api/usersApi";
const NewUserForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isBootstrapping, hasPermission, PERMISSIONS, register } =
    useAuth();

  const usernameRef = useRef();
  const passwordRef = useRef();
  const [selected, setSelected] = useState({
    ADMIN: false,
    USER_READ: false,
    USER_WRITE: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const selectedPermissionNames = useMemo(() => {
    return Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);
  }, [selected]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!(username && password)) return;

    setSubmitting(true);

    Promise.resolve()
      .then(async () => {
        const created = await register({ username, password });

        if (selectedPermissionNames.length) {
          await usersApi.patchUserPermissions(created.id, {
            add: selectedPermissionNames,
            remove: [],
          });
        }

        navigate("/users");
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to create user");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (isBootstrapping) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasPermission(PERMISSIONS.ADMIN)) return <div>Forbidden</div>;

  return (
    <form className="grid grid-cols-2 gap-6 max-w-2xl" onSubmit={handleSubmit}>
      {error ? <div className="col-span-2 text-red-700">{error}</div> : null}

      <InputField field={"username"} field_name={"Username"} col_span={2} refField={usernameRef} />
      <InputField
        field={"password"}
        field_name={"Password"}
        type="password"
        col_span={2}
        refField={passwordRef}
      />

      <div className="col-span-2">
        <div className="text-sm font-medium text-slate-900 mb-2">Permissions</div>
        <div className="flex flex-wrap gap-4">
          {Object.keys(PERMISSIONS).map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={!!selected[key]}
                onChange={(e) =>
                  setSelected((prev) => ({ ...prev, [key]: e.target.checked }))
                }
              />
              {key}
            </label>
          ))}
        </div>
      </div>

      <button
        className="col-span-2 bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 disabled:opacity-50"
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default NewUserForm;
