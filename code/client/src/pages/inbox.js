import React, { useState, useContext, useEffect } from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { ThemeContext } from "../ThemeContext";

function Inbox() {
  const { scheme } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [openCompose, setOpenCompose] = useState(false);
  const [activeTab, setActiveTab] = useState("Inbox");
  const [recipientRole, setRecipientRole] = useState("");
  const [recipientList, setRecipientList] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.studentId || user.teacherId || user.parentId || user.adminId;
  const userRole = user.studentId ? "students"
    : user.teacherId ? "teachers"
    : user.parentId ? "parents"
    : "admins";

    const refreshMessages = () => {
      fetch(`/api/messages/${userRole}/${userId}`)
        .then(res => res.json())
        .then(data => {
          const formatted = data.map(msg => ({
            ...msg,
            sender: msg.senderName || "Unknown",
            to: msg.receiverName || "Unknown",
            unread: Boolean(msg.unread) && msg.receiver_id === userId && msg.receiver_role === userRole
          }));
          setMessages(formatted);
        })
        .catch(err => console.error("Failed to refresh messages:", err));
    };
    
    
  useEffect(() => {
    refreshMessages();
  }, []);

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    fetch(`/api/messages/read/${msg.id}`, { method: "PUT" });
    window.dispatchEvent(new Event("refreshUnread"));
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, unread: false } : m));
  };

  const handleSendMessage = () => {
    fetch('/api/messages', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: userId,
        sender_role: userRole,
        receiver_id: recipientId,
        receiver_role: recipientRole,
        subject,
        body: messageBody
      })
    })
      .then(res => res.json())
      .then(() => {
        setOpenCompose(false);
        setSubject("");
        setMessageBody("");
        setRecipientId("");
        setRecipientRole("");
        window.dispatchEvent(new Event("refreshUnread"));
        refreshMessages();
      })
      .catch(err => console.error("Failed to send message:", err));
  };

  const handleReply = () => {
    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: userId,
        sender_role: userRole,
        receiver_id: selectedMessage.sender_id,
        receiver_role: selectedMessage.sender_role,
        subject: `Re: ${selectedMessage.subject}`,
        body: replyText
      })
    })
      .then(res => res.json())
      .then(() => {
        setReplyText("");
        refreshMessages();
      })
      .catch(err => {
        console.error("Failed to send reply:", err);
        alert("Failed to send reply.");
      });
  };

  const inboxMessages = messages.filter(msg => msg.receiver_id === userId && msg.receiver_role === userRole);
  const sentMessages = messages.filter(msg => msg.sender_id === userId && msg.sender_role === userRole);

  return (
    <Box sx={{ display: "flex", minHeight: "90vh", bgcolor: scheme.mainBg, color: scheme.text }}>
      <Box width={280} sx={{ bgcolor: scheme.panelBg, borderRight: `1px solid ${scheme.text}`, p: 2 }}>
        <Button variant="contained" fullWidth onClick={() => setOpenCompose(true)} sx={{ mb: 3, backgroundColor: scheme.accent, color: scheme.panelBg, '&:hover': { backgroundColor: scheme.panelBg, color: scheme.accent } }}>
          Compose New Message
        </Button>
        <Box display="flex" mb={2} gap={1}>
          {["Inbox", "Sent"].map((tab) => (
            <Button key={tab} fullWidth onClick={() => setActiveTab(tab)} variant={activeTab === tab ? "contained" : "outlined"} sx={{ backgroundColor: activeTab === tab ? scheme.accent : "transparent", color: activeTab === tab ? scheme.panelBg : scheme.text, borderColor: scheme.text }}>
              {tab}
            </Button>
          ))}
        </Box>
        <List sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {(activeTab === 'Inbox' ? inboxMessages : sentMessages).map((msg) => (
            <ListItem key={msg.id} button selected={selectedMessage?.id === msg.id} onClick={() => handleSelectMessage(msg)} sx={{ mb: 1, borderRadius: 1, bgcolor: selectedMessage?.id === msg.id ? "#e3f2fd" : "transparent", border: selectedMessage?.id === msg.id ? "1px solid #90caf9" : "1px solid transparent", '&:hover': { bgcolor: "#f5f5f5" } }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: scheme.text }}>
                    <Typography component="span" fontWeight="bold">
                      {msg.sender}
                    </Typography>
                    {activeTab === "Inbox" && msg.unread && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: scheme.accent || "blue",
                          display: 'inline-block',
                          ml: 1
                        }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" sx={{ color: scheme.text }}>{msg.subject}</Typography>
                    <Typography variant="caption" sx={{ color: scheme.text }}>{new Date(msg.timestamp).toLocaleDateString()}</Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1, p: 4, bgcolor: "white", borderRadius: 2, boxShadow: 2 }}>
        {selectedMessage && (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">{selectedMessage.subject}</Typography>
            <Typography variant="body1" gutterBottom><strong>From:</strong> {selectedMessage.sender}</Typography>
            {activeTab === "Sent" && selectedMessage.to && (
              <Typography variant="body1" gutterBottom><strong>To:</strong> {selectedMessage.to}</Typography>
            )}
            <Typography variant="body1" gutterBottom><strong>Date:</strong> {new Date(selectedMessage.timestamp).toLocaleDateString()}</Typography>
            <Typography variant="body1" mt={2} mb={4}>{selectedMessage.body}</Typography>
            <Typography variant="h6" gutterBottom>Reply</Typography>
            <TextField fullWidth multiline rows={5} placeholder="Type your reply here..." variant="outlined" value={replyText} onChange={(e) => setReplyText(e.target.value)} sx={{ mb: 2 }} />
            <Button variant="contained" sx={{ backgroundColor: "#1976d2", color: "#fff", '&:hover': { backgroundColor: "#115293" } }} onClick={handleReply}>SEND REPLY</Button>
          </>
        )}
      </Box>

      <Dialog open={openCompose} onClose={() => setOpenCompose(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: scheme.panelBg, color: scheme.text } }}>
        <DialogTitle sx={{ color: scheme.text }}>Compose New Message</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Recipient Role"
            value={recipientRole}
            onChange={e => {
              const role = e.target.value;
              setRecipientRole(role);
              fetch(`/api/${role}`)
                .then(res => res.json())
                .then(data => setRecipientList(data))
                .catch(err => console.error(err));
            }}
            fullWidth
            margin="dense"
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
            sx={{ input: { color: scheme.text }, '& .MuiOutlinedInput-notchedOutline': { borderColor: scheme.text } }}
          >
            <option value="">Select role</option>
            <option value="teachers">Teacher</option>
            <option value="students">Student</option>
            <option value="parents">Parent</option>
            <option value="admins">Admin</option>
          </TextField>

          <TextField
            select
            label="Recipient"
            value={recipientId}
            onChange={e => setRecipientId(e.target.value)}
            fullWidth
            margin="dense"
            SelectProps={{ native: true }}
            disabled={!recipientRole}
            InputLabelProps={{ shrink: true }}
            sx={{ input: { color: scheme.text }, '& .MuiOutlinedInput-notchedOutline': { borderColor: scheme.text } }}
          >
            <option value="">Select recipient</option>
            {recipientList.map(person => (
              <option key={person.teacherId || person.studentId || person.parentId || person.adminId} value={person.teacherId || person.studentId || person.parentId || person.adminId}>
                {person.firstName} {person.lastName}
              </option>
            ))}
          </TextField>

          <TextField fullWidth margin="dense" label="Subject" value={subject} onChange={e => setSubject(e.target.value)} sx={{ input: { color: scheme.text }, '& .MuiOutlinedInput-notchedOutline': { borderColor: scheme.text } }} />
          <TextField fullWidth margin="dense" multiline rows={4} label="Message" value={messageBody} onChange={e => setMessageBody(e.target.value)} sx={{ input: { color: scheme.text }, '& .MuiOutlinedInput-notchedOutline': { borderColor: scheme.text } }} />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: scheme.text }} onClick={() => setOpenCompose(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSendMessage} sx={{ backgroundColor: scheme.accent, color: scheme.panelBg, '&:hover': { backgroundColor: scheme.panelBg, color: scheme.accent } }}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Inbox;
