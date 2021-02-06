#!/usr/bin/env node
import { resolve } from 'path'

import { parse } from './index'

const args = process.argv.splice(2)

;(async () => {

  const file = args[0]

  if (!file) {
     console.log(`
      USAGE: yaml-to-json-schema input.yaml
    `)
     return process.exit()
  }

  try {

    const input: string = resolve(file)

    const schema = await parse({ input })
    console.log(JSON.stringify(schema, null, 2))

  } catch (e: unknown) {
    console.log(e)
  }
})()
