# 🎮 Minecraft Web Platform (Java 1.12.2)

Chào mừng bạn đến với nền tảng Minecraft trên trình duyệt! Đây là một dự án Next.js 16 cao cấp, tích hợp sẵn trình chạy Minecraft 1.12.2, hệ thống Dashboard, Blog và trình soạn thảo Code (Scripting).

## 🚀 Hướng dẫn khởi động (BẮT BUỘC)

Do vấn đề tương thích của Google Drive với các thư viện Node.js, bạn **không được** chạy dự án trực tiếp trên ổ H:. Hãy làm theo các bước sau:

1. **Di chuyển dự án**: Copy toàn bộ thư mục `mc-web` này và dán vào ổ **C:** (Ví dụ: `C:\mc-web`).
2. **Kích hoạt nhanh**: Trong thư mục `C:\mc-web`, hãy chạy file **`start-game.bat`**.
   * File này sẽ tự động:
     * Cài đặt tất cả thư viện (`npm install`).
     * Khởi tạo Prisma Client cho Database.
     * Chạy máy chủ ở chế độ Development.
3. **Mở trình duyệt**: Truy cập địa chỉ [http://localhost:3000](http://localhost:3000).

---

## ✨ Các tính năng chính

*   **Play Minecraft 1.12.2**: Chơi trực tiếp trên Web mượt mà.
*   **Scripting Engine**: Lập trình game bằng Javascript với các mẫu có sẵn (Xây nhà, Weather, Midas Touch...).
*   **User Dashboard**: Quản lý tài khoản, xem các kịch bản (script) đã lưu.
*   **Blog System**: Đọc và viết các bài chia sẻ về Minecraft.
*   **Premium Design**: Giao diện pixel-art chuẩn phong cách Minecraft.

## 🛠 Cấu hình kỹ thuật

*   **Framework**: Next.js 16 (App Router)
*   **Styling**: Tailwind CSS v4
*   **Database**: Prisma + SQLite (Mặc định)
*   **Auth**: Auth.js (NextAuth v5)

## 📝 Lưu ý về Authentication

Để sử dụng tính năng Đăng nhập (Google/GitHub), bạn cần cấu hình các Key trong file `.env`. Hãy tham khảo file `.env.example` để biết thêm chi tiết.

---

Chúc bạn có những trải nghiệm tuyệt vời với thế giới Minecraft của riêng mình!
