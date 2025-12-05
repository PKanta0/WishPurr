#WishPurr E-Commerce Web Application

ระบบเว็บแอปพลิเคชันอีคอมเมิร์ซสำหรับจำหน่ายอาหารสัตว์เลี้ยง พัฒนาด้วยสถาปัตยกรรมแยกส่วนระหว่าง Frontend และ Backend โดยมีฐานข้อมูล MySQL ทำงานร่วมกันบนเครื่องผู้ใช้ (local environment) เพื่อใช้เป็นต้นแบบสำหรับการเรียนรู้
1. คุณลักษณะของระบบ
ผู้ใช้งานทั่วไป (User)
- สมัครสมาชิก / เข้าสู่ระบบ / ออกจากระบบ
- เรียกดูสินค้าแยกตามหมวดหมู่
- ดูรายละเอียดสินค้าและเพิ่มสินค้าเข้าตะกร้า
- ทำรายการสั่งซื้อผ่านหน้า Checkout
- เขียนรีวิวสินค้าได้เมื่อเคยสั่งซื้อสินค้านั้นแล้ว
- ดูรีวิวสินค้าจากผู้ใช้งานรายอื่น
ผู้ดูแลระบบ (Admin)
- เข้าสู่ระบบในสิทธิ์ผู้ดูแล
- ตรวจสอบรายการสั่งซื้อทั้งหมด
- เพิ่ม แก้ไข และลบสินค้า
- ลบรีวิวที่ไม่เหมาะสม
2. สถาปัตยกรรมระบบ
ระบบแบ่งออกเป็นสามส่วนหลัก
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Database: MySQL
ใช้ JSON Web Token (JWT) สำหรับการพิสูจน์ตัวตน และแยกสิทธิ์การเข้าถึงระหว่างผู้ใช้ทั่วไปและผู้ดูแลระบบ
3.เทคโนโลยีที่ใช้
Frontend: React, TypeScript, Vite, Tailwind CSS
Backend: Node.js, Express, JWT, Bcrypt
Database: MySQL
4.การติดตั้งและการใช้งาน
4.1 เตรียมฐานข้อมูล
สร้างฐานข้อมูล MySQL
นำไฟล์สร้าง schema และ table (TestSQL.sql)
ตรวจสอบ table หลัก ได้แก่ users, products, product_images, orders, order_items, reviews, categories
4.2 รัน Backend
- cd back_end
- npm install
- สร้างไฟล์ .env และระบุข้อมูล เช่น
PORT=4000
DB_HOST=localhost
DB_USER=...
DB_PASSWORD=...
DB_NAME=wishpurr_db
JWT_SECRET=...
- npm run dev
4.3 รัน Frontend
- cd project(main folder)
- npm install
- npm run dev
- เปิดใช้งานผ่าน http://localhost:5173
5. โครงสร้างโปรเจกต์โดยสรุป
back_end/
  controllers/
  services/
  routes/
  models/
  middleware/
  config/

front_end/(project)
  src/
  api/
  utils/
  components/
  layouts/
  page/
6.unit test
ผลการทดสอบจะครอบคลุม Authentication, Products, Orders และ Reviews
- cd back_end
- npm test
7. ข้อจำกัดของระบบ
- ระบบออกแบบเพื่อใช้งานบนเครื่องผู้ใช้เท่านั้น (ไม่รองรับ Cloud Deployment)
- ไม่มีระบบชำระเงินจริง
- ไม่มีระบบแจ้งเตือนหรือรายงานขั้นสูง
8. แนวทางพัฒนาต่อ
- ปรับปรุงให้รองรับการ deploy บน Cloud
- เพิ่มระบบชำระเงินออนไลน์
- เพิ่มการแนบรูปภาพในรีวิว
- ขยายระบบรายงานสำหรับผู้ดูแลระบบ
