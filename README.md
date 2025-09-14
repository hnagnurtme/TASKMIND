# TASK MIND – Preliminary Assignment Submission

## 🚀 Project Setup & Usage
**How to install and run your project:**  
1. Clone repository:
   ```bash
   git clone https://github.com/NAVER-Vietnam-AI-Hackathon/web-track-naver-vietnam-ai-hackathon-hnagnurtme
   cd web-track-naver-vietnam-ai-hackathon-hnagnurtme
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Create new project on Firebase Console
   - Enable Firestore Database
   - Copy Firebase config and add to `.env`:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. Run development server:
   ```bash
   npm start
   ```

## 🔗 Deployed Web URL or APK file
✍️ [TASKMIND](https://taskmind-gjro.onrender.com/)

## 🎥 Demo Video
**Demo video link (≤ 2 minutes):**  
✍️ [Demo Video](https://www.loom.com/share/your_demo_video_link)
## 💻 Project Introduction

### a. Overview
✍️ **TASK MIND** is an innovative task management application designed specifically for Vietnamese university students. Unlike traditional to-do apps that only focus on deadlines, TASK MIND introduces **energy-based task management** combined with **AI-powered recommendations**. The app helps students work more effectively by matching tasks to their current energy levels, reducing stress and increasing productivity through intelligent planning and visual analytics.

### b. Key Features & Function Manual
**🔹 1. Comprehensive Task Management (CRUD)**
* Create, edit, delete, and complete tasks with rich metadata
* Each task includes: title, deadline, priority (Low/Medium/High), complexity (Low/Medium/High), estimated duration, notes
* Overdue tasks automatically highlighted with visual indicators
* One-click task completion with timestamp tracking

**🔹 2. Realtime Cloud Synchronization**
* All data stored on Firebase Firestore ensuring:
  * Permanent storage (no data loss on reload)
  * Real-time multi-device synchronization (mobile – web – desktop)
  * Instant updates across all connected devices

**🔹 3. Multi-View Interface**
1. **List View**: Display tasks with Priority and Complexity tags, sidebar with Quick Filters (Today, High Priority, Medium Priority, Low Complexity), smart search functionality
2. **Calendar View**: 4 viewing modes (Month – Week – Day – Agenda), color-coded tasks by priority, deadline visualization to prevent scheduling conflicts
3. **Analytics View**: Complexity × Priority Heatmap showing task density matrix, Tasks distribution by Priority/Complexity, Completed Tasks Trend analysis over time

**🔹 4. Smart Time Management**
* Automatic status display: Today, Upcoming, Overdue
* Completion timestamp tracking for productivity analysis
* Total and average duration statistics per task category

**🔹 5. AI Assistant (Beta)**
* Direct chat interface for:
  * Quick queries about deadlines, pending tasks, overdue items
  * Task recommendations based on current energy level + Value vs Effort matrix
  * Auto Task Creation from Image (OCR): upload images (schedules, handwritten to-dos) for automatic task generation

### c. Unique Features (What's special about this app?) 
* **Energy-first Workflow**: Instead of only following deadlines, TASK MIND helps choose tasks that match your current energy state, reducing stress and increasing productivity
* **Automatic Priority Calculation**: Based on Value vs. Effort Matrix (Complexity × Impact) for intelligent task ranking
* **Complexity × Priority Heatmap**: Visual workload distribution matrix for quick priority identification
* **Completed Tasks Trend**: Time-based completion analysis helping students identify:
  * 📈 Peak productivity periods (daily/weekly patterns)
  * 📉 Low productivity times → can be improved by choosing appropriate tasks
* **3 Visual Modes**: List, Calendar, Analytics for comprehensive task overview
* **Integrated AI Assistant**: 
  * Next task suggestions based on energy level + priority matrix
  * Auto task creation from images (OCR / Image-to-Task)
  * Natural language chat for work status, deadlines, and habit analysis
* **Realtime Firestore sync**: Multi-device, permanent storage
* **Student-friendly UI**: Responsive design optimized for desktop/mobile usage patterns

### d. Technology Stack and Implementation Methods
**Frontend Technologies:**
* **React 18** with **TypeScript** for type-safe component development
* **Tailwind CSS** for utility-first responsive styling
* **Material-UI Components** for consistent design system
* **React Hooks & Context API** for efficient state management
* **React Big Calendar** for advanced calendar functionality
* **Recharts/Chart.js** for data visualization and analytics

**Backend & Database:**
* **Firebase Firestore** for real-time NoSQL database
* **Firebase Authentication** with Google OAuth integration
* **Firebase Hosting** for deployment and CDN

**AI Integration:**
* **OpenAI API/Claude API** for intelligent task recommendations

**Development & Deployment:**
* **Create React App** for project scaffolding
* **ESLint & Prettier** for code quality
* **Render** for production deployment
* **Git/GitHub** for version control

### e. Service Architecture & Database structure (when used)
✍️ 
**Service Architecture:**
```
[Frontend (React)] <--> [Firebase Firestore] <--> [Firebase Auth]
                    
                    <--> [Gemini-Server(ExpressJS)] <--> [OpenAI API / Claude API]
```         
**Database Structure (Firestore):**
Collection: `users`
```json
{
  "id": "uid123",
  "name": "Nguyen Van A",
  "email": "nguyenvana@example.com",
  "preferences": {
    "defaultView": "list",
    "theme": "light",
    "notifications": true
  },
  "tasks": [
    {
      "id": "task1",
      "title": "Finish AI report",
      "deadline": "2025-09-15T18:00:00.000Z",
      "priority": "high",
      "complexity": "medium",
      "estimatedDuration": 120,
      "note": "For hackathon submission",
      "completed": false,
      "completedAt": null,
      "createdAt": "2025-09-10T09:00:00.000Z"
    },
    {
      "id": "task2",
      "title": "Clean up downloads",
      "deadline": "2025-09-20T10:00:00.000Z",
      "priority": "low",
      "complexity": "low",
      "estimatedDuration": 30,
      "note": "Organize files and folders",
      "completed": true,
      "completedAt": "2025-09-10T15:30:00.000Z",
      "createdAt": "2025-09-08T14:20:00.000Z"
    }
  ]
}
```
**Security Rules:**
* User can only access their own data
* Authentication required for all operations
* Real-time validation on client and server side

## 🧠 Reflection
### a. If you had more time, what would you expand?
**User Experience Enhancements:**
* **Dark mode** with system preference detection and smooth transitions
* **Advanced notification system** with customizable reminders and push notifications
* **Drag-and-drop interface** for intuitive task reordering and calendar management
* **Keyboard shortcuts** for power users and accessibility improvements

**Collaboration Features:**
* **Team workspaces** with real-time collaboration and shared task lists
* **Task assignment** and delegation with notification system
* **Project templates** for common student workflows (study plans, group projects)
* **Integration** with popular tools like Google Calendar, Notion, Trello

**Advanced Analytics:**
* **Burndown charts** and velocity tracking for long-term projects
* **Productivity scoring** with personalized insights and recommendations
* **Habit tracking** with streak counters and achievement badges
* **Time tracking** with Pomodoro technique integration

**Mobile Experience:**
* **Native mobile app** (React Native/Flutter) with offline capabilities
* **Widget support** for quick task access from home screen
* **Voice commands** for hands-free task creation and management

### b. If you integrate AI APIs more for your app, what would you do?
**Intelligent Task Management:**
* **Smart Task Categorization**: Automatically classify tasks based on description using NLP, suggest optimal complexity and priority levels
* **Predictive Scheduling**: AI-powered calendar optimization based on personal productivity patterns, energy levels, and historical completion data
* **Personalized Recommendations**: Machine learning algorithms analyzing user behavior to suggest optimal work schedules and task sequences

**Advanced AI Features:**
* **Natural Language Task Creation**: Convert spoken or written instructions into structured tasks with automatic deadline estimation
* **Smart Deadline Prediction**: Analyze task complexity and personal velocity to suggest realistic completion dates
* **Burnout Prevention**: AI monitoring of workload patterns with proactive suggestions for breaks and task redistribution

**Enhanced OCR & Document Processing:**
* **Multi-language OCR** support for Vietnamese, English, and other languages commonly used by students
* **Smart Document Analysis**: Extract tasks from syllabi, assignment sheets, and course schedules with context understanding
* **Handwriting Recognition**: Advanced processing of handwritten notes and sketches into digital tasks

**Intelligent Analytics:**
* **Productivity Insights**: AI-generated reports on work patterns, efficiency trends, and optimization opportunities
* **Goal Setting Assistant**: Smart goal breakdown into manageable tasks with progress tracking and adaptive planning
* **Habit Formation**: AI-powered coaching for building productive habits with personalized motivation and feedback

**Integration Possibilities:**
* **Email Integration**: Auto-extract tasks from emails (assignments, deadlines) with smart prioritization
* **Social Learning**: AI matching students with similar goals for study groups and accountability partnerships
* **Academic Calendar Sync**: Intelligent integration with university systems for automatic assignment and exam scheduling

## ✅ Checklist
- [x] Code runs without errors  
- [x] All required features implemented (add/edit/delete/complete tasks)  
- [x] All ✍️ sections are filled