import { db } from '../db.js';

export const StudyGroup = {
  // Create a new study group
  create: (groupData) => {
    return new Promise((resolve, reject) => {
      const q = "INSERT INTO study_groups (name, description, course, type, image, created_by) VALUES (?)";
      const values = [
        groupData.name,
        groupData.description,
        groupData.course,
        groupData.type,
        groupData.image,
        groupData.userId
      ];

      db.query(q, [values], (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  },

  // Get all public study groups
  getAllPublic: () => {
    return new Promise((resolve, reject) => {
      const q = `
        SELECT sg.*, COUNT(m.user_id) as members_count 
        FROM study_groups sg 
        LEFT JOIN group_members m ON sg.id = m.group_id 
        WHERE sg.type = 'public' 
        GROUP BY sg.id
      `;
      
      db.query(q, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  },

  // Get groups a user is a member of
  getUserGroups: (userId) => {
    return new Promise((resolve, reject) => {
      const q = `
        SELECT sg.*, COUNT(m2.user_id) as members_count 
        FROM study_groups sg 
        JOIN group_members m1 ON sg.id = m1.group_id 
        LEFT JOIN group_members m2 ON sg.id = m2.group_id 
        WHERE m1.user_id = ? 
        GROUP BY sg.id
      `;
      
      db.query(q, [userId], (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  },

  // Get group invites for a user
  getUserInvites: (userId) => {
    return new Promise((resolve, reject) => {
      const q = `
        SELECT sg.*, COUNT(m.user_id) as members_count 
        FROM study_groups sg 
        JOIN group_invites gi ON sg.id = gi.group_id 
        LEFT JOIN group_members m ON sg.id = m.group_id 
        WHERE gi.user_id = ? AND gi.status = 'pending' 
        GROUP BY sg.id
      `;
      
      db.query(q, [userId], (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  },

  // Join a group
  joinGroup: (userId, groupId) => {
    return new Promise((resolve, reject) => {
      const q = "INSERT INTO group_members (user_id, group_id) VALUES (?, ?)";
      
      db.query(q, [userId, groupId], (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  },

  // Leave a group
  leaveGroup: (userId, groupId) => {
    return new Promise((resolve, reject) => {
      const q = "DELETE FROM group_members WHERE user_id = ? AND group_id = ?";
      
      db.query(q, [userId, groupId], (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  },

  // Handle group invite
  handleInvite: (userId, groupId, status) => {
    return new Promise((resolve, reject) => {
      const q = "UPDATE group_invites SET status = ? WHERE user_id = ? AND group_id = ?";
      
      db.query(q, [status, userId, groupId], (err, data) => {
        if (err) return reject(err);
        
        if (status === 'accepted') {
          // If accepted, add to group_members
          return StudyGroup.joinGroup(userId, groupId)
            .then(() => resolve(data))
            .catch(reject);
        }
        
        resolve(data);
      });
    });
  },

  // Search groups
  search: (query, filter) => {
    return new Promise((resolve, reject) => {
      let q = `
        SELECT sg.*, COUNT(m.user_id) as members_count 
        FROM study_groups sg 
        LEFT JOIN group_members m ON sg.id = m.group_id 
        WHERE (sg.name LIKE ? OR sg.description LIKE ? OR sg.course LIKE ?)
      `;
      
      const searchTerm = `%${query}%`;
      let params = [searchTerm, searchTerm, searchTerm];

      if (filter === 'public' || filter === 'private') {
        q += " AND sg.type = ?";
        params.push(filter);
      } else if (filter === 'course') {
        q += " AND sg.course IS NOT NULL";
      }

      q += " GROUP BY sg.id";
      
      db.query(q, params, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }
};

export default StudyGroup; 