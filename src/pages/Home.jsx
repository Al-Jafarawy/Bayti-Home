import { useEffect, useState } from "react";
import HomePageSlider from "../components/homePageSlider";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import ListingUI from "../components/listingUI";
import { useNavigate } from "react-router";

export default function Home() {

  const navigate=useNavigate()
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
      <HomePageSlider />
      <div className="max-w-7xl mx-auto">

        {/* Offers */}
        <div className="flex flex-col items-center mb-16 w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-handwriting text-teal-700 drop-shadow-md m-10">
            Recent Offers
          </h1>
          <ul className="grid gap-6 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
            {offers.map((item) => (
              <ListingUI key={item.id} data={item} />
            ))}
          </ul>
          <button className="mt-8 px-8 py-3 bg-blue-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-blue-600 transition duration-300" onClick={()=>{
            navigate('/offers')
          }}>
            Show More Offers
          </button>
        </div>

        {/* Rent */}
        <div className="flex flex-col items-center mb-16 w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-handwriting text-teal-700 drop-shadow-md m-10">
            Rent Units
          </h1>
          <ul className="grid gap-6 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
            {rent.map((item) => (
              <ListingUI key={item.id} data={item} />
            ))}
          </ul>
          <button className="mt-8 px-8 py-3 bg-blue-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-blue-600 transition duration-300">
            Show More Rent
          </button>
        </div>

        {/* Sell */}
        <div className="flex flex-col items-center mb-16 w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-handwriting text-teal-700 drop-shadow-md m-10">
            Sell Units
          </h1>
          <ul className="grid gap-6 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
            {sell.map((item) => (
              <ListingUI key={item.id} data={item} />
            ))}
          </ul>
          <button className="mt-8 px-8 py-3 bg-blue-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-blue-600 transition duration-300">
            Show More Sell
          </button>
        </div>
      </div>
    </>
  );
}
