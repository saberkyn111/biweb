# 🤝 Quy Định Đóng Góp Phát Triển BIWEB

Cảm ơn bạn đã quan tâm và muốn đóng góp cho dự án **BIWEB Platform**! Dưới đây là các hướng dẫn và tiêu chuẩn code để giữ cho repository luôn sạch sẽ, chuyên nghiệp.

---

## 🛠️ 1. Quy Trình Làm Việc (Git Workflow)

1. **Fork repository** về tài khoản GitHub cá nhân của bạn.
2. Tạo nhánh tính năng mới (`feature/`) hoặc sửa lỗi (`fix/`):
   ```bash
   git checkout -b feature/tinh-nang-moi
   # hoặc
   git checkout -b fix/loi-ket-noi-db
   ```
3. Thực hiện thay đổi và kiểm tra build cục bộ:
   ```bash
   dotnet build Biweb.sln
   ```
4. Commit theo chuẩn Conventional Commits:
   - `feat: thêm module quản lý API Key`
   - `fix: sửa lỗi trigger tính tổng tiền cthd`
   - `docs: cập nhật hướng dẫn cài đặt database`
   - `refactor: tối ưu hóa DbConfig và Connection Pool`
5. Push nhánh lên GitHub và tạo **Pull Request (PR)** đến nhánh `main`.

---

## 🎨 2. Chuẩn Code & Kiến Trúc

- **Cấu hình Database**: Luôn sử dụng `DoAn_FW.Infrastructure.DbConfig.ConnectionString` hoặc khai báo trong `appsettings.json`, tuyệt đối không hardcode chuỗi kết nối trong code C#.
- **Frontend Views**: Sử dụng hệ thống thiết kế màu sắc chuẩn của BIWEB:
  - Primary: `#0052FF`
  - Accent: `#00C6FF`
  - Dark: `#0F172A`
  - Highlight: `#FF6B00`
- **Tập tin tạm / Build**: Trước khi commit, đảm bảo không đẩy thư mục `bin/`, `obj/`, `.vs/` hoặc các file cấu hình cá nhân.

---

## 💬 3. Hỗ Trợ Kỹ Thuật

Mọi thắc mắc hoặc báo lỗi, vui lòng mở một **Issue** trên repository kèm thông tin chi tiết và log lỗi liên quan.
