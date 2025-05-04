const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessagesForUser,
  markMessageAsRead
} = require('../db/messageQueries');

// Send a new message
router.post('/', async (req, res) => {
  try {
    const newMessageId = await sendMessage(req.body);
    res.status(201).json({ message: 'Message sent!', id: newMessageId });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all messages for a user (both sent and received)
router.get('/:role/:id', async (req, res) => {
  const { role, id } = req.params;
  try {
    const messages = await getMessagesForUser(role, id);
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark a message as read
router.put('/read/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await markMessageAsRead(id);
    res.json({ message: 'Message marked as read' });
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
