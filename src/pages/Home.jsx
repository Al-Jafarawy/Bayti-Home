import { useEffect, useState } from "react";
import HomePageSlider from "../components/homePageSlider";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import ListingUI from "../components/listingUI";

export default function Home() {
  //Offers
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const offersRef = collection(db, "list_data");
        const q = query(
          offersRef,
          where("offer", "==", true),
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

  //rent
  const [rent, setRent] = useState([]);
  useEffect(() => {
    async function fetchRent() {
      try {
        const offersRef = collection(db, "list_data");
        const q = query(
          offersRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc")
        );
        let rentListings = [];
        const qureySnap = await getDocs(q);
        qureySnap.forEach((ele) => {
          rentListings.push({
            id: ele.id,
            ...ele.data(),
          });
        });
        setRent(rentListings);
        console.log(rent);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRent();
  }, []);
  //sell
  const [sell, setSell] = useState([]);
  useEffect(() => {
    async function fetchSell() {
      try {
        const offersRef = collection(db, "list_data");
        const q = query(
          offersRef,
          where("type", "==", "sell"),
          orderBy("timestamp", "desc")
        );
        let sellListings = [];
        const qureySnap = await getDocs(q);
        qureySnap.forEach((ele) => {
          sellListings.push({
            id: ele.id,
            ...ele.data(),
          });
        });
        setSell(sellListings);
        console.log(sell);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSell();
  }, []);

  return (
    <>
      <div>
        <HomePageSlider />
        {/* Offers */}
        <>
          <h1 className="text-center text-4xl font-handwriting text-teal-700 drop-shadow-md mb-2 p-10">
            Resent Offers
          </h1>
          <div className="flex  justify-center items-center">
            <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  max-w-7xl">
              {offers.map((item) => (
                <ListingUI key={item.id} data={item} />
              ))}
            </ul>
          </div>
        </>
        {/* rent */}
        <>
          <h1 className="text-center text-4xl font-handwriting text-teal-700 drop-shadow-md mb-2 p-10">
            Rent Unites
          </h1>
          <div className="flex  justify-center items-center">
            <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  max-w-7xl">
              {rent.map((item) => (
                <ListingUI key={item.id} data={item} />
              ))}
            </ul>
          </div>
        </>
        {/* sell  */}
        <>
          <h1 className="text-center text-4xl font-handwriting text-teal-700 drop-shadow-md mb-2 p-10">
            Sell Unites
          </h1>
          <div className="flex  justify-center items-center">
            <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  max-w-7xl">
              {sell.map((item) => (
                <ListingUI key={item.id} data={item} />
              ))}
            </ul>
          </div>
        </>
      </div>
    </>
  );
}
