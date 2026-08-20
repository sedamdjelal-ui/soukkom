import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'order',
  title: 'الطلبات',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'رقم الطلب',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'customerName',
      title: 'اسم العميل',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'الهاتف',
      type: 'string',
    }),
    defineField({
      name: 'wilaya',
      title: 'الولاية',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'العنوان',
      type: 'text',
    }),
    defineField({
      name: 'notes',
      title: 'ملاحظات',
      type: 'text',
    }),
    defineField({
      name: 'items',
      title: 'المنتجات',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productId', type: 'string', title: 'معرف المنتج' },
            { name: 'name', type: 'string', title: 'الاسم' },
            { name: 'price', type: 'number', title: 'السعر' },
            { name: 'quantity', type: 'number', title: 'الكمية' },
          ],
          preview: {
            select: { title: 'name', subtitle: 'quantity' },
          },
        },
      ],
    }),
    defineField({
      name: 'total',
      title: 'المجموع',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'الحالة',
      type: 'string',
      options: {
        list: [
          { title: 'جديد', value: 'new' },
          { title: 'قيد المعالجة', value: 'processing' },
          { title: 'تم الشحن', value: 'shipped' },
          { title: 'مكتمل', value: 'completed' },
          { title: 'ملغي', value: 'cancelled' },
        ],
      },
      initialValue: 'new',
    }),
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'orderNumber',
      status: 'status',
    },
    prepare({ title, subtitle, status }) {
      return {
        title: title || 'طلب بدون اسم',
        subtitle: `${subtitle || ''} — ${status || ''}`,
      }
    },
  },
})