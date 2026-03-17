# ENGSE207 Software Architecture

## Final Lab — Set 1: Microservices + HTTPS + Lightweight Logging

**วิชา:** ENGSE207 Software Architecture
**มหาวิทยาลัย:** มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา

---

## 👥 สมาชิกในกลุ่ม (Team Members)

| Student ID    | ชื่อ-นามสกุล            | หน้าที่                                      |
| ------------- | ----------------------- | -------------------------------------------- |
| 67543210074-0 | นางสาว สุพิชญา ชื่นจุม  | Backend (Auth, Task, Log Service, Nginx, DB) |
| 67543210072-4 | นายวรวัฒน์ จันทร์เที่ยง | Frontend (index.html, logs.html)             |

---

## 📌 Overview

ระบบนี้เป็นเว็บแอปพลิเคชันแบบ Microservices สำหรับจัดการงาน (Task Management System)
ประกอบด้วย Auth Service, Task Service และ Log Service โดยใช้ Nginx เป็น API Gateway
รองรับ HTTPS และใช้ JWT สำหรับ Authentication

---

## 🎯 Objectives

* ออกแบบระบบแบบ Microservices
* ใช้ HTTPS ด้วย Self-Signed Certificate
* ใช้ JWT Authentication
* บันทึก log การใช้งานระบบ
* ใช้ Docker Compose สำหรับจัดการ service

---

## 🏗️ Architecture Overview

```
Browser / Postman
│
│ HTTPS :443
▼
Nginx (API Gateway)
│
├── /api/auth → Auth Service
├── /api/tasks → Task Service
├── /api/logs → Log Service
└── / → Frontend
│
▼
PostgreSQL
```

---

## 📁 Repository Structure

```plaintext
final-lab-set1/
├── nginx/
├── frontend/
├── auth-service/
├── task-service/
├── log-service/
├── db/
├── scripts/
└── screenshots/
```

---

## 👤 Seed Users

| Email                                     | Password | Role   |
| ----------------------------------------- | -------- | ------ |
| [alice@lab.local](mailto:alice@lab.local) | alice123 | member |
| [bob@lab.local](mailto:bob@lab.local)     | bob123   | admin  |

---

## 🚀 How to Run

```bash
chmod +x scripts/gen-certs.sh
./scripts/gen-certs.sh
docker compose up --build
```

---

## 🔐 Example API Test

```bash
curl -k -X POST https://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@lab.local","password":"alice123"}'
```

---

## 🧪 API Testing Guide

### 🔐 Authentication

* POST /api/auth/login

### 📋 Tasks

* POST /api/tasks
* GET /api/tasks
* PUT /api/tasks/:id
* DELETE /api/tasks/:id

### 📄 Logs

* GET /api/logs

---

## 🔄 System Flow

### HTTPS

Client → Nginx → Services

### JWT

Login → ได้ token → ส่ง Authorization header

### Logging

ทุก request ถูกบันทึกลง DB

---

##  System Security & Logging Overview

### 1️⃣ HTTPS (TLS / SSL)

- ใช้ **HTTPS** เพื่อเข้ารหัสข้อมูลระหว่าง Client ↔ Nginx  
- Nginx ทำหน้าที่เป็น **TLS Termination**:  
  - รับ HTTPS จาก client  
  - ถอดรหัสแล้วส่ง request ภายในไปยัง Microservices ผ่าน HTTP  
- ผลลัพธ์: ปลอดภัยจากการดักฟังข้อมูล (man-in-the-middle)

---

### 2️⃣ JWT (JSON Web Token) Authentication

- ทุกการเข้าสู่ระบบ (Login) จะสร้าง **JWT token** สำหรับผู้ใช้แต่ละคน  
- Token จะเก็บข้อมูลสำคัญ:
  - User ID, Email, Role, Expiration  
- วิธีใช้งาน:
  1. Login → รับ JWT token  
  2. ส่ง token ใน HTTP Header ทุกครั้งที่เรียก endpoint ที่ต้อง authentication:
     ```
     Authorization: Bearer <token>
     ```
  3. Services ตรวจสอบ token ก่อนอนุญาตการใช้งาน  
- ข้อดี:
  - ไม่ต้องเก็บ session ใน server  
  - รองรับระบบ Microservices ได้ง่าย  

---

### 3️⃣ Logging Flow

- **ทุก request** ที่เข้าระบบ จะถูกบันทึกโดย **Log Service**  
- ข้อมูลที่เก็บ:
  - Timestamp, User ID, Endpoint, HTTP Method, Status Code  
- Log จะถูกเก็บใน **PostgreSQL**  
- สิทธิ์การเข้าถึง:
  - **Admin** → ดู Log ได้  
  - **Member** → ถูกปฏิเสธ (403)  

- ผลลัพธ์:
  - ช่วยตรวจสอบการใช้งาน  
  - วิเคราะห์ปัญหาและเหตุการณ์ผิดปกติได้  

---

