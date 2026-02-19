import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const createGroup = (req, res) => {
  console.log("Received request to create group:", req.body);
  
  const token = req.cookies.accessToken;
  if (!token) {
    console.log("No access token found");
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.status(403).json("Token is not valid!");
    }

    console.log("User verified:", userInfo);

    const q = "INSERT INTO study_groups (`name`, `description`, `course`, `type`, `image`, `created_by`) VALUES (?)";
    const values = [
      req.body.name,
      req.body.description,
      req.body.course,
      req.body.type,
      req.body.image,
      userInfo.id,
    ];

    console.log("Attempting to insert group with values:", values);

    db.query(q, [values], (err, data) => {
      if (err) {
        console.error("Error inserting group:", err);
        return res.status(500).json(err);
      }

      console.log("Group inserted successfully, adding creator as admin");
      
      // Add creator as admin member
      const groupId = data.insertId;
      const memberQ = "INSERT INTO group_members (`user_id`, `group_id`, `role`) VALUES (?)";
      const memberValues = [userInfo.id, groupId, 'admin'];

      db.query(memberQ, [memberValues], (err, memberData) => {
        if (err) {
          console.error("Error adding creator as admin:", err);
          return res.status(500).json(err);
        }
        console.log("Creator added as admin successfully");
        return res.status(200).json("Study group has been created.");
      });
    });
  });
};

export const getGroups = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT sg.*, 
             u.name AS creator_name,
             u.profilePic AS creator_pic,
             COUNT(DISTINCT gm.user_id) as member_count,
             MAX(CASE WHEN gm.user_id = ? THEN 1 ELSE 0 END) as is_member
      FROM study_groups sg
      JOIN users u ON u.id = sg.created_by
      LEFT JOIN group_members gm ON gm.group_id = sg.id
      WHERE sg.type = 'public' OR EXISTS (
        SELECT 1 FROM group_members 
        WHERE group_id = sg.id AND user_id = ?
      )
      GROUP BY sg.id
      ORDER BY sg.createdAt DESC
    `;

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getMyGroups = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT sg.*, 
             u.name AS creator_name,
             u.profilePic AS creator_pic,
             COUNT(DISTINCT gm2.user_id) as member_count,
             gm1.role as user_role
      FROM study_groups sg
      JOIN users u ON u.id = sg.created_by
      JOIN group_members gm1 ON gm1.group_id = sg.id AND gm1.user_id = ?
      LEFT JOIN group_members gm2 ON gm2.group_id = sg.id
      GROUP BY sg.id
      ORDER BY sg.createdAt DESC
    `;

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getGroupInvites = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT gi.*, 
             sg.name, 
             sg.description,
             sg.image,
             sg.course,
             u.name AS inviter_name,
             u.profilePic AS inviter_pic,
             COUNT(DISTINCT gm.user_id) as member_count
      FROM group_invites gi
      JOIN study_groups sg ON gi.group_id = sg.id
      JOIN users u ON gi.invited_by = u.id
      LEFT JOIN group_members gm ON gm.group_id = sg.id
      WHERE gi.user_id = ? AND gi.status = 'pending'
      GROUP BY gi.id
      ORDER BY gi.createdAt DESC
    `;

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const joinGroup = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const groupId = req.params.groupId;

    // Check if group is public
    const checkQ = "SELECT type FROM study_groups WHERE id = ?";
    db.query(checkQ, [groupId], (err, groupData) => {
      if (err) return res.status(500).json(err);
      if (!groupData[0]) return res.status(404).json("Group not found!");

      if (groupData[0].type === 'private') {
        return res.status(403).json("Cannot directly join private groups!");
      }

      const q = "INSERT INTO group_members (`user_id`, `group_id`) VALUES (?)";
      const values = [userInfo.id, groupId];

      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Joined group successfully!");
      });
    });
  });
};

export const leaveGroup = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const groupId = req.params.groupId;

    // Check if user is not the last admin
    const checkQ = `
      SELECT COUNT(*) as admin_count 
      FROM group_members 
      WHERE group_id = ? AND role = 'admin'
    `;

    db.query(checkQ, [groupId], (err, countData) => {
      if (err) return res.status(500).json(err);

      const q = "DELETE FROM group_members WHERE user_id = ? AND group_id = ?";
      db.query(q, [userInfo.id, groupId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Left group successfully!");
      });
    });
  });
};

export const handleInvite = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { inviteId, status } = req.params;

    const q = "UPDATE group_invites SET status = ? WHERE id = ? AND user_id = ?";
    db.query(q, [status, inviteId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);

      if (status === 'accepted') {
        // Get group_id from invite
        const getGroupQ = "SELECT group_id FROM group_invites WHERE id = ?";
        db.query(getGroupQ, [inviteId], (err, groupData) => {
          if (err) return res.status(500).json(err);

          // Add user to group members
          const joinQ = "INSERT INTO group_members (`user_id`, `group_id`) VALUES (?)";
          const values = [userInfo.id, groupData[0].group_id];

          db.query(joinQ, [values], (err, joinData) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Invite accepted and joined group!");
          });
        });
      } else {
        return res.status(200).json("Invite " + status);
      }
    });
  });
};

export const searchGroups = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { query, filter } = req.query;
    let q = `
      SELECT sg.*, 
             u.name AS creator_name,
             u.profilePic AS creator_pic,
             COUNT(DISTINCT gm.user_id) as member_count,
             MAX(CASE WHEN gm.user_id = ? THEN 1 ELSE 0 END) as is_member
      FROM study_groups sg
      JOIN users u ON u.id = sg.created_by
      LEFT JOIN group_members gm ON gm.group_id = sg.id
      WHERE (sg.name LIKE ? OR sg.description LIKE ? OR sg.course LIKE ?)
    `;

    let params = [userInfo.id, `%${query}%`, `%${query}%`, `%${query}%`];

    if (filter === 'public' || filter === 'private') {
      q += " AND sg.type = ?";
      params.push(filter);
    }

    q += " GROUP BY sg.id ORDER BY sg.createdAt DESC";

    db.query(q, params, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
}; 


export const addPost = (req, res) => {
  const { imageUrl, caption } = req.body; // Get imageUrl and caption from the request body

  if (!imageUrl || !caption) {
    return res.status(400).json("Image URL and caption are required!");
  }

  // SQL query to create the 'posts' table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      imageUrl VARCHAR(255) NOT NULL,
      caption TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // First, create the table if it doesn't exist
  db.query(createTableQuery, (err) => {
    if (err) {
      return res.status(500).json("Error creating table: " + err.message);
    }

    // SQL query to insert the new post into the 'posts' table
    const insertQuery = `
      INSERT INTO posts (imageUrl, caption)
      VALUES (?, ?)
    `;

    const params = [imageUrl, caption];

    // Insert the post into the table
    db.query(insertQuery, params, (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json("Post added successfully!");
    });
  });
};

