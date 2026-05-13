import api from "./api";

export const handleLogOut = async () => {
    try {
        // get token to make sure it is available
        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("No token found, cleaning up local state.");
        } else {
            await api.post("/auth/logout");
            console.log("Backend session closed.");
        }
    } catch (err) {
        console.error("Logout API failed:", err.response?.data || err.message);
    } finally {
        // clear storage
        localStorage.clear();
        // localStorage.removeItem("token");
        // localStorage.removeItem("userRole");
        // localStorage.removeItem("username");
        // localStorage.removeItem("userId");

        // redirect to login page
        window.location.href = "/login";
    }
};