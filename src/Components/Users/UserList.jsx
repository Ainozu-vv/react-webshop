import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import { Link } from "react-router";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import * as usersApi from "../../api/usersApi";
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, isBootstrapping, hasPermission, PERMISSIONS } =
    useAuth();
  const isAdmin = hasPermission(PERMISSIONS.ADMIN);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isAdmin) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    usersApi
      .listUsers()
      .then((data) => {
        if (cancelled) return;
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.log(err);
        setError(err);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isAdmin]);

  if (isBootstrapping) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <div>Forbidden</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <Link
          to={"/new-user"}
          className="text-white bg-blue-700
        hover:bg-blue-800
        focus:ring-4 focus:ring-blue-300
        font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Add new User{" "}
        </Link>
      </div>
      {error ? (
        <div className="pt-4 text-red-700">Failed to load users</div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
        {users.map((user) => (
          <UserCard
            key={user.id}
            id={user.id}
            username={user.username}
            permissions={user.permissions}
          />
        ))}
      </div>
    </>
  );
};

export default UserList;
