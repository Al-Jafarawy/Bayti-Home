import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import SpinnerOverlay from "../components/spiner";
import CloudinaryImageUploader from "../components/cloudinary/cloudinaryImageUploader";
import { getAuth } from "firebase/auth";
import { useNavigate, useParams } from "react-router";

export default function CreateListing() {
  const [getListing, setGetListing] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("sell");
  const [beds, setBeds] = useState(1);
  const [baths, setBaths] = useState(1);
  const [parking, setParking] = useState(true);
  const [furnished, setFurnished] = useState(false);
  const [offer, setOffer] = useState(false);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [images, setImages] = useState([]);
  const [geo] = useState(true);
  const [directions, setDirections] = useState({ latitude: "", longitude: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();
    if (!auth.currentUser) {
      alert("You must be logged in to create a listing");
      setLoading(false);
      return;
    }

    try {
      if (images.length > 3) {
        alert("Maximum allowed images are 3");
        return;
      }

      if (discountedPrice > regularPrice) {
        alert("Discounted price cannot exceed regular price");
        return;
      }

      const listingDataCopy = {
        type,
        beds,
        baths,
        title,
        parking,
        furnished,
        offer,
        address,
        description,
        regularPrice,
        discountedPrice,
        images,
        directions: { ...directions },
        timestamp: serverTimestamp(),
        userRef: auth.currentUser.uid,
      };

      const docRef = await addDoc(collection(db, "list_data"), listingDataCopy);

      console.log("Form Submitted:", listingDataCopy);
    } catch (error) {
      console.error("Error adding document:", error);
      alert(error.message);
    } finally {
      setLoading(false);
      navigate("/profile");
    }
  };

  //fetching data
  const params = useParams();
  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, "list_data", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
      } else {
        navigate("/profile");
        alert("problem in fetching data to edit");
      }
    }
    console.log(params);
    setLoading(false);
    fetchListing();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Edit a Listing</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && <SpinnerOverlay />}
          {/* Sell / Rent */}
          <div>
            <label className="block mb-2 font-medium">Sell / Rent</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("sell")}
                className={`flex-1 py-2 rounded-lg border ${
                  type === "sell" ? "bg-gray-700 text-white" : "bg-white"
                }`}
              >
                SELL
              </button>
              <button
                type="button"
                onClick={() => setType("rent")}
                className={`flex-1 py-2 rounded-lg border ${
                  type === "rent" ? "bg-gray-700 text-white" : "bg-white"
                }`}
              >
                RENT
              </button>
            </div>
          </div>
          {/* Beds */}
          <div>
            <label className="block mb-2 font-medium">Beds</label>
            <input
              type="number"
              min="1"
              value={beds}
              onChange={(e) => setBeds(Number(e.target.value))}
              className="w-full border rounded-lg p-2"
            />
          </div>
          {/* Baths */}
          <div>
            <label className="block mb-2 font-medium">Baths</label>
            <input
              type="number"
              min="1"
              value={baths}
              onChange={(e) => setBaths(Number(e.target.value))}
              className="w-full border rounded-lg p-2"
            />
          </div>
          {/* Title */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block mb-2 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Listing Title"
            />
          </div>
          {/* Parking */}
          <div>
            <label className="block mb-2 font-medium">Parking spot</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setParking(true)}
                className={`flex-1 py-2 rounded-lg border ${
                  parking ? "bg-gray-700 text-white" : "bg-white"
                }`}
              >
                YES
              </button>
              <button
                type="button"
                onClick={() => setParking(false)}
                className={`flex-1 py-2 rounded-lg border ${
                  !parking ? "bg-gray-700 text-white" : "bg-white"
                }`}
              >
                NO
              </button>
            </div>
          </div>
          {/* Furnished */}
          <div>
            <label className="block mb-2 font-medium">Furnished</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFurnished(true)}
                className={`flex-1 py-2 rounded-lg border ${
                  furnished ? "bg-gray-700 text-white" : "bg-white"
                }`}
              >
                YES
              </button>
              <button
                type="button"
                onClick={() => setFurnished(false)}
                className={`flex-1 py-2 rounded-lg border ${
                  !furnished ? "bg-gray-700 text-white" : "bg-white"
                }`}
              >
                NO
              </button>
            </div>
          </div>
          {/* Address */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block mb-2 font-medium">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Address"
            />
          </div>
          {/* Latitude / Longitude */}
          {geo && (
            <>
              <div>
                <label className="block mb-2 font-medium">Latitude</label>
                <input
                  max="180"
                  min="-180"
                  type="number"
                  step="any"
                  value={directions.latitude}
                  onChange={(e) =>
                    setDirections({ ...directions, latitude: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Longitude</label>
                <input
                  type="number"
                  step="any"
                  max="180"
                  min="-180"
                  value={directions.longitude}
                  onChange={(e) =>
                    setDirections({ ...directions, longitude: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </>
          )}
          {/* Description */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Description"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block mb-2 font-medium">Pricing</label>
            <div className="flex flex-wrap lg:flex-nowrap items-end gap-6">
              {/* Regular */}
              <div className="flex-1 min-w-0 lg:min-w-[160px]">
                <input
                  type="number"
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(Number(e.target.value))}
                  className="w-full border rounded-lg p-2"
                  placeholder="Regular Price"
                />
              </div>

              {/* Discounted */}
              <div className="flex-1 min-w-0 lg:min-w-[160px]">
                <input
                  type="number"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                  disabled={!offer}
                  className={`w-full border rounded-lg p-2 ${
                    !offer ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="Discounted Price"
                />
              </div>

              {/* Offer Toggle */}
              <div className="flex flex-col items-center justify-center w-[80px]">
                <span className="text-xs font-medium text-gray-700 mb-2">
                  Offer
                </span>
                <button
                  type="button"
                  onClick={() => setOffer(!offer)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                    offer ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                      offer ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block mb-2 font-medium">Images</label>
            <p className="text-sm mb-2">
              The first image will be the cover (max 3).
            </p>
            <CloudinaryImageUploader images={images} setImages={setImages} />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-gray-700 text-white py-3 rounded-lg font-semibold"
        >
          Create Listing
        </button>
      </form>
    </div>
  );
}
