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
      title: 'اسم الزبون',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'رقم الهاتف',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      name: 'items',
      title: 'المنتجات',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productId', type: 'string', title: 'معرف المنتج' },
            { name: 'name', type: 'string', title: 'اسم المنتج' },
            { name: 'price', type: 'number', title: 'السعر' },
            { name: 'quantity', type: 'number', title: 'الكمية' },
          ],
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
          { title: 'تم التسليم', value: 'delivered' },
          { title: 'ملغى', value: 'cancelled' },
        ],
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'notes',
      title: 'ملاحظات',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'orderNumber',
    },
  },
})