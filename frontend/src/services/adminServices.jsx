import api from "./api";

export const getUserAttendanceHistory = async (email) => {
  try {
    const response = await api.get(`/attendance/history`, {
      params: { email: email }
    });
    return response.data;
  } catch (err) {
    console.error(`Error loading attendance history for ${email}:`, err);
    throw err;
  }
};

export const getTasksByAttendanceId = async (attendanceId) => {
  try {
    const response = await api.get(`/tasks/attendance/${attendanceId}`);
    return response.data; 
  } catch (err) {
    console.error(`Error loading tasks for attendance ID ${attendanceId}:`, err);
    throw err;
  }
};