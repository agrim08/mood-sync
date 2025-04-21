# MoodTrack 🌈

A modern, intuitive mood tracking application that helps users monitor their emotional well-being and gain meaningful insights.

![MoodTrack](https://github.com/agrim08/mood-sync/raw/main/assets/banner.png)

## Features ✨

- **Daily Mood Logging** - Track your moods with customizable entries including intensity, notes, and activity tags
- **Secure Authentication** - JWT-based auth system with enhanced security features
- **Password Recovery** - Reset password securely via OTP validation
- **Comprehensive Analytics** - Visualize mood patterns with interactive weekly and monthly charts
- **AI-Powered Insights** - Receive personalized tips and observations based on your mood history
- **Clean, Modern UI** - Intuitive and responsive design works across all devices

## Tech Stack 🛠️

### Frontend
- React.js
- Redux for state management
- Chart.js for data visualization
- Tailwind CSS for styling
- Shadcn ui

### Backend
- Node.js with Express
- MongoDB for data storage
- JWT for authentication
- Nodemailer for OTP delivery
- Gemini integration for personalized insights

## Installation 📦

```bash
# Clone the repository
git clone https://github.com/yourname/moodtrack.git

# Navigate to project directory
cd moodtrack

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

## Usage 📱

1. **Register/Login** - Create an account or sign in securely
2. **Log Your Mood** - Record how you're feeling with our intuitive interface
3. **Add Context** - Include notes, activities, or factors affecting your mood
4. **View Insights** - Check your personalized dashboard for patterns and trends
5. **Get Recommendations** - Receive AI-powered suggestions to improve well-being

## API Documentation 📘

Our API is RESTful and follows standard conventions:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Create a new user account |
| `/api/auth/login` | POST | Authenticate user and receive JWT |
| `/api/auth/forgot-password` | POST | Initiate password reset with OTP |
| `/api/auth/reset-password` | POST | Reset password using validated OTP |
| `/api/moods` | GET | Retrieve mood entries with optional filters |
| `/api/moods` | POST | Create a new mood entry |
| `/api/moods/:id` | PUT | Update an existing mood entry |
| `/api/moods/:id` | DELETE | Remove a mood entry |
| `/api/insights` | GET | Retrieve AI-generated insights based on mood data |

## Screenshots 📸

<div style="display: flex; justify-content: space-between;">
  <img src="https://github.com/yourname/moodtrack/raw/main/assets/screenshot-login.png" width="32%" alt="Login Screen">
  <img src="https://github.com/yourname/moodtrack/raw/main/assets/screenshot-dashboard.png" width="32%" alt="Dashboard">
  <img src="https://github.com/yourname/moodtrack/raw/main/assets/screenshot-insights.png" width="32%" alt="Insights">
</div>


## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact 📧

Your Name - (https://www.linkedin.com/in/agrim-gupta08/) - agrimgupta8105@gmail.com

Project Link: [https://github.com/agrim08/mood-sync](https://github.com/agrim08/mood-sync)

---

Made with ❤️ and ☕
