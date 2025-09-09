import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import SpinnerOverlay from "../components/spiner";
import CloudinaryImageUploader from "../components/cloudinary/cloudinaryImageUploader";
import { getAuth } from "firebase/auth";
import { useNavigate, useParams } from "react-router";

export default function CreateListing() {
  const [formData, setFormData] = useState({
    title: "",
    type: "sell",
    beds: 1,
    baths: 1,
    parking: true,
    furnished: false,
    offer: false,
    address: "",
    description: "",
    regularPrice: "",
    discountedPrice: "",
    directions: { latitude: "", longitude: "" },
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (!params.listingId) return navigate("/profile");

    const fetchListing = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "list_data", params.listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData({ ...docSnap.data() });
          setImages(docSnap.data().images || []);
        } else {
          alert("Problem in fetching data to edit");
          navigate("/profile");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        alert("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const auth = getAuth();
    if (!auth.currentUser) {
      alert("You must be logged in to create a listing");
      setLoading(false);
      return;
    }

    if (images.length > 3) {
      alert("Maximum allowed images are 3");
      setLoading(false);
      return;
    }

    if (formData.offer && formData.discountedPrice > formData.regularPrice) {
      alert("Discounted price cannot exceed regular price");
      setLoading(false);
      return;
    }

    try {
      const listingData = {
        ...formData,
        images,
        timestamp: serverTimestamp(),
        userRef: auth.currentUser.uid,
      };
      const docRef = doc(db, "list_data", params.listingId)
      await updateDoc(docRef, formData);
      navigate("/profile");
    } catch (error) {
      console.error("Error adding document:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Edit a Listing</h1>
        {loading && <SpinnerOverlay />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sell / Rent */}
          <div>
            <label className="block mb-2 font-medium">Sell / Rent</label>
            <div className="flex gap-2">
              {["sell", "rent"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleChange("type", t)}
                  className={`flex-1 py-2 rounded-lg border ${
                    formData.type === t ? "bg-gray-700 text-white" : "bg-white"
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Beds */}
          <div>
            <label className="block mb-2 font-medium">Beds</label>
            <input
              type="number"
              min="1"
              value={formData.beds}
              onChange={(e) => handleChange("beds", Number(e.target.value))}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Baths */}
          <div>
            <label className="block mb-2 font-medium">Baths</label>
            <input
              type="number"
              min="1"
              value={formData.baths}
              onChange={(e) => handleChange("baths", Number(e.target.value))}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Title */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block mb-2 font-medium">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Listing Title"
            />
          </div>

          {/* Parking */}
          <div>
            <label className="block mb-2 font-medium">Parking spot</label>
            <div className="flex gap-2">
              {[true, false].map((p) => (
                <button
                  key={p.toString()}
                  type="button"
                  onClick={() => handleChange("parking", p)}
                  className={`flex-1 py-2 rounded-lg border ${
                    formData.parking === p
                      ? "bg-gray-700 text-white"
                      : "bg-white"
                  }`}
                >
                  {p ? "YES" : "NO"}
                </button>
              ))}
            </div>
          </div>

          {/* Furnished */}
          <div>
            <label className="block mb-2 font-medium">Furnished</label>
            <div className="flex gap-2">
              {[true, false].map((f) => (
                <button
                  key={f.toString()}
                  type="button"
                  onClick={() => handleChange("furnished", f)}
                  className={`flex-1 py-2 rounded-lg border ${
                    formData.furnished === f
                      ? "bg-gray-700 text-white"
                      : "bg-white"
                  }`}
                >
                  {f ? "YES" : "NO"}
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block mb-2 font-medium">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Address"
            />
          </div>

          {/* Latitude / Longitude */}
          {true && (
            <>
              <div>
                <label className="block mb-2 font-medium">Latitude</label>
                <input
                  max="180"
                  min="-180"
                  type="number"
                  step="any"
                  value={formData.directions.latitude}
                  onChange={(e) =>
                    handleChange("directions", {
                      ...formData.directions,
                      latitude: e.target.value,
                    })
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
                  value={formData.directions.longitude}
                  onChange={(e) =>
                    handleChange("directions", {
                      ...formData.directions,
                      longitude: e.target.value,
                    })
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
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Description"
            />
          </div>

          {/* Pricing */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block mb-2 font-medium">Pricing</label>
            <div className="flex flex-wrap lg:flex-nowrap items-end gap-6">
              <input
                type="number"
                value={formData.regularPrice}
                onChange={(e) =>
                  handleChange("regularPrice", Number(e.target.value))
                }
                className="w-full border rounded-lg p-2 lg:min-w-[160px]"
                placeholder="Regular Price"
              />
              <input
                type="number"
                value={formData.discountedPrice}
                onChange={(e) =>
                  handleChange("discountedPrice", Number(e.target.value))
                }
                disabled={!formData.offer}
                className={`w-full border rounded-lg p-2 lg:min-w-[160px] ${
                  !formData.offer ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                placeholder="Discounted Price"
              />
              <div className="flex flex-col items-center justify-center w-[80px]">
                <span className="text-xs font-medium text-gray-700 mb-2">
                  Offer
                </span>
                <button
                  type="button"
                  onClick={() => handleChange("offer", !formData.offer)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                    formData.offer ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                      formData.offer ? "translate-x-6" : "translate-x-0"
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
          Edit Listing
        </button>
      </form>
    </div>
  );
}
