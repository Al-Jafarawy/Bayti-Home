import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import SpinnerOverlay from "../components/spiner";

//Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css/bundle";

export default function HomePageSlider() {
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);

  //   fn
  useEffect(() => {
    async function fetchingListing() {
      const listingRef = collection(db, "list_data");
      const q = query(listingRef, orderBy("timestamp", "desc"));
      const docSnap = await getDocs(q);
      let listings = [];
      docSnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListing(listings);
      setLoading(false);
    }

    fetchingListing();
  }, []);

  //Ui output
  if (loading) {
    return <SpinnerOverlay />;
  }

  if (listing.length === 0) {
    return <></>;
  }

  return (
    listing && (
      <>
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          autoplay={{ delay: 3000 }}
          modules={[EffectFade, Navigation, Pagination, Autoplay]}
        >
          {listing.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-[400px] bg-center bg-cover"
                style={{ backgroundImage: `url(${item.data.images[0]})` }}
              ></div>
              {/* image Title */}
              <h1 className="text-[#f1faee] absolute left-1 top-4 font-semibold max-w-[90%]  bg-[#4f5268] shadow-lg opacity-90 p-2 rounded-br-xl">
                {item.data.title}
              </h1>
              {/*  bullinding state */}
              <h1 className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl truncate">
                {item.data.discountedPrice ?? item.data.regularPrice}$
                {item.data.type === "rent" && " / month"}
              </h1>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}
