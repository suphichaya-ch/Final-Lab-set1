# ใช้ Nginx Alpine ซึ่งมีขนาดเล็กและรันไฟล์ Static HTML ได้ดี
FROM nginx:alpine

# ก๊อปปี้ไฟล์ทั้งหมดในโฟลเดอร์ frontend (พวก index.html, logs.html) 
# ไปไว้ที่ /usr/share/nginx/html ซึ่งเป็นตำแหน่งมาตรฐานของ Nginx
COPY . /usr/share/nginx/html

# เปิด Port 80 สำหรับการเข้าถึงผ่าน Browser
EXPOSE 80

# รัน Nginx ให้อยู่ในโหมด Foreground เพื่อให้ Container ไม่หยุดทำงาน
CMD ["nginx", "-g", "daemon off;"]