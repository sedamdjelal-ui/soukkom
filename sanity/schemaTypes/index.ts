import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import merchant from './merchant'
import order from './order'
export const schemaTypes = [
  // ... باقي الأنواع الموجودة
  order,
]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, merchant],
}