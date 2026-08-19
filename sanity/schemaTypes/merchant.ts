import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'merchant',
  title: 'التجار',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'الاسم الكامل',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'البريد الإلكتروني',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'password',
      title: 'كلمة المرور (مشفرة)',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'phone',
      title: 'رقم الهاتف',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'storeName',
      title: 'اسم المتجر',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'المدينة',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'نوع المنتجات',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'وصف المتجر',
      type: 'text',
    }),
    defineField({
      name: 'approved',
      title: 'موافق عليه',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'storeName',
      subtitle: 'name',
    },
  },
})