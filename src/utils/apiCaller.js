export default async function apiCaller(
  endpoint,
  refreshEndpoint,
  accesstoken,
  refreshtoken,
  method = "GET",
  headers = {},
  body = {},
  hasFormData = false
) {
  try {
    const myHeaders = {
      ...headers
    };
    // Set initial access token
    if (accesstoken) {
      myHeaders["accesstoken"] = accesstoken;
    }

    if (!hasFormData) {
      body = JSON.stringify(body);
      myHeaders["Content-Type"] = "application/json";
    }

    console.log(body);

    // Step 1: Initial Request
    let response = await fetch(endpoint, {
      method,
      headers: myHeaders,
      body: method !== "GET" && method !== "HEAD" ? body : undefined,
    });

    let data = await response.json();
    console.log("Initial API Response:", data);

    // Step 2: Token expired — try refresh
    if (
      data.message === "Invalid or expired token" ||
      data.err === "Access token has expired"
    ) {
      console.warn("Access token expired. Refreshing...");

      const refreshRes = await fetch(refreshEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: refreshtoken }),
      });

      const refreshData = await refreshRes.json();
      console.log("Refresh response:", refreshData);

      if (refreshRes.ok && refreshData.success && refreshData.accessToken) {
        // ✅ Save new token
        localStorage.setItem("accessToken", refreshData.accessToken);

        // ✅ Create fresh headers for retry
        const retryHeaders = {
          ...myHeaders,
          accesstoken: refreshData.accessToken,
        };

        const retryRes = await fetch(endpoint, {
          method,
          headers: retryHeaders,
          body: method !== "GET" && method !== "HEAD" ? body : undefined,
        });

        const retryData = await retryRes.json();
        console.log("Retry response:", retryData);

        if (
          retryData.message === "Invalid or expired token" ||
          retryData.err === "Access token has expired"
        ) {
          return {
            success: false,
            err: "Session expired after retry. Please log in again.",
          };
        }

        return {
          success: true,
          data: retryData,
        };
      } else {
        return {
          success: false,
          err: "Session expired. Please log in again.",
        };
      }
    }

    // ✅ Step 3: All good
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("apiCaller error:", error);
    return {
      success: false,
      err: "Internal server error!",
    };
  }
}
