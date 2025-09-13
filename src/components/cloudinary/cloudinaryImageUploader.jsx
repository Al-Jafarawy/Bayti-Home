import { useState } from "react";
import SpinnerOverlay from "../spiner";

export default function CloudinaryImageUploader({ images, setImages }) {
  const maxImages = 3;
  const [uploading, setUploading] = useState(false);

  const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.REACT_APP_UNSIGNED_PRESET;

  const handleFiles = async (e) => {
    const selected = Array.from(e.target.files);
    if (images.length + selected.length > maxImages) {
      alert(`Maximum allowed images are ${maxImages}`);
      return;
    }

    setUploading(true);
    const uploadedUrls = [];

    for (let file of selected) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        if (data.secure_url) uploadedUrls.push(data.secure_url);
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setImages([...images, ...uploadedUrls]);
    setUploading(false);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="mb-2"
      />
      {uploading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/70 z-50">
          <SpinnerOverlay />
          <p className="mt-60 text-gray-700 text-lg font-medium">
            Please wait, images are being processed...
          </p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {images.map((url, idx) => (
          <div key={idx} className="relative border p-1 rounded">
            <img
              src={url}
              alt={`preview-${idx}`}
              className="w-20 h-20 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
