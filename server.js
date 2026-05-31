const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.json());
// එකම ෆෝල්ඩරයේ තියෙන index.html එක සර්වර් එකෙන් පෙන්නන්න අවසර දීම
app.use(express.static(path.join(__dirname))); 

// MongoDB කනෙක්ෂන් එක (ඔයාගේ පාස්වර්ඩ් එක හරියටම දාන්න)
const mongoURI = "mongodb+srv://bepigi3013_db_user:lVS7vHg3uhzFjJDG@hashuserver2.wjpqr2x.mongodb.net/?appName=hashuserver2";

mongoose.connect(mongoURI)
    .then(() => console.log("Premium Database Connected Successfully!"))
    .catch((err) => console.error("Database Connection Failed:", err));

// Schemas
const User = mongoose.model('User', new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now }
}));

const Chat = mongoose.model('Chat', new mongoose.Schema({
    name: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}));

// Routes
app.post('/register', async (req, res) => {
    try {
        const { name, phone } = req.body;
        if (!name || !phone) return res.status(400).json({ error: "Missing details" });

        await new User({ name, phone }).save();
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

app.post('/send', async (req, res) => {
    try {
        const { name, text } = req.body;
        if (!name || !text) return res.status(400).json({ error: "Missing message" });

        await new Chat({ name, text }).save();
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

app.get('/messages', async (req, res) => {
    try {
        const messages = await Chat.find().sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running! Go to http://localhost:${PORT}`));
