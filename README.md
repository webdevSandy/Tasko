# 🚀 Real-Time Task Manager App

A powerful real-time task management web application built with the **MERN stack**. It allows users to register/login securely, add/manage tasks with real-time updates using **Socket.IO**, and enjoy a clean, responsive UI powered by **Tailwind CSS**.

---

## 📸 Demo

🔗 **Live Preview**: _Coming soon_  
🎨 **Developer Portfolio**: [webdevsandy.vercel.app](https://webdevsandy.vercel.app/)

---

## ✨ Features

✅ Secure **User Authentication** (JWT)  
✅ **Add, Update, Delete Tasks**  
✅ Real-Time Task Updates with **Socket.IO**  
✅ Fully **Responsive UI** with Tailwind CSS  
✅ Protected Routes using React Router  
✅ RESTful API with Express.js  
✅ MongoDB Atlas integration  
✅ **Clean Code Structure & Reusable Components**

---

## 🛠️ Tech Stack

| Frontend | Backend | Real-Time | Database | UI |
|----------|---------|-----------|----------|----|
| React.js | Node.js | Socket.IO | MongoDB Atlas | Tailwind CSS |
| Axios | Express.js | JWT | Mongoose | Heroicons |

---

## 📂 Folder Structure

```
task-manager-app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
```

---

## 🔐 Authentication

- Registration & Login using **Email + Password**
- JWT stored in frontend context
- Protected routes using `ProtectedRoute` wrapper

---

## 💬 Real-Time Sync (Socket.IO)

All users connected to the app will see:
- ✅ Instant task creation
- ✏️ Instant task status toggle
- ❌ Instant task deletion

This is achieved through **Socket.IO server-client event communication**.

---

## 📸 Screenshots

> Add some screenshots of your app UI here in GitHub.

---

## 📥 Installation & Setup

```bash
# Clone the repo
git clone https://github.com/webdevSandy/task-manager-app.git
cd task-manager-app

# Backend
cd backend
npm install
npm run dev

# Frontend (in a new terminal)
cd ../frontend
npm install
npm run dev
```

---

## 🔗 Socials

📷 **Instagram**: [@sandy_chaudhay_._](https://www.instagram.com/sandy_chaudhay_._/)  
💻 **GitHub**: [@webdevSandy](https://github.com/webdevSandy)  
🌐 **Portfolio**: [webdevsandy.vercel.app](https://webdevsandy.vercel.app/)

---

## 📜 License

This project is licensed under the **MIT License**.  
Feel free to fork, contribute, or use with credits.

---

## ❤️ Made with Passion by [**Sandy Chaudhary**](https://webdevsandy.vercel.app/)