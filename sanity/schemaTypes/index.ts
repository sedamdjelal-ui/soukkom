import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import merchant from './merchant'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, merchant],
}