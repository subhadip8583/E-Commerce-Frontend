// utils/checkUserRole.js
const checkUserRole = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const backend = import.meta.env.VITE_BACKEND_URL;
  if (!accessToken) {
    return { success: false, reason: "No token" };
  }

  try {
    const res = await fetch(`${backend}/user/getRole`, {
      method: "GET",
      headers: {
        accesstoken: accessToken,
      },
    });

    const data = await res.json();

    if (!data.success || !data.type) {
      return { success: false, reason: "Invalid or expired token" };
    }

    return { success: true, type: data.type };
  } catch (err) {
    console.error("Error fetching user role:", err);
    return { success: false, reason: "Network/server error" };
  }
};

export default checkUserRole;
