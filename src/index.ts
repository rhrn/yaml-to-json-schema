import { resolve, dirname, normalize, relative, basename } from 'path'
import { promises as fs } from 'fs'
import yaml from 'js-yaml'

import {
  ParseOptions,
  JsonSchema,
  File,
  Key,
  Keys,
  Doc,
  Src,
  Ref,
  Prop,
  Definitions,
  Properties,
  Schemas
} from './types'

let basedir: string

const keys: Keys<Src, Key> = {}

const setKey = (key: Key, ref: string, src: Src): void => {
  if (!ref) {
    return
  }

  const file = normalize(ref)

  keys[file] = key
}

const getKey = (ref: string, src: Src): string => {
  if (ref.startsWith('#')) {
    return basename(ref)
  }
  const file: File = resolve(dirname(src), ref)
  const path = relative(basedir, file)
  const key: Key = keys[path]
  if (!key) console.error('WARNING:', key, path)
  return key
}

const fixOf = (refs: Prop[], src: Src) => {
  refs.forEach((item: Prop) => {
    fixProperty(item, src)
  })
}

const fixAddons = (doc: Prop, src: Src): void => {

  if (doc.allOf) {
    fixOf(doc.allOf, src)
  } else if (doc.oneOf) {
    fixOf(doc.oneOf, src)
  } else if (doc.anyOf) {
    fixOf(doc.anyOf, src)
  } else if (doc.not) {
    fixProperty(doc.not, src)
  }

}

const fixProperty = (prop: Prop, src: Src): Prop => {

  if (prop.$ref) {
    prop.$ref = '#definitions/' + getKey(prop.$ref, src)
  } else if (prop.type === 'object') {
    fixRef(prop, src)
  } else if (prop.type === 'array') {
    fixProperty(prop.items, src)
  }

  fixAddons(prop, src)

  return prop
}

const fixRef = (doc: Prop, src: Src): Prop => {

  fixAddons(doc, src)

  for(const key in doc.properties) {
    fixProperty(doc.properties[key], src)
  }
  return doc
}

const loadYamlFile = async (file: File): Promise<any> => {
  const content = await fs.readFile(file, 'utf8')
  return yaml.load(content)
}

const loadPath = async (ref: Ref, src: Src): Promise<Prop> => {
  const dir: string = dirname(src)
  const file: string = resolve(dir, ref)
  const doc: Doc = await loadYamlFile(file)

  if (!doc) {
    throw new Error('Empty doc')
  }

  if (typeof doc === 'string' || typeof doc === 'number') {
    throw new Error('Unsupported doc')
  }

  // @ts-ignore
  return fixRef(doc, file)
}

const loadSchema = async (doc: Prop, src: Src): Promise<Prop> => {
  if (doc.$ref) {
    return loadPath(doc.$ref, src)
  }
  return fixRef(doc, src)
}

const prepare = async (doc: Doc, src: Src): Promise<JsonSchema> => {
  const definitions: Definitions = {}
  const properties: Properties = {}

  const { schemas }: { schemas: Schemas } = doc.components

  basedir = dirname(src)

  for(const key in schemas) {
    setKey(key, schemas[key].$ref, src)
  }

  for(const key in schemas) {
    definitions[key] = await loadSchema(schemas[key], src)
    // @ts-ignore // @TODO fix this issue. Error TS2740: Type '{ $ref: string; }'
    properties[key] = { $ref: '#definitions/' + key }
  }

  return {
    type: 'object',
    definitions,
    properties
  }
}

export async function parse(options: ParseOptions): Promise<JsonSchema> {
  const { input } = options

  const doc: Doc = await loadYamlFile(input)

  return prepare(doc, input)
}
