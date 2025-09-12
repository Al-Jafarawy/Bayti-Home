import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import SpinnerOverlay from "../components/spiner";
export default function HomePageSlider() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

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
    }

    fetchingListing();
    setLoading(false);
  }, []);
  console.log(listing);
  if (loading) {
    return <SpinnerOverlay />;
  }

  return <div>slider</div>;
}
