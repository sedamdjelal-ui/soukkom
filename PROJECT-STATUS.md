# سوقكم — حالة المشروع

## الوصف
منصة جزائرية بسيطة للبيع والشراء (سوق إلكتروني).
الرابط التجريبي: على Vercel (soukkom)

## التقنيات
- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Auth + Database + Storage)
- لم نعد نعتمد على Sanity للمنتجات

## ما يعمل حالياً
- تسجيل الدخول / التسجيل
- جدول products في Supabase
- إضافة منتج من الموقع: /dashboard/products/new
- رفع صورة المنتج إلى Storage (bucket: product-images)
- عرض المنتجات في الصفحة الرئيسية وفي /products
- صفحة تفاصيل المنتج: /products/[slug]
- حذف منتج من /dashboard/products
- السلة (AddToCartButton)
- زر راسل البائع (StartChatButton) — يحتاج ربط userId للتاجر

## الملفات المهمة
- app/page.tsx → الصفحة الرئيسية (منتجات من Supabase)
- app/products/page.tsx → كل المنتجات
- app/products/[slug]/page.tsx → تفاصيل المنتج
- app/dashboard/products/page.tsx → منتجاتي
- app/dashboard/products/new/page.tsx → إضافة منتج + رفع صورة
- lib/supabase/client.ts و server.ts → عملاء Supabase

## ما لم يُكمل بعد (مقترح)
1. صفحة تعديل منتج موجود
2. ربط روابط لوحة التحكم (/dashboard) بوضوح
3. تفعيل الرسائل الداخلية بشكل كامل (merchant userId)
4. نظام الطلبات
5. تحسين التصميم العام

## ملاحظات
- كل شيء يُدار من الموقع قدر الإمكان (بدون Studio)
- الصور تُرفع إلى bucket: product-images (عام)
- السعر بالدينار الجزائري (دج)