import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import SpinnerOverlay from "../components/spiner";
import CloudinaryImageUploader from "../components/cloudinary/cloudinaryImageUploader";
import { getAuth } from "firebase/auth";
import { useNavigate, useParams } from "react-router";

export default function CreateListing() {
  const [formData, setFormData] = useState({
    title: "",
    type: "sell",
    beds: "",
    baths: "",
    parking: true,
    furnished: false,
    offer: false,
    address: "",
    description: "",
    regularPrice: "",
    discountedPrice: "",
    images: [],
    directions: { latitude: "", longitude: "" },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  // Fetch data if editing
  useEffect(() => {
    if (!params.listingId) return;

    const fetchListing = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "list_data", params.listingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData({ ...docSnap.data() });
        } else {
          alert("Listing not found");
          navigate("/profile");
        }
      } catch (error) {
        console.error(error);
        alert("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId, navigate]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    if (inputType === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDirectionsChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, directions: { ...formData.directions, [name]: value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();
    if (!auth.currentUser) {
      alert("You must be logged in");
      setLoading(false);
      return;
    }

    if (formData.images.length > 3) {
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
      const docRef = await addDoc(collection(db, "list_data"), {
        ...formData,
        timestamp: serverTimestamp(),
        userRef: auth.currentUser.uid,
      });
      console.log("Submitted:", formData);
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          {params.listingId ? "Edit Listing" : "Create Listing"}
        </h1>

        {loading && <SpinnerOverlay />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sell / Rent */}
          <div>
            <label className="block mb-2 font-medium">Sell / Rent</label>
            <div className="flex gap-2">
              {["sell", "rent"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: option })}
                  className={`flex-1 py-2 rounded-lg border ${formData.type === option ? "bg-gray-700 text-white" : "bg-white"}`}
                >
                  {option.toUpperCase()}
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
              name="beds"
              value={formData.beds}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Baths */}
          <div>
            <label className="block mb-2 font-medium">Baths</label>
            <input
              type="number"
              min="1"
              name="baths"
              value={formData.baths}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Title */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block mb-2 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="Listing Title"
            />
          </div>

          {/* Parking / Furnished toggles */}
          {["parking", "furnished"].map((field) => (
            <div key={field}>
              <label className="block mb-2 font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <div className="flex gap-2">
                {[true, false].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    onClick={() => setFormData({ ...formData, [field]: value })}
                    className={`flex-1 py-2 rounded-lg border ${formData[field] === value ? "bg-gray-700 text-white" : "bg-white"}`}
                  >
                    {value ? "YES" : "NO"}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Address */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block mb-2 font-medium">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="Address"
            />
          </div>

          {/* Latitude / Longitude */}
          {["latitude", "longitude"].map((coord) => (
            <div key={coord}>
              <label className="block mb-2 font-medium">{coord.charAt(0).toUpperCase() + coord.slice(1)}</label>
              <input
                type="number"
                step="any"
                name={coord}
                value={formData.directions[coord]}
                onChange={handleDirectionsChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
          ))}

          {/* Description */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
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
                name="regularPrice"
                value={formData.regularPrice}
                onChange={handleChange}
                className="flex-1 border rounded-lg p-2"
                placeholder="Regular Price"
              />
              <input
                type="number"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
                disabled={!formData.offer}
                className={`flex-1 border rounded-lg p-2 ${!formData.offer ? "bg-gray-100 cursor-not-allowed" : ""}`}
                placeholder="Discounted Price"
              />
              <div className="flex flex-col items-center justify-center w-[80px]">
                <span className="text-xs font-medium text-gray-700 mb-2">Offer</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, offer: !formData.offer })}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${formData.offer ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${formData.offer ? "translate-x-6" : "translate-x-0"}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block mb-2 font-medium">Images</label>
            <p className="text-sm mb-2">The first image will be the cover (max 3).</p>
            <CloudinaryImageUploader images={formData.images} setImages={(imgs) => setFormData({ ...formData, images: imgs })} />
          </div>
        </div>

        <button type="submit" className="mt-6 w-full bg-gray-700 text-white py-3 rounded-lg font-semibold">
          {params.listingId ? "Update Listing" : "Create Listing"}
        </button>
      </form>
    </div>
  );
}
