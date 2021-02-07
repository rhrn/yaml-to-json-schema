### Examples

#### [petstore-expanded.yaml](petstore-expanded.yaml)

##### Command
```shell
npx yaml-to-json-schema examples/openapi/petstore-expanded.yaml
```
##### Output
```js
{
  "type": "object",
  "definitions": {
    "Pet": {
      "allOf": [
        {
          "$ref": "#definitions/NewPet"
        },
        {
          "type": "object",
          "required": [
            "id"
          ],
          "properties": {
            "id": {
              "type": "integer",
              "format": "int64"
            }
          }
        }
      ]
    },
    "NewPet": {
      "type": "object",
      "required": [
        "name"
      ],
      "properties": {
        "name": {
          "type": "string"
        },
        "tag": {
          "type": "string"
        }
      }
    },
    "Error": {
      "type": "object",
      "required": [
        "code",
        "message"
      ],
      "properties": {
        "code": {
          "type": "integer",
          "format": "int32"
        },
        "message": {
          "type": "string"
        }
      }
    }
  },
  "properties": {
    "Pet": {
      "$ref": "#definitions/Pet"
    },
    "NewPet": {
      "$ref": "#definitions/NewPet"
    },
    "Error": {
      "$ref": "#definitions/Error"
    }
  }
}
```

#### `json schema` to `typescript`

##### Command
```shell
npx yaml-to-json-schema examples/openapi/petstore-expanded.yaml | npx quicktype --src-lang schema --lang ts --just-types --acronym-style original -t PetstoreExpanded
```

##### Output
```typescript
export interface PetstoreExpanded {
    Error?:  Error;
    NewPet?: NewPet;
    Pet?:    Pet;
}

export interface Error {
    code:    number;
    message: string;
}

export interface NewPet {
    name: string;
    tag?: string;
}

export interface Pet {
    name: string;
    tag?: string;
    id:   number;
}
```
##### Ajv example
```shell
npx yaml-to-json-schema examples/openapi/petstore-expanded.yaml > generated.json
```
#### An validation js module
```js
import Ajv from 'ajv'
import Schemas from 'generated.json'

const ajv = new Ajv({ allErrors: true })

for(const schemaName in Schemas.definitions) {
  ajv.addSchema(Schemas.definitions[schemaName], '#definitions/' + schemaName)
}

export const NewPetValidator = ajv.compile(Schemas.definitions.NewPet)
export const PetValidator = ajv.compile(Schemas.definitions.Pet)
```
