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

  //change  name and email
  function handleSave() {
    if (tempName && tempEmail) {
      setUser({ name: tempName, email: tempEmail });
      saveDataInDB();
      setIsOpen(false);
    }
  }

  //save change in dataBase
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

  //logout fn
  function handleLogout() {
    auth.signOut();
    navigate("/");
  }

  //fectching date listing
  // صحح التجميع
  useEffect(() => {
    async function fetchListingData() {
      const listingRef = collection(db, "list_data");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      const listingArray = [];
      querySnap.forEach((docSnap) => {
        listingArray.push({
          id: docSnap.id,
          data: docSnap.data(),
        });
      });
      setListing(listingArray);
    }
    fetchListingData();
  }, [auth.currentUser.uid]);

  console.log(listing);
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 mb-6 items-stretch">
        {/* List Column */}
        <div className="p-6 flex items-center justify-center w-full">
          <div
            className="rounded-full bg-blue-100 aspect-square 
                w-56 sm:w-64 md:w-72 
                flex items-center justify-center 
                text-gray-700 font-semibold text-xl"
          >
            {auth?.currentUser?.displayName || "User"}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Profile
          </h1>

          <div className="grid grid-cols-1 gap-4 flex-grow">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900">
                {user.name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900">
                {user.email}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Edit Info
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-800"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Create Listing */}
        <div className=" rounded-2xl -md p-6 flex flex-col items-center justify-center w-full">
          <div className="mt-12 pt-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Ready to Sell or Rent?
            </h2>
            <p className="text-gray-600 mb-6 text-center">
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

      <h1 className="text-2xl font-bold text-center mb-6 mt-10">My Listings</h1>
      <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {listing.map((item) => (
          <ListingUI key={item.id} id={item.id} data={item.data} />
        ))}
      </ul>
    </div>
  );
}
