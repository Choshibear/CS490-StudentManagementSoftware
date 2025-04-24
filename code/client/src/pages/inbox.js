import React, { useState, useContext } from "react";
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
  const { scheme } = useContext(ThemeContext);
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
        prev.map((m) => (m.id === msg.id ? { ...m, unread: false } : m))
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "90vh",
        bgcolor: scheme.mainBg,
        color: scheme.text
      }}
    >
      {/* Sidebar */}
      <Box
        width={280}
        sx={{
          bgcolor: scheme.panelBg,
          borderRight: `1px solid ${scheme.text}`,
          p: 2
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={() => setOpenCompose(true)}
          sx={{
            mb: 3,
            backgroundColor: scheme.accent,
            color: scheme.panelBg,
            '&:hover': { backgroundColor: scheme.panelBg, color: scheme.accent }
          }}
        >
          Compose New Message
        </Button>

        {/* Tabs */}
        <Box display="flex" mb={2} gap={1}>
          {['Inbox', 'Sent'].map((tab) => (
            <Button
              key={tab}
              fullWidth
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? 'contained' : 'outlined'}
              sx={{
                backgroundColor: activeTab === tab ? scheme.accent : 'transparent',
                color: activeTab === tab ? scheme.panelBg : scheme.text,
                borderColor: scheme.text
              }}
            >
              {tab}
            </Button>
          ))}
        </Box>

        <List sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {(activeTab === 'Inbox' ? inboxMessages : sentMessages).map((msg) => (
            <ListItem
              key={msg.id}
              button
              selected={selectedMessage.id === msg.id}
              onClick={() => handleSelectMessage(msg)}
              sx={{
                mb: 1,
                borderRadius: 1,
                bgcolor: selectedMessage.id === msg.id ? scheme.accent : scheme.panelBg,
                '&:hover': { bgcolor: scheme.mainBg }
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: scheme.text }}>
                    <Typography component="span" fontWeight="bold">
                      {msg.sender}
                    </Typography>
                    {msg.unread && (
                      <Box
                        sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: scheme.accent }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <>
                    <Typography component="span" sx={{ color: scheme.text }}>
                      {msg.subject}
                    </Typography>
                    <br />
                    <Typography component="small" sx={{ color: scheme.text }}>
                      {msg.date}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Message Content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: scheme.text }}>
          {selectedMessage.subject}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: scheme.text }}>
          <strong>From:</strong> {selectedMessage.sender}
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ color: scheme.text }}>
          <strong>Date:</strong> {selectedMessage.date}
        </Typography>
        <Typography variant="body1" mb={3} sx={{ color: scheme.text }}>
          {selectedMessage.body}
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ color: scheme.text }}>
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
          sx={{
            backgroundColor: scheme.panelBg,
            input: { color: scheme.text },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: scheme.text }
          }}
        />
        <Button
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: scheme.accent,
            color: scheme.panelBg,
            '&:hover': { backgroundColor: scheme.panelBg, color: scheme.accent }
          }}
        >
          Send Reply
        </Button>
      </Box>

      {/* Compose Message Dialog */}
      <Dialog
        open={openCompose}
        onClose={() => setOpenCompose(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: scheme.panelBg, color: scheme.text } }}
      >
        <DialogTitle sx={{ color: scheme.text }}>Compose New Message</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="To"
            sx={{
              input: { color: scheme.text },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: scheme.text }
            }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Subject"
            sx={{
              input: { color: scheme.text },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: scheme.text }
            }}
          />
          <TextField
            fullWidth
            margin="dense"
            multiline
            rows={4}
            label="Message"
            sx={{
              input: { color: scheme.text },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: scheme.text }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: scheme.text }} onClick={() => setOpenCompose(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenCompose(false)}
            sx={{
              backgroundColor: scheme.accent,
              color: scheme.panelBg,
              '&:hover': { backgroundColor: scheme.panelBg, color: scheme.accent }
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Inbox;
