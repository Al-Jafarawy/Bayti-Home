import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import SpinnerOverlay from "../components/spiner";
import { IoMdShareAlt } from "react-icons/io";
import { FaBed, FaBath, FaCouch, FaCar } from "react-icons/fa";

//Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css/bundle";
import LocationMap from "../components/Map/map";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkCopiedPop, setLinkCopiedPop] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        const docRef = doc(db, "list_data", params.listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setListing(docSnap.data());
        } else {
          setListing(null);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        setListing(null);
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);

  if (loading) return <SpinnerOverlay />;

  if (!listing || !listing.images) return <p>No listing found.</p>;

  return (
    <main className="w-full min-h-screen pb-9 ">
      {/* Swiper Images */}
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        autoplay={{ delay: 3000 }}
        modules={[EffectFade, Navigation, Pagination, Autoplay]}
      >
        {listing.images.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="h-[400px] bg-center bg-cover"
              style={{ backgroundImage: `url(${url})` }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Copy Link  */}
      <div
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer rounded-full border-2 border-gray-400 w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setLinkCopiedPop(true);
          setTimeout(() => setLinkCopiedPop(false), 2000);
        }}
      >
        <IoMdShareAlt className="text-lg text-slate-500" />
      </div>
      {linkCopiedPop && (
        <div className="fixed top-[22%] right-[5%] z-50 bg-white text-slate-600 border-2 rounded border-blue-200 w-32 p-2 flex justify-center items-center">
          Link Copied
        </div>
      )}

      {/* Cards */}
      <h1 className="text-center text-4xl font-handwriting text-teal-700 drop-shadow-md mb-2 p-10">
        Building Details
      </h1>

      <div className="w-full max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 ">
        {/* Details Card */}
        <div className="bg-gradient-to-tr from-white to-blue-50 shadow-xl rounded-3xl p-6 flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">
            {listing.title || "No Title"}
          </h2>

          {listing.address && (
            <h3 className="text-lg font-medium text-blue-600 overflow-hidden">
              {listing.address}
            </h3>
          )}

          {listing.description && (
            <p className="text-slate-600 text-sm">{listing.description}</p>
          )}

          {/* Icons for Beds, Baths, Furnished, Parking */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="flex items-center gap-2">
              <FaBed className="text-blue-500" />
              <span className="font-semibold">{listing.beds} Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBath className="text-blue-500" />
              <span className="font-semibold">{listing.baths} Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCouch className="text-blue-500" />
              <span className="font-semibold">
                {listing.furnished ? "Furnished" : "Not Furnished"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaCar className="text-blue-500" />
              <span className="font-semibold">
                {listing.parking ? "Parking" : "No Parking"}
              </span>
            </div>
          </div>

          {/* Additional Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pb-4">
            {Object.entries(listing).map(([key, value]) => {
              if (
                [
                  "images",
                  "title",
                  "description",
                  "beds",
                  "baths",
                  "furnished",
                  "parking",
                  "directions",
                  "timestamp",
                  "address",
                  "userRef",
                ].includes(key)
              )
                return null;

              return (
                <div
                  key={key}
                  className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4 rounded-xl shadow hover:shadow-md transition-all flex flex-col mb-3"
                >
                  <span className="text-slate-600 font-medium text-sm mb-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span className="text-slate-900 font-semibold text-base break-words">
                    {typeof value === "boolean"
                      ? value
                        ? "Yes"
                        : "No"
                      : value?.toString() || "-"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Card */}
        <div className="bg-gradient-to-tr from-white to-blue-50 shadow-xl rounded-3xl flex flex-col  overflow-hidden">
          <h2 className="text-lg font-semibold text-slate-700 text-center p-4 bg-gray-100 rounded">
            Location
          </h2>
          {listing.directions?.latitude && listing.directions?.longitude ? (
            <div className="flex justify-center items-center">
              <LocationMap
                className="rounded w-full h-64 md:w-3/4"
                lat={parseFloat(listing.directions.latitude)}
                lng={parseFloat(listing.directions.longitude)}
              />
            </div>
          ) : (
            <p className="text-sm text-red-500 text-center">No location data</p>
          )}
        </div>
      </div>
    </main>
  );
}
