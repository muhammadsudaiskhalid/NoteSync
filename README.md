# 📚 NoteSync

> AI-Powered Lecture Note-Taking Application for Students

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)

NoteSync transforms your lectures into smart, organized notes using AI. Perfect for Pakistani students with support for Urdu-English code-mixing.

![NoteSync Demo](https://via.placeholder.com/800x400?text=NoteSync+Demo)

## ✨ Features

### 🎙️ Smart Recording
- **Real-time Speech-to-Text** - Live transcription as you speak
- **Multi-language Support** - English, Urdu, and code-mixing
- **Pause & Resume** - Full control over your recording
- **Bluetooth Mic Support** - Works with wireless microphones

### 🤖 AI-Powered Intelligence
- **Smart Summarization** - AI extracts key concepts using Google Gemini
- **Key Points Extraction** - Automatically identifies important topics
- **Definition Detection** - Highlights key terms and definitions
- **Exam Focus** - Filters out casual conversation, keeps study material

### 🏷️ Organization & Management
- **Categories** - Organize by subject (Computer Science, Mathematics, etc.)
- **Custom Tags** - Add your own tags for easy filtering
- **Advanced Search** - Find lectures instantly
- **Filter System** - Combine search, categories, and tags

### 🔐 Secure Authentication
- **User Accounts** - Secure JWT-based authentication
- **Profile Management** - Track your university, major, and education level
- **Private Lectures** - Only you can see your notes
- **Data Security** - Encrypted passwords with bcrypt

## 🚀 Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- Web Speech API
- Axios

**Backend:**
- Node.js + Express
- MongoDB Atlas
- Mongoose ODM
- JWT Authentication
- Bcrypt

**AI & APIs:**
- Google Gemini 2.0 Flash
- Web Speech API (Browser)

## 💻 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier)
- Google Gemini API key (free)

### 1. Clone Repository
```bash
git clone https://github.com/muhammadsudaiskhalid/NoteSync.git
cd NoteSync
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

**Configure `.env`:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

**Get API Keys:**
- MongoDB: https://www.mongodb.com/cloud/atlas
- Gemini AI: https://makersuite.google.com/app/apikey

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Open `http://localhost:3000` in your browser!

## 📖 Usage Guide

### 1. Create Account
- Sign up with email, name, university, and field of study
- Secure authentication with encrypted passwords

### 2. Record Lecture
- Click "Record Lecture"
- Enter title, subject, category, and tags
- Select language (English/Urdu/Mixed)
- Click "Start Recording" and speak
- Click "Stop" when done

### 3. Generate Smart Notes
- Click "Summarize" to get AI-generated notes
- Review key points, definitions, and exam topics
- Click "Save Lecture"

### 4. Access Your Notes
- View all lectures in "Lecture History"
- Filter by category, tags, or search
- Expand to see full transcript
- Copy or download notes

## 🎯 Perfect For

- 🎓 University students in Pakistan
- 📚 Students with mixed-language lectures (Urdu-English)
- 🧠 Anyone who wants to focus on learning instead of note-taking
- 📝 Students preparing for exams

## 🌟 Key Highlights

| Feature | Description |
|---------|-------------|
| 💯 Free | Completely free to use with free-tier APIs |
| 🌐 Multilingual | Supports English, Urdu, and code-mixing |
| 🤖 AI-Powered | Smart summarization with Google Gemini |
| 🔒 Secure | JWT authentication & encrypted passwords |
| 📱 Responsive | Works on desktop and mobile |
| ⚡ Real-time | Live transcription as you speak |

## 🛠️ Project Structure
```
NoteSync/
├── backend/              # Node.js + Express API
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── services/        # External services (Gemini AI)
│   ├── middleware/      # Auth & error handling
│   └── server.js        # Entry point
│
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   ├── utils/       # Helper functions
│   │   └── App.jsx      # Main component
│   └── public/          # Static files
│
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Muhammad Sudais Khalid**
- GitHub: [@muhammadsudaiskhalid](https://github.com/muhammadsudaiskhalid)

## 🙏 Acknowledgments

- Google Gemini AI for free API access
- MongoDB Atlas for free database hosting
- Web Speech API for browser-based transcription
- All students who inspired this project


## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact: msudaiskhalid.ai@gmail.com
- Website: [Sudais Khalid](https://sudaiskhalid.com/)
- LinkedIn: [Sudais Khalid - LinkedIn](https://www.linkedin.com/sudais-khalid)

---
**Made with ❤️ for students in Pakistan**

*Empowering students to learn smarter, not harder*

**Happy Learning! 🎓**