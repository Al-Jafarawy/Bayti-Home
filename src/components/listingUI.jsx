import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function ListingUI({ data }) {
  const price = data.offer ? data.discountedPrice : data.regularPrice;
  const suffix = data.type === "sell" ? "" : " / Month";

  return (
    <li className="max-w-sm rounded-2xl shadow p-3 bg-white flex flex-col gap-2">
      <img
        src={data.images?.[0] || ""}
        alt={data.name}
        className="w-full h-48 object-cover rounded-xl"
      />

      <h2 className="text-lg font-semibold truncate">{data.name}</h2>

      <p className="text-gray-600 text-sm line-clamp-2">{data.description}</p>

      <div className="text-green-800 font-bold">{`${price} $${suffix}`}</div>

      <div className="text-xs text-gray-500">{data.address}</div>

      <div className="flex items-center justify-between mt-2 text-sm text-gray-700">
        <div className="flex gap-4">
          <span>{data.beds} Beds</span>
          <span>{data.baths} Baths</span>
        </div>

        <div className="flex gap-3 text-gray-500">
          <button className="text-blue-600 hover:text-blue-800" title="Edit">
            <FiEdit2 size={18} />
          </button>
          <button className="text-red-600 hover:text-red-800" title="Delete">
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </li>
  );
}
