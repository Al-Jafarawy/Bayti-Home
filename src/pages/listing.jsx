import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import SpinnerOverlay from "../components/spiner";
import { IoMdShareAlt } from "react-icons/io";

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
          console.log("Listing Data:", docSnap.data()); // اطبع البيانات كلها
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

  if (loading) {
    return <SpinnerOverlay />;
  }

  if (!listing || !listing.images) {
    return <p>No listing found.</p>;
  }

  return (
    <main>
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
      <div
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer rounded-full border-2 bourder-gray-400 w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setLinkCopiedPop(true);
          setTimeout(() => {
            setLinkCopiedPop(false);
          }, 2000);
        }}
      >
        <IoMdShareAlt className="text-lg  text-slate-500" />
      </div>

      {linkCopiedPop && (
        <div className="fixed top-[22%] right-[5%] z-50 bg-white text-slate-600 border-2 rounded border-blue-200 w-32 p-2 flex justify-center items-center">
          Link Copied
        </div>
      )}

      {/* Cards Section */}
      <div className="w-full min-h-screen flex justify-center items-start py-6">
        <div className="w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white shadow rounded-2xl p-6 flex flex-col w-full">
            <h2 className="text-lg font-semibold text-slate-700">Card 1</h2>
            <p className="text-sm text-slate-500 mt-2">
              Content for the first card goes here.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow rounded-2xl p-6 flex flex-col w-full">
            <h2 className="text-lg font-semibold text-slate-700 text-center pb-4">
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
              <p className="text-sm text-red-500 text-center">
                No location data
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
