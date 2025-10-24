# 📚 NoteSync

**AI-Powered Lecture Note-Taking Application**

NoteSync helps students focus on learning by automatically transcribing and summarizing lectures in real-time. Perfect for multilingual classrooms with Urdu-English code-mixing support.

## ✨ Features

- 🎤 **Real-time Audio Recording** - Record lectures with pause/resume functionality
- 🗣️ **Speech-to-Text** - Automatic transcription using Web Speech API (FREE!)
- 🌐 **Multilingual Support** - Handles Urdu-English code-mixing seamlessly
- 🤖 **AI Summarization** - Smart note generation using Google Gemini AI (FREE tier)
- 📝 **Key Points Extraction** - Automatically identifies important concepts
- 💾 **Save & Organize** - Store and manage all your lecture notes
- 📱 **Bluetooth Mic Support** - Works with wireless microphones
- 🎯 **Exam-Focused** - Filters out casual conversation, focuses on study material

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Web Speech API (for transcription)
- Axios

### Backend
- Node.js + Express
- MongoDB (with Mongoose)
- Google Gemini AI API
- Multer (file uploads)

## 📋 Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (or use MongoDB Atlas free tier)
- A Google Gemini API key (free - get it [here](https://makersuite.google.com/app/apikey))

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd NoteSync
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure your `.env` file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notesync
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:3000
```

**Start MongoDB** (if running locally):
```bash
# macOS/Linux
mongod

# Windows
net start MongoDB
```

**Start the backend server:**
```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The application will open at `http://localhost:3000`

## 🎯 Usage

### Recording a Lecture

1. **Enter Lecture Details**
   - Add a title (e.g., "Introduction to Machine Learning")
   - Specify the subject (e.g., "Computer Science")

2. **Start Recording**
   - Click the "Start Recording" button
   - Allow microphone access when prompted
   - The timer will show recording duration

3. **Control Recording**
   - Use Pause/Resume as needed
   - Click Stop when lecture ends

4. **Process Recording**
   - Click "Transcribe Audio" to convert speech to text
   - Click "Summarize Notes" to generate AI-powered summary
   - Review key points, definitions, and exam topics

5. **Save Your Notes**
   - Click "Save Lecture" to store in database
   - Access anytime from Lecture History

### Viewing Past Lectures

1. Switch to "Lecture History" tab
2. Browse all saved lectures
3. Click on any lecture to view details
4. Delete lectures you no longer need

## 🔧 Configuration

### Using MongoDB Atlas (Free Cloud Database)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notesync
```

### Getting Google Gemini API Key (FREE)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy and paste into `.env` file

**Free Tier Limits:**
- 15 requests per minute
- 1 million tokens per month
- Perfect for student use!

## 🎤 Using Bluetooth Microphone

1. Pair your Bluetooth microphone with laptop
2. Open browser settings
3. Set Bluetooth mic as default audio input
4. Grant microphone permissions to browser
5. Start recording in NoteSync

## 🌐 Supported Browsers

- ✅ Google Chrome (Recommended)
- ✅ Microsoft Edge
- ✅ Safari (macOS)
- ⚠️ Firefox (Limited support for Web Speech API)

## 📱 Supported Languages

- English
- Urdu
- English-Urdu Code-mixing (Hinglish/Urdish)

## 🐛 Troubleshooting

### Microphone not working
- Check browser permissions
- Ensure microphone is not used by another app
- Try refreshing the page

### Transcription not accurate
- Speak clearly and at moderate pace
- Ensure good microphone quality
- Reduce background noise

### MongoDB connection error
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure network connectivity for Atlas

### Gemini API errors
- Verify API key is correct
- Check free tier limits not exceeded
- Ensure internet connection is stable

## 📂 Project Structure

```
NoteSync/
├── backend/              # Node.js backend
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── services/        # External services (Gemini AI)
│   └── server.js        # Entry point
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API calls
│   │   └── utils/       # Helper functions
│   └── public/          # Static files
│
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ for students in Pakistan

## 🙏 Acknowledgments

- Google Gemini AI for free API
- MongoDB Atlas for free hosting
- React and Node.js communities

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact: msudaiskhalid.ai@gmail.com
- Website: [Sudais Khalid](https://sudaiskhalid.com/)
- LinkedIn: [Sudais Khalid - LinkedIn](https://www.linkedin.com/sudais-khalid)

---

**Happy Learning! 🎓**