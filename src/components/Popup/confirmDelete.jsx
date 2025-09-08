import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";


export default function ConfirmDelete({ setShowDeletePopup, docId }) {
  async function deleteItem() {
    try {
      const docRef = doc(db, "list_data", docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }

  function onConfirm() {
    deleteItem();
    setShowDeletePopup(false);
  }

  function onCancel() {
    setShowDeletePopup(false);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50" style={{ zIndex: "10" }}>
      <div className="bg-white rounded-2xl shadow-lg w-80 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Are you sure you want to delete?
        </h2>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
