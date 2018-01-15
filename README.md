# lexpress

## Light Express framework for NodeJS.

[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/lexpress.svg?style=flat-square)](https://www.npmjs.com/package/lexpress)
[![Travis](https://img.shields.io/travis/InspiredBeings/lexpress.svg?style=flat-square)](https://travis-ci.org/InspiredBeings/lexpress)
[![David](https://img.shields.io/david/InspiredBeings/lexpress.svg?style=flat-square)](https://david-dm.org/InspiredBeings/lexpress)
[![David](https://img.shields.io/david/dev/InspiredBeings/lexpress.svg?style=flat-square)](https://david-dm.org/InspiredBeings/lexpress)

[![NSP Status](https://nodesecurity.io/orgs/ivan-gabriele/projects/d43ea4d7-eb03-488b-9f01-a84911ead2fe/badge)](https://nodesecurity.io/orgs/ivan-gabriele/projects/d43ea4d7-eb03-488b-9f01-a84911ead2fe)

## Description

Lexpress is a featherlight microframework based on [Express](https://expressjs.com) providing a ready-to-use base controller inluding :

- A JSON Schema validation for GET, POST, PUT and DELETE requests.
- A clean JSON error response.

Typescript definitions are also included.

## Getting Started

### Installation

    npm i lexpress

### Example

**index.ts**

```typescript
import { Lexpress } from 'lexpress'

import routes from './routes'

const lexpress = new Lexpress({
  headers: {
    'Access-Control-Allow-Origin': 'https://example.com',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  },
  routes
})

lexpress.start()
```

**routes.ts**

```typescript
import { Route } from 'lexpress'

import HelloWorldController from './controllers/HelloWorldController'

const routes: Route[] = [
  {
    path: '/',
    Controller: HelloWorldController,
    method: 'get',
  }
]

export default routes
```

**controllers/HelloWorldController.ts**

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { BaseController } from 'lexpress'

export default class ApiUserController extends BaseController {
  public get() {
    const schema = {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          minLength: 1,
        },
      },
      required: ['name'],
    }

    return this.validateJsonSchema(schema, () => {
      return this.res.status(200).json({
        message: 'Hello World !',
        name: this.req.query.email,
      })
    })
  }
}
```
