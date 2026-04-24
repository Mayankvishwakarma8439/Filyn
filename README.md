# 📁 Filyn — Smart Cloud Storage for the Modern Web

Filyn is a cloud storage web app that allows users to securely upload, manage, and access their files in one unified interface. Built with Next.js, MongoDB Atlas, Mongoose, AWS S3, Gmail SMTP, and TailwindCSS, focusing on simplicity, speed, and scalability.



## 🚀 Features

- **🔐 Authentication with OTP** — Users can sign up or log in using secure email OTP verification via the custom backend
- **🧠 Persistent Session Handling** — Server-managed session cookies for smooth login/logout flows
- **☁️ File Upload & Preview** — Upload and preview files of any type (images, PDFs, docs, etc.) with smart thumbnails
- **📱 Responsive UI** — Adaptive sidebar, headers, and mobile navigation for all devices
- **🗂️ Organized File Management** — Visual representation of uploaded files, easy to delete or manage
- **🧩 Server Actions** — Optimized Next.js server actions for secure database and storage operations
- **💨 Modern UI/UX** — Clean, minimal design using TailwindCSS and shadcn/ui components

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React, TailwindCSS, Shadcn/UI |
| **Backend** | Custom Next.js server actions |
| **Database** | MongoDB Atlas + Mongoose |
| **File Handling** | AWS S3 + React Dropzone |
| **Email Delivery** | Gmail SMTP + Nodemailer |
| **Deployment** | Any Node-capable host |


## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/Mayankvishwakarma8439/Filyn.git
cd Filyn
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory with your backend credentials:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/filyn?retryWrites=true&w=majority
MONGODB_DB=filyn

AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-filyn-bucket
NEXT_PUBLIC_S3_PUBLIC_BASE_URL=https://your-filyn-bucket.s3.ap-south-1.amazonaws.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM="Filyn <yourgmail@gmail.com>"

GEMINI_API_KEY=your_google_ai_studio_api_key
GEMINI_MODEL=gemini-2.5-flash
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🖥️ Usage

1. **Sign up or log in** using your email and OTP
2. **Upload files** via drag-and-drop or file picker
3. **Preview, rename, or delete** files from the dashboard
4. **Access the app** on mobile or desktop with responsive design
5. **Ask the AI assistant** questions like “What’s in this contract?” or “Show me files mentioning rent.”

## 🤝 Contribution

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Managed MongoDB
- [AWS S3](https://aws.amazon.com/s3/) - Object storage
- [Nodemailer](https://nodemailer.com/about/) - SMTP email delivery
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn/UI](https://ui.shadcn.com/) - Re-usable components
