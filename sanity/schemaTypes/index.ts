import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import merchant from './merchant'
import order from './order'
import contactMessage from './contactMessage'

export const schemaTypes = [product, merchant, order, contactMessage]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}