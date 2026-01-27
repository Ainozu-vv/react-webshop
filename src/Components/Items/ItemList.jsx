import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import ItemCard from "./ItemCard";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <>
      <Link
        to={"/new-item"}
        className="text-white bg-blue-700 rounded-lg text-sm px-5 py-2.5"
      >
        Add new item
      </Link>

      <div className="grid grid-cols-3 gap-6 pt-8">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};

export default ItemList;
