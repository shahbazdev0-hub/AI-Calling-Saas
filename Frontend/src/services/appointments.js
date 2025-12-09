// // frontend/src/services/appointments.js - NEW FILE

// import api from './api';

// const appointmentsService = {
//   /**
//    * Get all appointments
//    * @param {Object} params - Filter parameters
//    * @returns {Promise<Object>} Appointments list
//    */
//   getAppointments: async (params = {}) => {
//     try {
//       const response = await api.get('/appointments', { params });
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to fetch appointments:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get appointments for a specific date range
//    * @param {Date} startDate - Start date
//    * @param {Date} endDate - End date
//    * @returns {Promise<Object>} Appointments in date range
//    */
//   getAppointmentsByDateRange: async (startDate, endDate) => {
//     try {
//       const response = await api.get('/appointments', {
//         params: {
//           date_from: startDate.toISOString(),
//           date_to: endDate.toISOString()
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to fetch appointments by date:', error);
//       throw error;
//     }
//   },

//   /**
//    * Create a new appointment
//    * @param {Object} appointmentData - Appointment details
//    * @returns {Promise<Object>} Created appointment
//    */
//   createAppointment: async (appointmentData) => {
//     try {
//       const response = await api.post('/appointments', appointmentData);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to create appointment:', error);
//       throw error;
//     }
//   },

//   /**
//    * Update an appointment
//    * @param {string} appointmentId - Appointment ID
//    * @param {Object} updateData - Update data
//    * @returns {Promise<Object>} Updated appointment
//    */
//   updateAppointment: async (appointmentId, updateData) => {
//     try {
//       const response = await api.put(`/appointments/${appointmentId}`, updateData);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to update appointment:', error);
//       throw error;
//     }
//   },

//   /**
//    * Cancel an appointment
//    * @param {string} appointmentId - Appointment ID
//    * @param {string} reason - Cancellation reason
//    * @returns {Promise<Object>} Result
//    */
//   cancelAppointment: async (appointmentId, reason) => {
//     try {
//       const response = await api.post(`/appointments/${appointmentId}/cancel`, { reason });
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to cancel appointment:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get appointment statistics
//    * @returns {Promise<Object>} Statistics
//    */
//   getStats: async () => {
//     try {
//       const response = await api.get('/appointments/stats');
//       return response.data;
//     } catch (error) {
//       console.error('❌ Failed to fetch appointment stats:', error);
//       throw error;
//     }
//   }
// };

// export default appointmentsService;



// frontend/src/services/appointments.js

import api from './api';

export const appointmentsAPI = {
  // Get all appointments with filters
  getAll: (params = {}) => {
    return api.get('/appointments', { params });
  },

  // Get appointments by date range
  getByDateRange: (date_from, date_to) => {
    return api.get('/appointments', {
      params: { date_from, date_to }
    });
  },

  // Get single appointment
  getById: (id) => {
    return api.get(`/appointments/${id}`);
  },

  // Create appointment
  create: (data) => {
    return api.post('/appointments', data);
  },

  // Update appointment
  update: (id, data) => {
    return api.put(`/appointments/${id}`, data);
  },

  // Delete appointment
  delete: (id) => {
    return api.delete(`/appointments/${id}`);
  },

  // Get appointment stats
  getStats: () => {
    return api.get('/appointments/stats');
  },
};

export default appointmentsAPI;