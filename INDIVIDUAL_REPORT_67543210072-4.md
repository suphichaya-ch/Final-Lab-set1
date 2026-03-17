# Individual Report

## Student Info
- Name: วรวัฒน์ จันทร์เที่ยง
- Student ID: 67543210072-4
- Role: Frontend Developer

---

## Responsibilities
- พัฒนาหน้าเว็บ `index.html`
- พัฒนาหน้า `logs.html`
- เชื่อมต่อ Frontend กับ Backend API
- แสดงผลข้อมูล Task และ Logs
- ช่วยทดสอบระบบ (Test Cases)

---

## Implementation Details

ในการพัฒนา Frontend ได้ทำการออกแบบและสร้างหน้าเว็บหลัก 2 หน้า ได้แก่:

### 1. index.html
- ใช้สำหรับแสดงรายการ Task ทั้งหมด
- สามารถเพิ่ม ลบ และแสดงข้อมูล Task ได้
- เชื่อมต่อกับ Backend API เพื่อดึงข้อมูลแบบ real-time

### 2. logs.html
- ใช้สำหรับแสดง Logs ของระบบ
- ดึงข้อมูลจาก API และแสดงผลในรูปแบบตาราง

### การเชื่อมต่อ API
- ใช้ JavaScript (Fetch API) ในการเรียกใช้งาน Backend
- รองรับการส่งและรับข้อมูลในรูปแบบ JSON
- มีการจัดการ Token สำหรับ Authentication

---

## Testing

ได้มีการทดสอบระบบร่วมกับทีม โดยใช้เครื่องมือดังนี้:
- curl (Command Line)
- Postman

### ตัวอย่าง Test Cases ที่เกี่ยวข้อง:
- T3: Login สำเร็จ
- T4: Login ไม่สำเร็จ
- T5–T11: การเรียกใช้งาน API ต่าง ๆ

ผลการทดสอบ:
- ระบบสามารถทำงานได้ถูกต้องตามที่ออกแบบ
- การเชื่อมต่อระหว่าง Frontend และ Backend ทำงานได้สมบูรณ์

---

## Problems & Solutions

### ปัญหา:
- การเชื่อมต่อ API ไม่สำเร็จเนื่องจาก HTTPS (self-signed certificate)
- Token ไม่ถูกส่งไปใน Header ทำให้ API ใช้งานไม่ได้

### วิธีแก้:
- ใช้ `-k` หรือ `--insecure` ใน curl เพื่อ bypass certificate
- ตรวจสอบและเพิ่ม Authorization Header ให้ถูกต้อง

---

## Conclusion

จากการพัฒนาในส่วน Frontend ทำให้ระบบสามารถแสดงผลข้อมูล Task และ Logs ได้อย่างครบถ้วน และสามารถเชื่อมต่อกับ Backend API ได้อย่างมีประสิทธิภาพ รวมถึงได้เรียนรู้การทำงานร่วมกันเป็นทีม และการแก้ไขปัญหาที่เกิดขึ้นระหว่างการพัฒนา