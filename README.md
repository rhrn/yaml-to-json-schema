# yaml-to-json-schema 
> Generate json schema from yaml `components` schema (openapi, swagger, asyncapi...)

_Note: this tool does not infer the schema from a general yaml file._

## Support
  - [Openapi/Swagger](https://swagger.io/docs/specification/about/)
  - [Asyncapi](https://www.asyncapi.com/)

## Install
```
# global
npm install -g yaml-to-json-schema
# in project
npm install --save-dev yaml-to-json-schema
```

## Usage
```
# global
yaml-to-json-schema openapi.yaml
# in project
npx yaml-to-json-schema openapi.yaml
```

## Usage from repository
```
git clone https://github.com/rhrn/yaml-to-json-schema.git
cd yaml-to-json-schema
npm install
npm run build
# command examples
npx yaml-to-json-schema examples/asyncapi/sample.yaml | npx quicktype --src-lang schema --lang ts --just-types --acronym-style original -t AsyncapiSample
npx yaml-to-json-schema examples/openapi/petstore-expanded.yaml | npx quicktype --src-lang schema --lang ts --just-types --acronym-style original -t PetstoreExpanded
```

## Output examples with use cases
- [examples/asyncapi/sample.yaml](https://github.com/rhrn/yaml-to-json-schema/tree/master/examples/asyncapi)
- [examples/openapi/petstore-expanded.yaml](https://github.com/rhrn/yaml-to-json-schema/tree/master/examples/openapi)

## Useful tools
- [https://quicktype.io/](https://quicktype.io/) - Convert JSON into gorgeous, typesafe code in any language
- [https://ajv.js.org/](https://ajv.js.org/) - JSON Schema Validator
