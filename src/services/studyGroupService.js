import axios from "axios";

const API_URL = "http://localhost:8800/api/study-groups";

export const studyGroupService = {
  // Create a new study group
  createGroup: async (groupData) => {
    try {
      const response = await axios.post(API_URL, groupData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all discoverable groups
  getDiscoverableGroups: async () => {
    try {
      const response = await axios.get(`${API_URL}/discover`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's groups
  getMyGroups: async () => {
    try {
      const response = await axios.get(`${API_URL}/my-groups`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get pending invites
  getInvites: async () => {
    try {
      const response = await axios.get(`${API_URL}/invites`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Join a group
  joinGroup: async (groupId) => {
    try {
      const response = await axios.post(`${API_URL}/join/${groupId}`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Leave a group
  leaveGroup: async (groupId) => {
    try {
      const response = await axios.delete(`${API_URL}/leave/${groupId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Handle invite
  handleInvite: async (inviteId, status) => {
    try {
      const response = await axios.put(`${API_URL}/invite/${inviteId}/${status}`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search groups
  searchGroups: async (query, filter = null) => {
    try {
      const params = new URLSearchParams({ query });
      if (filter) params.append('filter', filter);
      
      const response = await axios.get(`${API_URL}/search?${params}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 