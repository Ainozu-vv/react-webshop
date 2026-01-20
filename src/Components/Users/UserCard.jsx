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
    <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div class="flex flex-col items-center pb-10">
        <img
          class="w-24 h-24 mb-3 rounded-full shadow-lg"
          src={img_Url}
          alt="Profile image"
        />
        <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {firstName} {lastName}
        </h5>
        <span class="text-sm text-gray-500 dark:text-gray-400">{email}</span>
        <div class="flex mt-4 md:mt-6">
          <Link
            to={"/edit-user/" + id}
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Edit
          </Link>
          <a
            href="#"
            class="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Message
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
