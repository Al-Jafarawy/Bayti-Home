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
          {listing.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-[400px] bg-center bg-cover"
                style={{ backgroundImage: `url(${url.data.images[0]})` }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}
