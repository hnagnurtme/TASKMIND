
# TASK MIND – Preliminary Assignment Submission

## 🚀 Project Setup & Usage
**How to install and run your project:**

1. Clone repository:
	 ```bash
	 git clone <your-repo-link>
	 cd web-track-naver-vietnam-ai-hackathon-hnagnurtme
	 ```
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

## 🔗 Deployed Web URL or APK file
[Paste your deployed web link here]

## 🎥 Demo Video
**Demo video link (≤ 2 minutes):**
[Paste your unlisted YouTube video link here]

## 📖 Function Manual
**TASK MIND** là ứng dụng quản lý thời gian dựa trên mức năng lượng cá nhân, giúp sinh viên đại học Việt Nam quản lý công việc hiệu quả hơn.

- **Tạo, xem, sửa, xóa task** (CRUD)
- **Lưu trữ vĩnh viễn** trên Firestore, đồng bộ realtime đa thiết bị
- **3 chế độ xem:**
	1. **List View:** Danh sách công việc, lọc theo mức năng lượng
	2. **Calendar View:** Hiển thị task trên lịch, tránh trùng deadline
	3. **Analytics View:** Biểu đồ phân tích thói quen làm việc
- **Xử lý thời gian:** deadline, completedAt, thống kê thời gian hoàn thành
- **Tìm kiếm, lọc, quản lý >20 task** dễ dàng

## 🛠 Technology Stack and Implementation Methods
- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS / Material-UI
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Google OAuth)
- **Charts:** Recharts / Chart.js
- **Calendar:** React Big Calendar
- **State Management:** React Hooks / Context API

## 🗄 Database structure (when used)
**Collection:** `users`

**Document structure:**
```json
{
	"id": "uid123",
	"name": "Nguyen Van A",
	"email": "nguyenvana@example.com",
	"tasks": [
		{
			"id": "task1",
			"title": "Finish AI report",
			"deadline": "2025-09-15T18:00:00.000Z",
			"energy": "high",
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

## 🧠 Reflection

### What’s special about this app?
- Quản lý task dựa trên mức năng lượng cá nhân, giúp chọn việc phù hợp trạng thái hiện tại
- 3 chế độ xem trực quan: Danh sách, Lịch, Phân tích
- Tích hợp realtime sync với Firestore, đa thiết bị
- UI thân thiện, responsive cho desktop/mobile

### If you had more time, what would you expand?
- Thêm dark mode, hệ thống thông báo
- Hỗ trợ xuất dữ liệu (CSV/PDF)
- Chế độ làm việc nhóm/cộng tác
- Ứng dụng mobile (React Native)
- Đề xuất task thông minh dựa trên AI

### If you integrate AI APIs more for your app, what would you do?
- Gợi ý task ưu tiên dựa trên lịch sử hoàn thành và mức năng lượng
- Phân tích thói quen làm việc, đề xuất lịch trình tối ưu
- Tự động phân loại task, nhắc nhở thông minh

## ✅ Checklist
- [x] Code runs without errors
- [x] All required features implemented (add/edit/delete/complete tasks)
- [x] All ✍️ sections are filled
