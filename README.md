# lexpress

## Light Express framework for NodeJS.

[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/lexpress.svg?style=flat-square)](https://www.npmjs.com/package/lexpress)
[![Travis](https://img.shields.io/travis/InspiredBeings/lexpress.svg?style=flat-square)](https://travis-ci.org/InspiredBeings/lexpress)
[![David](https://img.shields.io/david/InspiredBeings/lexpress.svg?style=flat-square)](https://david-dm.org/InspiredBeings/lexpress)
[![David](https://img.shields.io/david/dev/InspiredBeings/lexpress.svg?style=flat-square)](https://david-dm.org/InspiredBeings/lexpress)

[![NSP Status](https://nodesecurity.io/orgs/ivan-gabriele/projects/d43ea4d7-eb03-488b-9f01-a84911ead2fe/badge)](https://nodesecurity.io/orgs/ivan-gabriele/projects/d43ea4d7-eb03-488b-9f01-a84911ead2fe)
[![Known Vulnerabilities](https://snyk.io/test/github/inspiredbeings/lexpress/badge.svg?targetFile=package.json)](https://snyk.io/test/github/inspiredbeings/lexpress?targetFile=package.json)

## Description

Lexpress is a featherlight microframework based on [Express](https://expressjs.com) providing a ready-to-use base controller inluding :

- A JSON Schema validation for GET, POST, PUT and DELETE requests.
- An easy-to-use cache middleware.
- A clean JSON error response.

Typescript definitions are also included.

## Getting Started

### Installation

    npm i lexpress

### Basic Web & Api Example

**index.ts**

```typescript
import { Lexpress } from 'lexpress'

import routes from './routes'

const lexpress = new Lexpress({
  routes,
  viewsEngine: 'pug',
  viewsPath: 'src/views'
})

lexpress.start()
```

**src/routes.ts**

```typescript
import { Route } from 'lexpress'

import ApiHelloWorldController from './controllers/api/HelloYouController'
import WebHelloWorldController from './controllers/web/HelloYouController'

const routes: Route[] = [
  {
    path: '/:name',
    controller: WebHelloWorldController,
    method: 'get',
  },
  {
    path: '/api/hello',
    controller: ApiHelloWorldController,
    method: 'get',
  }
]

export default routes
```

**src/controllers/api/HelloYouController.ts**

```typescript
import { BaseController } from 'lexpress'

export default class HelloYouController extends BaseController {
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

    this.validateJsonSchema(schema, () => {
      this.res
        .status(200)
        // Let's keep this response in cache for 24h
        .cache(86400000)
        .json({
          message: `Hello ${this.req.query.name} !`,
          name: this.req.query.name,
        })
    })
  }
}
```

**src/controllers/web/HelloYouController.ts**

```typescript
import { BaseController } from 'lexpress'

export default class HelloYouController extends BaseController {
  public get() {
    this.res
      // Let's keep this response in cache for 24h
      .cache(86400000)
      .render('hello-you', {
        name: this.req.params.name,
      })
  }
}
```

**src/views/hello-you.pug**

```pug
h1 Hello #{name} !
```
