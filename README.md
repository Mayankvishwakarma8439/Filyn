# 📁 Filyn — Smart Cloud Storage for the Modern Web

Filyn is a cloud storage web app that allows users to securely upload, manage, and access their files in one unified interface. Built with Next.js, Appwrite, and TailwindCSS, focusing on simplicity, speed, and scalability.



## 🚀 Features

- **🔐 Authentication with OTP** — Users can sign up or log in using secure email OTP verification via Appwrite
- **🧠 Persistent Session Handling** — Server-managed session cookies for smooth login/logout flows
- **☁️ File Upload & Preview** — Upload and preview files of any type (images, PDFs, docs, etc.) with smart thumbnails
- **📱 Responsive UI** — Adaptive sidebar, headers, and mobile navigation for all devices
- **🗂️ Organized File Management** — Visual representation of uploaded files, easy to delete or manage
- **🧩 Server Actions** — Optimized Next.js 14/15 server actions for secure database and storage operations
- **💨 Modern UI/UX** — Clean, minimal design using TailwindCSS and shadcn/ui components

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React, TailwindCSS, Shadcn/UI |
| **Backend** | Appwrite (Auth, Database, Storage) |
| **Server Actions** | Next.js Server Components + Appwrite SDK |
| **File Handling** | Appwrite Storage SDK, React Dropzone |
| **Deployment** | Vercel |


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

Create a `.env.local` file in the root directory with your Appwrite project details:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://YOUR_APPWRITE_ENDPOINT/v1
NEXT_PUBLIC_APPWRITE_PROJECT=YOUR_PROJECT_ID
NEXT_PUBLIC_APPWRITE_DATABASE=YOUR_DATABASE_ID
NEXT_PUBLIC_APPWRITE_STORAGE=YOUR_STORAGE_BUCKET_ID
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
- [Appwrite](https://appwrite.io/) - Backend as a Service
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn/UI](https://ui.shadcn.com/) - Re-usable components

