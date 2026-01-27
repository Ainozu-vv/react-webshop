import React from "react";
import axios from "axios";
import { Link } from "react-router";
//useCart
import { useCart } from "../Contexts/CartContext";

const fallbackImg =
  "https://thumbs.dreamstime.com/b/different-computer-gadgets-doodle-vector-illustrations-isolate-white-gadget-sketch-drawing-electronic-laptop-video-camera-93396398.jpg";

const ItemCard = ({ item }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
      },
      1,
    );
  };

  //delete

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg shadow">
      <div className="p-4">
        <img
          className="w-full h-44 object-cover rounded-md border border-slate-100"
          src={item.imageUrl || fallbackImg}
          alt={item.name}
        />
        <div className="pt-4">
          <div className="flex items-start justify-between gap-3">
            <h5 className="text-lg font-semibold text-slate-900 leading-snug">
              {item.name}
            </h5>
            <div className="text-slate-900 font-semibold">
              ${Number(item.price || 0).toFixed(2)}
            </div>
          </div>
          {item.description ? (
            <p className="text-sm text-slate-600 mt-1 line-clamp-3">
              {item.description}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={handleAddToCart}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg"
            >
              Add to cart
            </button>
            <Link
              to={"/edit-item/" + item.id}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg"
            >
              Edit
            </Link>
            <button
              onClick={() => console.log("delete")}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
