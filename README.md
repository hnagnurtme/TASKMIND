# TASK MIND

**Time management based on personal energy levels**

## 🌟 Introduction

Students often face numerous deadlines, tasks, and group projects. However, energy levels aren't always consistent: sometimes alert, sometimes exhausted. **Energy-Aware Planner** helps you:

- Create and manage tasks with **Energy Level** (High / Medium / Low)
- Choose tasks that match your current energy state
- View deadlines on **Calendar View** to avoid being late
- Track **Analytics View** to understand your work habits

The application is built with **React + Firebase Firestore**, supporting realtime sync and multi-device usage.

## ⚡ Key Features

- **CRUD Tasks:** create, read, update, delete
- **Persistent storage:** stored on Firestore
- **3 views:**
  1. **List View:** task list, filter by energy
  2. **Calendar View:** tasks displayed on calendar
  3. **Analytics View:** charts analyzing work habits
- **Time handling:** deadline, completedAt, time statistics
- **20+ items:** filter + search to manage many tasks

## 🖼️ Layout Description

### Topbar
- Logo: `"TASK MIND"`
- Search bar: find task by name
- User menu (optional Google login if available)
- `+ Add Task` button (opens modal to create new task)

### Sidebar
- Navigation menu:
  - 📝 **Tasks** (List View)
  - 📅 **Calendar** (Calendar View)  
  - 📊 **Analytics** (Analytics View)
- Quick filters:
  - High Energy
  - Medium Energy
  - Low Energy
- Logout button (if auth enabled)

### Main Content
- **List View:** table/list of tasks, checkbox completed, edit/delete
- **Calendar View:** calendar component, show tasks by deadline
- **Analytics View:**
  - Pie chart: task distribution by energy-level
  - Bar chart: completed tasks by day/hour

## 🗄️ Firestore Schema

**Collection:** `users`

**Document structure:**

```json
{
  "id": "uid123",             // Firebase Auth uid hoặc custom id
  "name": "Nguyen Van A",
  "email": "nguyenvana@example.com",
  "tasks": [
    {
      "id": "task1",
      "title": "Finish AI report",
      "deadline": "2025-09-15T18:00:00.000Z",
      "energy": "high",        // "high" | "medium" | "low"
      "note": "For hackathon",
      "completed": false,
      "completedAt": null
    },
    {
      "id": "task2",
      "title": "Clean up files",
      "deadline": "2025-09-20T10:00:00.000Z",
      "energy": "low",
      "note": "Organize downloads folder",
      "completed": true,
      "completedAt": "2025-09-10T15:30:00.000Z"
    }
  ]
}
```

## 🚀 Cài đặt và Chạy

### Prerequisites
- Node.js >= 16
- Firebase account
- React development environment

### Installation
1. Clone repository:
```bash
git clone 
2. Cài đặt dependencies:
```bash
npm install
```

3. Cấu hình Firebase:
   - Tạo project mới trên Firebase Console
   - Bật Firestore Database
   - Copy Firebase config và thêm vào `.env`:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Chạy development server:
```bash
npm start
```

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS / Material-UI
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Google OAuth)
- **Charts:** Recharts / Chart.js
- **Calendar:** React Big Calendar
- **State Management:** React Hooks / Context API

## 📱 Responsive Design

Ứng dụng được thiết kế responsive cho:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🎯 Roadmap

- [ ] Dark mode support
- [ ] Notification system
- [ ] Export data (CSV/PDF)
- [ ] Team collaboration
- [ ] Mobile app (React Native)
- [ ] AI-powered task suggestions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

⭐ Nếu project này hữu ích, hãy cho một star nhé!