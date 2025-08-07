import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Admin.css";

import apiCaller from "../utils/apiCaller";
import checkUserRole from "../utils/checkUserRole";
const Admin = () => {
  const [fileList, setFileList] = useState([]);
  const [formData, setFormData] = useState({
    itemNumber: "",
    name: "",
    description: "",
    price: "",
    quantityAvailable: "",
    images: [],
  });

  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFileList((curr) => [...curr, ...files]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();

    // Append text fields
    for (let key of [
      "itemNumber",
      "name",
      "description",
      "price",
      "quantityAvailable",
    ]) {
      payload.append(key, formData[key]);
    }

    // Append image files
    formData.images.forEach((file) => {
      payload.append("images", file);
    });

    // Secure fetch with refresh logic
    const secureFetch = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const backend = import.meta.env.VITE_BACKEND_URL;
      let response = await apiCaller(
        `${backend}/item/createItem`,
        `${backend}/user/refreshJWT`,
        accessToken,
        localStorage.getItem("refreshToken"),
        "POST",
        {},
        payload,
        true
      );
      if (response.success) {
        return response.data;
      } else if (response.err === "Session expired. Please log in again.") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/signin");
        return null; // Redirected, exit function
      } else return null;
    };

    try {
      const data = await secureFetch();

      if (data.success) {
        toast.success("Product added successfully!");

        // Reset form
        setFormData({
          itemNumber: "",
          name: "",
          description: "",
          price: "",
          quantityAvailable: "",
          images: [],
        });

        setFileList([]);
        setPreviewUrls([]);

        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      } else {
        toast.error(data.message || "❌ Failed to add product.");
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      toast.error("⚠️ An error occurred while uploading.");
    }
  };

  useEffect(() => {
    const urls = fileList.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setFormData((prev) => ({ ...prev, images: fileList }));
    const verifyAccess = async () => {
      const result = await checkUserRole();
      if (!result.success || result.type !== "admin") {
        navigate("/"); // redirect if not a user
      }
    };

    verifyAccess();
  }, [fileList]);

  return (
    <div className="admin-page">
      <h2>Add New Product</h2>
      <form
        onSubmit={handleSubmit}
        className="admin-form"
        encType="multipart/form-data"
      >
        <label>
          Item Number:
          <input
            type="text"
            name="itemNumber"
            value={formData.itemNumber}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Product Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Price (₹):
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Quantity Available:
          <input
            type="number"
            name="quantityAvailable"
            value={formData.quantityAvailable}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Upload Product Images:
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
            ref={fileInputRef}
            required
          />
        </label>

        {previewUrls.length > 0 && (
          <div className="image-preview-container">
            {previewUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Preview ${idx + 1}`}
                className="preview-img"
              />
            ))}
          </div>
        )}

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default Admin;
