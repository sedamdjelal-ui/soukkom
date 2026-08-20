import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactMessage',
  title: 'رسائل التواصل',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'الاسم', type: 'string' }),
    defineField({ name: 'email', title: 'البريد', type: 'string' }),
    defineField({ name: 'phone', title: 'الهاتف', type: 'string' }),
    defineField({ name: 'message', title: 'الرسالة', type: 'text' }),
    defineField({ name: 'createdAt', title: 'التاريخ', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'message' },
  },
})