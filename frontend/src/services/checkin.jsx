import api from "./api";

// get latest attendance record for the logged in user
export const getLatestAttendance = async () => {
    try {
        const response = await api.get("/attendance/latest-attendance");
        return response.data;
    } catch (err) {
        console.error("Could not fetch attendance status");
        return null;
    }
};

export const checkin = async () => {
    try {

        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("No token found, cleaning up local state.");
        } else {
            await api.post("/attendance/check-in");
            console.log("Check in successful")
        }

    } catch (err) {
        console.error("Check in API failed: ", err.response?.data || err.message);
        throw err;
    } 
}

export const checkout = async () => {
    try {

        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("No token found, cleaning up local state.");
        } else {
            await api.post("/attendance/check-out");
            console.log("Check in successful")
        }

    } catch (err) {
        console.error("Check in API failed: ", err.response?.data || err.message);
        throw err;
    } 
}


