import React from "react";
import { Link } from "react-router";
import { permissionMaskToLabels } from "../../auth/permissions";
const UserCard = ({
    id,
    username="user",
    permissions=0,
}) => {
  const labels = permissionMaskToLabels(permissions);
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex flex-col items-center p-6">
        <h5 className="mb-1 text-xl font-medium text-gray-900">{username}</h5>
        <span className="text-sm text-gray-500">
          {labels.length ? labels.join(", ") : "-"}
        </span>
        <div className="flex gap-2 mt-4">
          <Link
            to={"/edit-user/" + id}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
