import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import ListingUI from "../components/listingUI";

export default function Rent() {
  const [offers, setOffers] = useState([]);
  useEffect(() => {
    async function fetchOffers() {
      try {
        const offersRef = collection(db, "list_data");
        const q = query(
          offersRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc")
        );
        let listings = [];
        const qureySnap = await getDocs(q);
        qureySnap.forEach((ele) => {
          listings.push({
            id: ele.id,
            ...ele.data(),
          });
        });
        setOffers(listings);
        console.log(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOffers();
  }, []);

  return (
    <div className="flex flex-col items-center mb-8 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-center text-4xl font-handwriting text-teal-700 drop-shadow-md m-10">
        Rent Units{" "}
      </h1>
      <ul className="grid gap-6 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
        {offers.map((item) => (
          <ListingUI key={item.id} data={item} />
        ))}
      </ul>
      <span className="mt-8 px-2  text-teal-500 font-semibold  ">
        You have reached the end of the content.
      </span>
    </div>
  );
}
