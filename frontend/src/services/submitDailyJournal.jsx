import api from "./api";

export const submitDailyJournal = async (attendanceId) => {
  try {
    const response = await api.post(`/attendance/submit/${attendanceId}`);
    return response.data;
  } catch (err) {
    console.error("Error submitting daily journal ledger:", err);
    throw err;
  }
};