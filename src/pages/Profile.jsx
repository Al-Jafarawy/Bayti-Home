import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { db } from "../firebase";
import ListingUI from "../components/listingUI";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState([]);
  const [user, setUser] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const [tempName, setTempName] = useState(user.name);
  const [tempEmail, setTempEmail] = useState(user.email);
  const [isOpen, setIsOpen] = useState(false);

  // change name and email
  function handleSave() {
    if (tempName && tempEmail) {
      setUser({ name: tempName, email: tempEmail });
      saveDataInDB();
      setIsOpen(false);
    }
  }

  // save change in database
  async function saveDataInDB() {
    try {
      if (auth.currentUser.displayName !== tempName) {
        await updateProfile(auth.currentUser, { displayName: tempName });
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { name: tempName });
      }
    } catch (error) {
      alert("There is a problem in data saving");
    }
  }

  // logout fn
  function handleLogout() {
    auth.signOut();
    navigate("/");
  }

  // fetching data listing
  useEffect(() => {
    async function fetchListingData() {
      const listingRef = collection(db, "list_data");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);

      const listings = querySnap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setListing(listings);
    }
    fetchListingData();
  }, [auth.currentUser.uid]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto mt-12 mb-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-8 items-stretch">
          {/* Profile Avatar */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-700 mb-4">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

          {/* Profile Actions Card */}
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Manage Profile
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => setIsOpen(true)}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium shadow-md 
                 hover:shadow-lg hover:scale-105 active:scale-95 active:shadow-sm transition-all"
              >
                Edit
              </button>

              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white text-sm font-medium shadow-md 
                 hover:shadow-lg hover:scale-105 active:scale-95 active:shadow-sm transition-all"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Create Listing */}
          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Ready to Sell or Rent?
            </h2>
            <p className="text-gray-600 mb-6">
              Create a new listing to reach more buyers or renters.
            </p>
            <button
              className="w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              onClick={() => navigate("/create-listing")}
            >
              Sell or Rent Your Home
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Profile
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Name</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listings */}
      <h1 className="text-center text-4xl font-handwriting text-teal-700 drop-shadow-md mb-2 p-10">
        My Listings
      </h1>

      <div className="flex justify-center items-center">
        {listing.length === 0 && (
          <div className="flex items-center justify-center text-gray-600 text-lg">
            No listing data. You can create your list.
          </div>
        )}
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl">
          {listing.map((item) => (
            <ListingUI key={item.id} data={item} profile={true} />
          ))}
        </ul>
      </div>
    </div>
  );
}
