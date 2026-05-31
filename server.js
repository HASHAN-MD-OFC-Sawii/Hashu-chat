const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware (Frontend එකෙන් එන දත්ත කියවීමට සහ අවසර දීමට)
app.use(cors());
app.use(express.json());

// 1. MongoDB Database Connection
// මෙහි <db_password> වෙනුවට ඔබේ සැබෑ මුරපදය ඇතුළත් කරන්න.
const mongoURI = "mongodb+srv://bepigi3013_db_user:lVS7vHg3uhzFjJDG@hashuserver2.wjpqr2x.mongodb.net/?appName=hashuserver2";

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Database Connected Successfully!"))
    .catch((err) => console.error("Database Connection Failed:", err));

// 2. Database Schemas & Models
// ලියාපදිංචි වන අයගේ දත්ත සඳහා
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// පණිවිඩ (Chats) සඳහා
const chatSchema = new mongoose.Schema({
    name: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
const Chat = mongoose.model('Chat', chatSchema);

// 3. API Routes

// User Registration Route
app.post('/register', async (req, res) => {
    try {
        const { name, phone } = req.body;
        
        if (!name || !phone) {
            return res.status(400).json({ error: "Name and phone are required" });
        }

        const newUser = new User({ name, phone });
        await newUser.save();
        
        res.status(200).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Send Message Route
app.post('/send', async (req, res) => {
    try {
        const { name, text } = req.body;

        if (!name || !text) {
            return res.status(400).json({ error: "Name and message text are required" });
        }

        const newChat = new Chat({ name, text });
        await newChat.save();

        res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        console.error("Message Send Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get All Messages Route
app.get('/messages', async (req, res) => {
    try {
        // පණිවිඩ යැවූ කාලය අනුව අනුපිළිවෙලට ලබා ගැනීම (පරණම ඒවා මුලින්)
        const messages = await Chat.find().sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Fetch Messages Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 4. Start the Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running smoothly on http://localhost:${PORT}`);
});
