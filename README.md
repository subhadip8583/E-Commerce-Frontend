# 🛒 Fleximart – E-Commerce Frontend

Welcome to **Fleximart**, a modern, responsive frontend built with **React** to power a seamless e-commerce user experience.

🌐 Live App: [https://fleximart.netlify.app](https://fleximart.netlify.app)

---

## 🔑 Live Access Credentials

- **User Access**
  - Email: `user@gmail.com`
  - Password: `123456`

- **Admin Access** (Product Management Only)
  - Email: `admin@gmail.com`
  - Password: `123456`
  - Visit: [https://fleximart.netlify.app/admin](https://fleximart.netlify.app/admin)

---

## ⚙️ Tech Stack & Architecture

- **React** (Hooks & useState for state management)
- **React Router** for navigation
- **Fetch API** for data fetching
- **Cloudinary** for product image upload & storage
- **Material-UI / Tailwind CSS** for styling
- **Netlify** for deployment

### 🏗️ Architecture Flow

```
User Interaction
      ↓
React Components (useState + props drilling)
      ↓
Fetch API → Backend APIs
      ↓
Backend (Node/Express) → MongoDB
      ↓
Cloudinary → Image Hosting & Delivery
```

---

## ✨ Key Features & User Flow

### 🏠 Home & Products
- Product browsing with filters and search
- Product images served via **Cloudinary**
- Add items to cart directly

### 🛒 Cart & Checkout
- Quantity management
- Summary display and order initiation

### 👤 User Auth & Profile
- Secure login/signup
- Profile viewing and updates

### 🛠️ Admin Dashboard
- Add/edit/delete products
- Upload product images to **Cloudinary**
- Secure admin-only access

---

## 🛠️ Installation & Local Setup

```bash
git clone https://github.com/subhadip8583/E-Commerce-Frontend.git
cd E-Commerce-Frontend
npm install
```

Add a `.env.local` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

Run the app locally:

```bash
npm start
```

---

## 📜 Available Scripts

| Command       | Description                       |
|----------------|-----------------------------------|
| `npm start`     | Run app in development mode       |
| `npm run build` | Create optimized production build |
| `npm test`      | Run test suite (if configured)    |

---

## 📂 Component Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── CartItem.jsx
├── pages/
│   ├── Home.jsx
│   ├── ProductDetails.jsx
│   ├── Cart.jsx
│   ├── Login.jsx
│   └── AdminPanel.jsx
├── utils/
│   └── api.js
├── App.js
└── index.js
```

---

## ☁️ Cloudinary Image Upload Example

Product images are uploaded directly to **Cloudinary** via the **Fetch API**:

```js
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};
```

---

## 💡 Development Best Practices

- Use **functional components** and **React Hooks (useState, useEffect)**.  
- Keep components modular and reusable.  
- Optimize images using **Cloudinary transformations**.  
- Centralize API calls inside `utils/api.js` for maintainability.  

---

## 🚀 Testing & Deployment

- Local server: `http://localhost:3000`  
- Production: [https://fleximart.netlify.app](https://fleximart.netlify.app)  
- Ensure `.env` variables are configured in **Netlify dashboard**.  

---

## 🤝 Contribution Flow

1. Fork the repo  
2. Create a branch: `git checkout -b feature/your-feature`  
3. Commit changes: `git commit -m "Add your feature description"`  
4. Push: `git push origin feature/your-feature`  
5. Open a Pull Request for review  

---

## 📜 License & Credits

Licensed under **MIT**.  
Developed by **Subhadip Adhikary** – thank you for visiting!
