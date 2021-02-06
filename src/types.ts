export type Key = string
export type Src = string
export type File = string
export type Ref = string

export interface Keys<Src, Key> {
  [key: string]: Key
} 

export interface ParseOptions {
  input: string
}

export interface Definitions {
  [key: string]: Prop
}

export interface Properties {
  [key: string]: Prop
}

export interface JsonSchema {
  type: string
  definitions: Definitions
  properties: Properties
}

export interface RefObject {
  $ref: Ref
}

export interface Addon {
  allOf: Prop[]
  oneOf: Prop[]
  anyOf: Prop[]
  not: Prop
}

export interface Items {
  items: Prop
}

export interface Prop extends RefObject, Items, JsonSchema, Addon {}

export interface Schemas {
  [key: string]: Prop
}

export interface Components {
  schemas: Schemas
}

export interface Doc {
  components: Components
}
