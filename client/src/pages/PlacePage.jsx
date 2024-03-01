import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import axios from "axios";

export default function PlacePage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  return (
    <div>
      <AccountNav />

      <div className="text-center">
        <Link
          className="bg-primary inline-flex gap-1 text-white py-2 px-6 rounded-full "
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new place
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 &&
          places.map((place) => (
            <Link key={place.title}
              to={"/account/places/" + place._id}
              className="bg-secondary cursor-pointer gap-4 rounded-2xl p-4 flex"
            >
              <div className="flex h-32 w-32 rounded-2xl bg-gray-200 shrink-0">
                {place.photos.length > 0 && (
                  <img
                    className="object-cover rounded-2xl"
                    src={"http://localhost:7002/uploads/" + place.photos[0]}
                    alt=""
                  />
                )}
              </div>
              <div>
                <h2 className="text-xl">{place.title}</h2>
                <p className="text-sm mt-2">{place.description}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
