import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import * as usersApi from "../../api/usersApi";
import { permissionMaskToLabels } from "../../auth/permissions";
const EditUserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated, isBootstrapping, hasPermission, PERMISSIONS } =
    useAuth();
  const isAdmin = hasPermission(PERMISSIONS.ADMIN);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState({
    ADMIN: false,
    USER_READ: false,
    USER_WRITE: false,
  });

  const initialPermissionNames = useMemo(() => {
    return new Set(permissionMaskToLabels(user?.permissions));
  }, [user?.permissions]);

  const selectedPermissionNames = useMemo(() => {
    return Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);
  }, [selected]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const desired = new Set(selectedPermissionNames);
    const add = [];
    const remove = [];

    for (const key of Object.keys(PERMISSIONS)) {
      const had = initialPermissionNames.has(key);
      const wants = desired.has(key);
      if (!had && wants) add.push(key);
      if (had && !wants) remove.push(key);
    }

    setSubmitting(true);
    usersApi
      .patchUserPermissions(id, { add, remove })
      .then(() => navigate("/users"))
      .catch((err) => {
        console.log(err);
        setError("Failed to update permissions");
      })
      .finally(() => setSubmitting(false));
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isAdmin) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    usersApi
      .getUser(id)
      .then((data) => {
        if (cancelled) return;
        setUser(data);
        const labels = permissionMaskToLabels(data?.permissions);
        setSelected({
          ADMIN: labels.includes("ADMIN"),
          USER_READ: labels.includes("USER_READ"),
          USER_WRITE: labels.includes("USER_WRITE"),
        });
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.log(err);
        setError("Failed to load user");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated, isAdmin]);

  if (isBootstrapping) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <div>Forbidden</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <form className="grid grid-cols-2 gap-6 max-w-2xl" onSubmit={handleSubmit}>
      {error ? <div className="col-span-2 text-red-700">{error}</div> : null}

      <div className="col-span-2">
        <div className="text-sm font-medium text-slate-900">Username</div>
        <div className="mt-1 text-slate-700">{user?.username}</div>
      </div>

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

export default EditUserForm;
