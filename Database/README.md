# 🗄️ BIWEB Database Documentation

> Cơ sở dữ liệu trung tâm cho hệ thống **BIWEB — Nền Tảng Martech, ERP & AI Agent Cho Doanh Nghiệp Số**.

---

## 📌 1. Thông Tin Cơ Sở Dữ Liệu

- **Tên Database mặc định**: `biweb_db`
- **Hệ quản trị CSDL**: MySQL / MariaDB (Phiên bản tương thích: MySQL 5.7+, MySQL 8.0+, MariaDB 10.4+)
- **Bảng mã (Charset)**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`
- **Cổng kết nối mặc định**: `3306` (hoặc cấu hình tùy chỉnh qua `appsettings.json`)

---

## 🚀 2. Hướng Dẫn Import Dữ Liệu

### Cách 1: Sử dụng phpMyAdmin (XAMPP / Laragon / Wamp)
1. Khởi động **MySQL** trên trình quản lý (XAMPP / Laragon / Docker).
2. Truy cập phpMyAdmin: `http://localhost/phpmyadmin`.
3. Nhấp vào tab **Import** (Nhập).
4. Chọn tập tin: `Database/biweb_db.sql`.
5. Nhấn **Go** (Thực hiện). Tập tin SQL sẽ tự động tạo cơ sở dữ liệu `biweb_db`, toàn bộ 16 bảng dữ liệu, khóa ngoại, dữ liệu mẫu và các Trigger nghiệp vụ.

### Cách 2: Sử dụng MySQL Command Line
```bash
mysql -u root -p < Database/biweb_db.sql
```

---

## 🏗️ 3. Danh Sách Các Bảng Dữ Liệu (16 Bảng)

| Tên Bảng | Ý Nghĩa / Mục Đích |
| :--- | :--- |
| `thongtinsp` | Danh mục giải pháp, phần mềm Martech, gói license, cấu hình kỹ thuật (Threads, CPU, RAM, OS...) |
| `loaisp` | 5 phân nhóm danh mục phần mềm & giải pháp |
| `thuonghieu` | Các nhà phát triển phần mềm, đối tác công nghệ và hãng cung cấp |
| `hoadon` | Quản lý đơn hàng, hợp đồng bản quyền và trạng thái thanh toán |
| `cthd` | Chi tiết sản phẩm/bản quyền trong từng đơn hàng |
| `dssanpham_mua` | Lịch sử bản quyền phần mềm đã mua của khách hàng |
| `giohang` | Giỏ hàng tạm thời của khách hàng |
| `khachhang` | Tài khoản khách hàng doanh nghiệp, Agency & Media Buyer |
| `nhanvien` | Tài khoản nội bộ phân quyền (Admin, Kỹ thuật, Cấp Key / Giao hàng, Bán hàng) |
| `giaohang` | Phân hệ điều phối và bàn giao License Key cho khách hàng |
| `khuyenmai` | Quản lý voucher, chiết khấu và chương trình ưu đãi |
| `phieunhap` | Quản lý nhập kho License từ nhà phát triển |
| `ctpn` | Chi tiết số lượng và đơn giá License nhập kho |
| `nhacc` | Danh bạ đối tác R&D, nhà phát triển phần mềm nguồn |
| `tintuc` | Cẩm nang kiến thức, tuts chạy Ads, hướng dẫn nuôi nick & tài liệu kỹ thuật |
| `binhluan` | Đánh giá, phản hồi thực tế từ khách hàng |

---

## ⚡ 4. Hệ Thống Triggers Tự Động Hóa Nghiệp Vụ

CSDL đã được thiết lập sẵn **11 Triggers** tự động tính toán tài chính và tồn kho:
- `Before_Insert_CTHD` / `Before_Updated_CTHD`: Tự động tính thành tiền dựa trên số lượng và đơn giá/khuyến mãi.
- `After_Insert_CTHD` / `After_Update_CTHD` / `After_Delete_CTHD`: Tự động cập nhật tổng tiền thanh toán (`TongTienTT`) trên hóa đơn.
- `Tinh_ThanhTien_CTPN`: Tự động tính tiền từng đợt nhập kho License.
- `Alter_Insert_CTPN` / `Alter_Update_CTPN` / `Alter_Delete_CTPN`: Tự động cập nhật tổng tiền phiếu nhập.
- `Before_Update_HD`: Tự động tính tiền thối/hoàn lại khi thanh toán.
