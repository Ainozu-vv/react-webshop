import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import { Link } from "react-router";
import axios from "axios";
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
        {users.map((user) => (
          <UserCard
            id={user.id}
            firstName={user.firstName}
            lastName={user.lastName}
            email={user.email}
            img_Url={user.img_Url}
          />
        ))}
      </div>
    </>
  );
};

export default UserList;
