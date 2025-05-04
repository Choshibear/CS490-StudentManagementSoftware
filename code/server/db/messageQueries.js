const getConnection = require('../db');

// Send a new message
async function sendMessage(message) {
    const connection = await getConnection();
    const { sender_id, sender_role, receiver_id, receiver_role, subject, body } = message;
    const [result] = await connection.query(
        `INSERT INTO messages (sender_id, sender_role, receiver_id, receiver_role, subject, body, unread)
         VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
        [sender_id, sender_role, receiver_id, receiver_role, subject, body]
    );
    await connection.end();
    return result.insertId;
}

// Get all messages for a user (inbox + sent) with sender/receiver names
async function getMessagesForUser(role, id) {
    const connection = await getConnection();
    const [rows] = await connection.query(
        `SELECT m.*,
            CONCAT(
              COALESCE(s.firstName, t.firstName, p.firstName, a.firstName),
              ' ',
              COALESCE(s.lastName, t.lastName, p.lastName, a.lastName)
            ) AS senderName,
            CONCAT(
              COALESCE(s2.firstName, t2.firstName, p2.firstName, a2.firstName),
              ' ',
              COALESCE(s2.lastName, t2.lastName, p2.lastName, a2.lastName)
            ) AS receiverName
        FROM messages m
        LEFT JOIN students s ON m.sender_role = 'students' AND m.sender_id = s.studentId
        LEFT JOIN teachers t ON m.sender_role = 'teachers' AND m.sender_id = t.teacherId
        LEFT JOIN parents p ON m.sender_role = 'parents' AND m.sender_id = p.parentId
        LEFT JOIN admins a ON m.sender_role = 'admins' AND m.sender_id = a.adminId
        LEFT JOIN students s2 ON m.receiver_role = 'students' AND m.receiver_id = s2.studentId
        LEFT JOIN teachers t2 ON m.receiver_role = 'teachers' AND m.receiver_id = t2.teacherId
        LEFT JOIN parents p2 ON m.receiver_role = 'parents' AND m.receiver_id = p2.parentId
        LEFT JOIN admins a2 ON m.receiver_role = 'admins' AND m.receiver_id = a2.adminId
        WHERE (m.receiver_role = ? AND m.receiver_id = ?)
           OR (m.sender_role = ? AND m.sender_id = ?)
        ORDER BY m.timestamp DESC`,
        [role, id, role, id]
    );
    await connection.end();
    return rows;
}

// Mark message as read
async function markMessageAsRead(messageId) {
    const connection = await getConnection();
    await connection.query(
        `UPDATE messages SET unread = FALSE WHERE id = ?`,
        [messageId]
    );
    await connection.end();
}

module.exports = {
    sendMessage,
    getMessagesForUser,
    markMessageAsRead
};
