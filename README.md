# Final Project - WEB Technologies (Backend)

## Description
This project is a web application that includes features such as blog management, BMI calculator, QR code generation, email sending, and weather information retrieval. It supports user authentication and protected routes.

<img width="1407" alt="Снимок экрана 2025-02-26 в 00 03 45" src="https://github.com/user-attachments/assets/61b2e943-e870-4191-ba03-a7a9daf71208" />

## Features
- **User Authentication** (JWT + Cookies)
- **Blog Management (CRUD)** (Create, Read, Update, Delete blog posts)
- **BMI Calculator** (Calculate Body Mass Index)
- **QR Code Generator** (Generate QR codes from links)
- **Email Sending** (Send emails via SMTP server)
- **Weather Info** (Fetch weather data and display maps)

## Installation and Setup

### 1. Clone the Repository
```sh
git clone https://github.com/your-repo/final_project.git
cd final_project
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Configure Environment Variables
Create a .env file in the root directory and add:
```ini
MONGO_URI=mongodb://127.0.0.1:27017/final_project
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### 4. Start the Server
```sh
node server.js
```
The server will run at `http://localhost:3000`.

## Usage

1. Register or log in to access the app.
2. Navigate using the sidebar menu.
3. In Manage Blog, you can create, edit, and delete blog posts.
4. In Weather Info, you can fetch weather details and view maps.
5. In Email Sender, you can send emails with attachments.
6. In QR Code Generator, you can generate QR codes.

## Project Structure
```bash
FINAL_EXAM_WEBTECH/
│-- node_modules/ # Installed dependencies
│
│-- public/ # Static files (HTML, CSS, Images)
├── images/ # Folder for images
│
│-- .env # Environment variables (ignored by Git)
│-- .gitattributes # Git attributes configuration
│-- .gitignore # Specifies files to ignore in Git
│-- crud.js # Blog management API routes
│-- package-lock.json # Locks package versions
│-- package.json # Project dependencies and scripts
│-- server.js # Main Express server
│-- weather.js # Weather API handling
```

## Technologies Used

- Node.js + Express (Backend)
- MongoDB + Mongoose (Database)
- JWT + Cookies (User Authentication)
- Nodemailer (Email sending)
- QR-image (QR Code Generation)
- Fetch API (Client-server interaction)

## Student info

* Author: Merey Ibraim
* Group: SE-2308
