import { useEffect, useState } from "react";
import HomePageSlider from "../components/homePageSlider";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import ListingUI from "../components/listingUI";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  //Offers
  const [offers, setOffers] = useState([]);
  useEffect(() => {
    async function fetchOffers() {
      try {
        const offersRef = collection(db, "list_data");
        const q = query(
          offersRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
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
          orderBy("timestamp", "desc"),
          limit(4)
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
          orderBy("timestamp", "desc"),
          limit(4)
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
      <HomePageSlider />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Offers */}
        <div className="flex flex-col items-center mb-20">
          <h1 className="text-center text-4xl font-handwriting text-teal-700 drop-shadow-lg mb-4 relative">
            Recent Offers
            <span className="block w-24 h-1 bg-teal-500 mt-4 mx-auto rounded-full animate-pulse"></span>
          </h1>
          <ul className="grid gap-8 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
            {offers.map((item) => (
              <ListingUI key={item.id} data={item} />
            ))}
          </ul>

          <button
            className="mt-8 px-6 py-3 border border-blue-500 text-blue-500 font-semibold rounded-2xl  text-blue-500 font-semibold rounded-2xl flex items-center gap-2 hover:bg-blue-500 hover:text-white transition duration-300 focus:outline-none"
            onClick={() => navigate("/offers")}
          >
            Show More
            <span className="animate-bounceSlow">↓</span>
          </button>
        </div>

        {/* Rent */}
        <div className="flex flex-col items-center mb-20">
          <h1 className="text-center text-4xl font-handwriting text-teal-700 drop-shadow-lg mb-4 relative">
            Rent Units
            <span className="block w-24 h-1 bg-teal-500 mt-4 mx-auto rounded-full animate-pulse"></span>
          </h1>
          <ul className="grid gap-8 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
            {rent.map((item) => (
              <ListingUI key={item.id} data={item} />
            ))}
          </ul>
          <button className="mt-8 px-6 py-3 border border-blue-500 text-blue-500 font-semibold rounded-2xl  text-blue-500 font-semibold rounded-2xl flex items-center gap-2 hover:bg-blue-500 hover:text-white transition duration-300 focus:outline-none">
            Show More
            <span className="animate-bounceSlow">↓</span>
          </button>
        </div>

        {/* Sell */}
        <div className="flex flex-col items-center mb-20">
          <h1 className="text-center text-4xl font-handwriting text-teal-700 drop-shadow-lg mb-4 relative">
            Sell Units
            <span className="block w-24 h-1 bg-teal-500 mt-4 mx-auto rounded-full animate-pulse"></span>
          </h1>
          <ul className="grid gap-8 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
            {sell.map((item) => (
              <ListingUI key={item.id} data={item} />
            ))}
          </ul>
          <button className="mt-8 px-6 py-3 border border-blue-500 text-blue-500 font-semibold rounded-2xl  text-blue-500 font-semibold rounded-2xl flex items-center gap-2 hover:bg-blue-500 hover:text-white transition duration-300 focus:outline-none">
            Show More
            <span className="animate-bounceSlow">↓</span>
          </button>
        </div>
      </div>
    </>
  );
}
