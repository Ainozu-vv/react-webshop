import React from "react";
import { Link } from "react-router";
const UserCard = ({
    id,
    firstName="Lorem",
    lastName="Ipsum",
    email="a@b.c",
    img_Url="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
}) => {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex flex-col items-center p-6">
        <img
          className="w-24 h-24 mb-3 rounded-full shadow-lg object-cover"
          src={img_Url}
          alt="Profile image"
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900">
          {firstName} {lastName}
        </h5>
        <span className="text-sm text-gray-500">{email}</span>
        <div className="flex gap-2 mt-4">
          <Link
            to={"/edit-user/" + id}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Edit
          </Link>
          <a
            href="#"
            className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
          >
            Message
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
