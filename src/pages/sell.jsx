import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import ListingUI from "../components/listingUI";
import SpinnerOverlay from "../components/spiner";

export default function Sell() {
  const [sell, setSell] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSell() {
      try {
        setLoading(true);
        const sellRef = collection(db, "list_data");
        const q = query(
          sellRef,
          where("type", "==", "sell"),
          orderBy("timestamp", "desc")
        );
        let listings = [];
        const querySnap = await getDocs(q);
        querySnap.forEach((ele) => {
          listings.push({
            id: ele.id,
            ...ele.data(),
          });
        });
        setSell(listings);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    fetchSell();
  }, []);

  if (loading) {
    return <SpinnerOverlay />;
  }

  return (
    <div className="flex flex-col items-center mb-8 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-center text-4xl font-handwriting text-teal-700 drop-shadow-md m-10">
        Sell Units
      </h1>

      {sell.length === 0 ? (
        <span className="mt-8 text-gray-500 text-lg font-medium">
          No sell units available at the moment.
        </span>
      ) : (
        <>
          <ul className="grid gap-6 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
            {sell.map((item) => (
              <ListingUI key={item.id} data={item} />
            ))}
          </ul>
          <span className="mt-8 px-2 text-teal-500 font-semibold">
            You have reached the end of the content.
          </span>
        </>
      )}
    </div>
  );
}
