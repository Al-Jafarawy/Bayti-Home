import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import SpinnerOverlay from "../components/spiner";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      try {
        const docRef = doc(db, "list_data", params.listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setListing(docSnap.data());
          setLoading(false);
          console.log(docSnap.data())
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        setListing(null);
      } finally {
      }
    }
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <SpinnerOverlay />;
  }

  return <div>{listing.description}</div>;
}
