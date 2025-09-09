import { FiEdit2, FiTrash2 } from "react-icons/fi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ConfirmDelete from "./Popup/confirmDelete";
import { useState } from "react";
import { useNavigate } from "react-router";
dayjs.extend(relativeTime);

export default function ListingUI({ data }) {
  const navigate =useNavigate()
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const price = data.offer ? data.discountedPrice : data.regularPrice;
  const suffix = data.type === "sell" ? "" : " / Month";
  const createdAt = data.timestamp
    ? dayjs(data.timestamp.toDate()).fromNow()
    : "";

  //fn
  function deletePopupState() {
    return setShowDeletePopup(!showDeletePopup);
  }
  function EditPopupState() {
    return navigate( `/edit-listing/${data.id}`);
  }

  return (
    <li className="max-w-sm rounded-2xl shadow p-3 bg-white flex flex-col gap-2">
      <div className="relative">
        <img
          src={data.images?.[0] || ""}
          alt={data.name}
          className="w-full h-48 object-cover rounded-xl"
        />
        {createdAt && (
          <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
            {createdAt}
          </span>
        )}
      </div>

      <h2 className="text-lg font-semibold truncate">{data.title}</h2>

      <p className="text-gray-600 text-sm line-clamp-2">{data.description}</p>

      <div className="text-green-800 font-bold">{`${price} $${suffix}`}</div>

      <div className="text-xs text-gray-500">{data.address}</div>

      <div className="flex items-center justify-between mt-2 text-sm text-gray-700">
        <div className="flex gap-4">
          <span>{data.beds} Beds</span>
          <span>{data.baths} Baths</span>
        </div>

        <div className="flex gap-3 text-gray-500">
          <button
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
            onClick={EditPopupState}
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={deletePopupState}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
        {showDeletePopup && (
          <ConfirmDelete
            docId={data.id}
            setShowDeletePopup={setShowDeletePopup}
          />
        )}
      </div>
    </li>
  );
}
