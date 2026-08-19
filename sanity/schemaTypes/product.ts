import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'المنتجات',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'اسم المنتج',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'الرابط',
      type: 'slug',
      options: { source: 'name' },
    }),
    defineField({
      name: 'price',
      title: 'السعر (دج)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'image',
      title: 'صورة المنتج',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'الوصف',
      type: 'text',
    }),
    defineField({
      name: 'inStock',
      title: 'متوفر؟',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'merchant',
      title: 'التاجر',
      type: 'reference',
      to: [{ type: 'merchant' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
})