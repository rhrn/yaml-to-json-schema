### Examples

#### [sample.yaml](sample.yaml)

##### Command
```shell
npx yaml-to-json-schema examples/asyncapi/sample.yaml
```
##### Output
```js
{
  "type": "object",
  "definitions": {
    "id": {
      "title": "id",
      "description": "Resource identifier",
      "type": "string"
    },
    "username": {
      "title": "username",
      "description": "User handle",
      "type": "string"
    },
    "datetime": {
      "title": "datetime",
      "description": "Date and Time of the message",
      "type": "string",
      "format": "date-time"
    },
    "MQTTQoSHeader": {
      "title": "qos",
      "description": "Quality of Service",
      "type": "integer",
      "format": "int32",
      "default": 1,
      "enum": [
        0,
        2
      ]
    },
    "MQTTRetainHeader": {
      "title": "retainFlag",
      "description": "This flag determines if the message will be saved by the broker for the specified\ntopic as last known good value. New clients that subscribe to that topic will receive\nthe last retained message on that topic instantly after subscribing. More on retained messages\nand best practices in one of the next posts.\n",
      "type": "boolean",
      "default": false
    },
    "user": {
      "type": "object",
      "required": [
        "id",
        "username"
      ],
      "properties": {
        "id": {
          "description": "User Id",
          "$ref": "#definitions/id"
        },
        "full_name": {
          "description": "User full name",
          "type": "string"
        },
        "username": {
          "$ref": "#definitions/username"
        }
      }
    },
    "userCreate": {
      "type": "object",
      "required": [
        "username"
      ],
      "properties": {
        "full_name": {
          "description": "User full name",
          "type": "string"
        },
        "username": {
          "$ref": "#definitions/username"
        }
      }
    },
    "signup": {
      "type": "object",
      "required": [
        "method",
        "datetime"
      ],
      "properties": {
        "method": {
          "description": "Signup method",
          "type": "string",
          "enum": [
            "email",
            "facebook",
            "twitter",
            "github",
            "google"
          ]
        },
        "datetime": {
          "$ref": "#definitions/datetime"
        }
      }
    }
  },
  "properties": {
    "id": {
      "$ref": "#definitions/id"
    },
    "username": {
      "$ref": "#definitions/username"
    },
    "datetime": {
      "$ref": "#definitions/datetime"
    },
    "MQTTQoSHeader": {
      "$ref": "#definitions/MQTTQoSHeader"
    },
    "MQTTRetainHeader": {
      "$ref": "#definitions/MQTTRetainHeader"
    },
    "user": {
      "$ref": "#definitions/user"
    },
    "userCreate": {
      "$ref": "#definitions/userCreate"
    },
    "signup": {
      "$ref": "#definitions/signup"
    }
  }
}
```

#### `json schema` to `typescript`

##### Command
```shell
npx yaml-to-json-schema examples/asyncapi/sample.yaml | npx quicktype --src-lang schema --lang ts --just-types --acronym-style original -t AsyncapiSamplee`
```

##### Output
```typescript
export interface AsyncapiSamplee {
    datetime?:         Date;
    id?:               string;
    MQTTQoSHeader?:    number;
    MQTTRetainHeader?: boolean;
    signup?:           Signup;
    user?:             User;
    userCreate?:       UserCreate;
    username?:         string;
}

export interface Signup {
    datetime: Date;
    /**
     * Signup method
     */
    method: Method;
}

/**
 * Signup method
 */
export enum Method {
    Email = "email",
    Facebook = "facebook",
    Github = "github",
    Google = "google",
    Twitter = "twitter",
}

export interface User {
    /**
     * User full name
     */
    full_name?: string;
    /**
     * User Id
     */
    id:       string;
    username: string;
}

export interface UserCreate {
    /**
     * User full name
     */
    full_name?: string;
    username:   string;
}
```

##### Ajv example
```shell
npx yaml-to-json-schema examples/asyncapi/sample.yaml > generated.json
```
#### An validation js module
```js
import Ajv from 'ajv'
import Schemas from 'generated.json'

const ajv = new Ajv({ allErrors: true })

for(const schemaName in Schemas.definitions) {
  ajv.addSchema(Schemas.definitions[schemaName], '#definitions/' + schemaName)
}

export const UserValidator = ajv.compile(Schemas.definitions.user)
export const UserCreateValidator = ajv.compile(Schemas.definitions.userCreate)
```
