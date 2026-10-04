# product-explorer

ใบงาน 10301231 Web Technology: React Hook Form, Zod และการเชื่อมต่อ External API

## เริ่มใช้งาน

```bash
npm install
npm run dev
```

เปิด http://localhost:3000

## โครงสร้าง

- `src/lib/products.ts` Zod Schema, Type และฟังก์ชันเรียก API
- `src/components/ProductExplorer.tsx` ศูนย์กลางข้อมูลและสถานะ
- `src/components/ProductSearchForm.tsx` ฟอร์มค้นหา
- `src/components/ProductForm.tsx` ฟอร์มเพิ่มและแก้ไขสินค้า
- `src/data/products-fallback.json` ข้อมูลสำรอง ใช้เมื่อเรียก API ไม่ได้

## Deploy

push ขึ้น GitHub แล้ว Import โปรเจกต์ที่ https://vercel.com
