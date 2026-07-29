import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Paper, Typography, TextField, Avatar, Fab, Tooltip } from '@mui/material';
import { SmartToy, Close, Send, AutoAwesome } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your GEB AI Assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = { id: Date.now(), text: input, isBot: false };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      let reply = "I'm sorry, I'm just a demo AI. Please connect me to a real LLM!";
      const query = newMsg.text.toLowerCase();
      
      if (query.includes("pending")) {
        reply = "Your registration might be pending due to incomplete document verification. Please check the Document Verification section.";
      } else if (query.includes("course") || query.includes("register")) {
        reply = "Based on your profile, I highly recommend the 'Leadership in Engineering' course. You can register from the Course Management tab.";
      } else if (query.includes("training")) {
        reply = "Your next scheduled training is 'Q3 Compliance Training' on August 10th.";
      } else if (query.includes("certificate")) {
        reply = "You have 3 earned certificates. You can view and download them in the Certification module.";
      }
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, isBot: true }]);
    }, 1000);
  };

  return (
    <>
      <Tooltip title="Ask AI Assistant" placement="left">
        <Fab 
          color="primary" 
          aria-label="chat" 
          onClick={toggleChat}
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            zIndex: 1000,
            boxShadow: '0 8px 16px rgba(56,189,248,0.4)',
            background: 'linear-gradient(45deg, #0F172A, #38BDF8)'
          }}
        >
          {isOpen ? <Close /> : <SmartToy />}
        </Fab>
      </Tooltip>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 100,
              right: 30,
              zIndex: 1000,
              width: 350,
              height: 500
            }}
          >
            <Paper elevation={12} sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4, overflow: 'hidden' }}>
              <Box sx={{ p: 2, background: 'linear-gradient(90deg, #0F172A, #1E293B)', color: 'white', display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', mr: 2 }}><AutoAwesome sx={{ color: '#38BDF8' }} /></Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">GEB AI Assistant</Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>Online • Ready to help</Typography>
                </Box>
                <IconButton onClick={toggleChat} sx={{ ml: 'auto', color: 'white' }} size="small">
                  <Close fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {messages.map((msg) => (
                  <Box key={msg.id} sx={{ display: 'flex', flexDirection: msg.isBot ? 'row' : 'row-reverse', alignItems: 'flex-end', gap: 1 }}>
                    {msg.isBot && <Avatar sx={{ width: 28, height: 28, bgcolor: '#38BDF8' }}><SmartToy sx={{ fontSize: 16 }} /></Avatar>}
                    <Box sx={{
                      maxWidth: '75%',
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: msg.isBot ? 'white' : '#38BDF8',
                      color: msg.isBot ? 'text.primary' : 'white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      borderBottomLeftRadius: msg.isBot ? 0 : 8,
                      borderBottomRightRadius: !msg.isBot ? 0 : 8,
                    }}>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{msg.text}</Typography>
                    </Box>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>

              <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Ask a question..."
                  size="small"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  sx={{ mr: 1, '& .MuiOutlinedInput-root': { borderRadius: 5 } }}
                />
                <IconButton onClick={handleSend} color="primary" sx={{ bgcolor: 'rgba(56,189,248,0.1)' }}>
                  <Send fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
