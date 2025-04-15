import React, { useState } from "react";
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

const initialMessages = [
  {
    id: 1,
    sender: "Sarah Student",
    subject: "Question about Assignment",
    date: "April 7, 2025",
    body: "I'm having trouble understanding the third question on the worksheet. Could you please provide additional information?",
    unread: true
  },
  {
    id: 2,
    sender: "John Parent",
    subject: "Absence Request",
    date: "April 5, 2025",
    body: "My child will be absent due to a family emergency. Please let us know if any work needs to be made up.",
    unread: true
  },
  {
    id: 3,
    sender: "Principal Johnson",
    subject: "Staff Meeting",
    date: "April 6, 2025",
    body: "Reminder: Staff meeting scheduled for tomorrow at 3 PM in the library.",
    unread: true
  },
  {
    id: 4,
    sender: "You",
    subject: "Re: Question about Assignment",
    date: "April 7, 2025",
    body: "Sure! For question 3, remember to divide both sides by the coefficient first.",
    unread: false
  }
];

function Inbox() {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState(initialMessages[0]);
  const [replyText, setReplyText] = useState("");
  const [openCompose, setOpenCompose] = useState(false);
  const [activeTab, setActiveTab] = useState("Inbox");

  const inboxMessages = messages.filter((msg) => msg.sender !== "You");
  const sentMessages = messages.filter((msg) => msg.sender === "You");

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    if (msg.unread) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id ? { ...m, unread: false } : m
        )
      );
    }
  };

  return (
    <Box display="flex" height="100%" sx={{ minHeight: "90vh" }}>
      {/* Sidebar */}
      <Box width="280px" bgcolor="#f9f9f9" borderRight="1px solid #ccc" p={2}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            mb: 3,
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" }
          }}
          onClick={() => setOpenCompose(true)}
        >
          Compose New Message
        </Button>

        {/* Tabs */}
        <Box display="flex" mb={2}>
          <Button
            fullWidth
            onClick={() => setActiveTab("Inbox")}
            variant={activeTab === "Inbox" ? "contained" : "outlined"}
            sx={{
              backgroundColor: activeTab === "Inbox" ? "#1976d2" : "transparent",
              color: activeTab === "Inbox" ? "#fff" : "#000"
            }}
          >
            Inbox
          </Button>
          <Button
            fullWidth
            onClick={() => setActiveTab("Sent")}
            variant={activeTab === "Sent" ? "contained" : "outlined"}
            sx={{
              backgroundColor: activeTab === "Sent" ? "#1976d2" : "transparent",
              color: activeTab === "Sent" ? "#fff" : "#000"
            }}
          >
            Sent
          </Button>
        </Box>

        <List>
          {(activeTab === "Inbox" ? inboxMessages : sentMessages).map((msg) => (
            <ListItem
              button
              key={msg.id}
              onClick={() => handleSelectMessage(msg)}
              selected={selectedMessage.id === msg.id}
              sx={{
                mb: 1,
                backgroundColor: selectedMessage.id === msg.id ? "#e3f2fd" : "inherit",
                borderRadius: "8px"
              }}
            >
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <strong>{msg.sender}</strong>
                    {msg.unread && (
                      <Box
                        width={8}
                        height={8}
                        borderRadius="50%"
                        bgcolor="blue"
                      />
                    )}
                  </Box>
                }
                secondary={
                  <>
                    <span>{msg.subject}</span>
                    <br />
                    <small>{msg.date}</small>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Message Content */}
      <Box flexGrow={1} p={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {selectedMessage.subject}
        </Typography>
        <Typography variant="subtitle1">
          <strong>From:</strong> {selectedMessage.sender}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Date:</strong> {selectedMessage.date}
        </Typography>
        <Typography variant="body1" mb={3}>
          {selectedMessage.body}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Reply
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Type your reply here..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" }
          }}
        >
          Send Reply
        </Button>
      </Box>

      {/* Compose Message Dialog */}
      <Dialog open={openCompose} onClose={() => setOpenCompose(false)} fullWidth maxWidth="sm">
        <DialogTitle>Compose New Message</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="To" />
          <TextField fullWidth margin="dense" label="Subject" />
          <TextField fullWidth margin="dense" multiline rows={4} label="Message" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCompose(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenCompose(false)}
            sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#1565c0" } }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Inbox;
