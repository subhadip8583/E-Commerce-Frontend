import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCaller from "../utils/apiCaller";
import "../styles/Admin.css";

const UpdateProduct = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    itemNumber: "",
    name: "",
    description: "",
    price: "",
    quantityAvailable: "",
    images: [],
  });

  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL;

  // Fetch existing product details
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const result = await apiCaller(
          `${backend}/item/getItemDetails/${id}`,
          "GET"
        );
        

        if (result?.success) {
          const item = result.data.item; // ✅ FIXED: changed from result.data
          setFormData({
            itemNumber: item.itemNumber || "",
            name: item.name || "",
            description: item.description || "",
            price: item.price || "",
            quantityAvailable: item.quantityAvailable || "",
            images: [],
          });

          setExistingImages(item.imgUrl || []);
        } else {
          toast.error(result.message || "Failed to load product");
        }
      } catch (err) {
        toast.error("Something went wrong while fetching the product");
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    

    if (name === "images") {
      const selected = Array.from(files);
      let newArr = [];
      newArr = [...formData.images, ...selected];
      setFormData((prev) => {
        return {
          ...prev,
          images: newArr,
        };
      });
      setPreviewUrls(newArr.map((f) => URL.createObjectURL(f)));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "images") {
        payload.append(key, value);
      }
    });

    const arr = [];
    formData.images.forEach((img) => {
      arr.push(img);
    });

    formData.images.forEach((img) => {
      payload.append("images", img); // ✅ Appending each image file individually
    });

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
   

    const result = await apiCaller(
      `${backend}/item/updateItem/${id}`,
      `${backend}/user/refreshJWT`,
      accessToken,
      refreshToken,
      "PUT",
      {},
      payload,
      true
    );

    if (result?.success) {
      toast.success("✅ Product updated successfully!");
      navigate(`/admin`);
    } else {
      toast.error(result?.message || "❌ Failed to update product.");
      if (
        result?.err === "Session expired. Please log in again." ||
        result?.err === "Session expired after retry. Please log in again."
      ) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/signin");
      }
    }
  };

  return (
    <div className="admin-page">
      <h2>Update Product</h2>
      <form
        onSubmit={handleUpdate}
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
            onBlur={(e) => handleChange(e)}
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
          Upload New Images:
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleChange}
            ref={fileInputRef}
          />
        </label>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div className="image-preview-container">
            {existingImages.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Existing ${idx + 1}`}
                className="preview-img"
              />
            ))}
          </div>
        )}

        {/* New image previews */}
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

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default UpdateProduct;
