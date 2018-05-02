!function(e,t){for(var s in t)e[s]=t[s]}(exports,function(e){var t={};function s(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,s),i.l=!0,i.exports}return s.m=e,s.c=t,s.d=function(e,t,r){s.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},s.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s.w={},s(s.s=22)}([function(e,t){e.exports=require("@inspired-beings/log")},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=s(0),i=60,o=400,n=500;t.default=function({err:e,isJson:t,res:s,statusCode:a,scope:u}){void 0!==a&&a<n?r.default.warn(`${u}: ${e}`):r.default.err(`${u}: ${e}`),t?s.status(o).cache(i).json({error:{code:o,message:"Bad Request"}}):s.cache(i).render(String(a))}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=s(13);t.default=function(e){let t,s=e.originalUrl.toLocaleLowerCase().replace(/\//g,"$");switch(s.length>1&&(s=s.replace(/\$$/,"")),e.method){case"GET":t=r.default(e.query);break;case"POST":case"PUT":case"DELETE":t=r.default(e.body)}return 0===t.length?s:`${s}-${t}`}},function(e,t){e.exports=require("memory-cache")},function(e,t){e.exports=require("dotenv")},function(e,t){e.exports=require("ajv")},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=new(s(5));t.default=function(e,t,s){s(r.validate(e,t)?null:r.errorsText())}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=s(0),i=s(1),o=s(6);t.default=class{constructor(e,t,s){this.controllerName=this.constructor.name,this.isJson=!0,this.next=s,this.req=e,this.res=t}get(){this.method="get"}post(){this.method="post"}put(){this.method="put"}delete(){this.method="delete"}log(e){r.default(`${this.controllerName}: ${e}`)}logError(e){r.default.err(`${this.controllerName}: ${e}`)}answerError(e,t=400){let s;s="string"==typeof e?e:"object"==typeof e&&"Error"===e.name?e.message:"err";try{i.default({err:s,isJson:this.isJson,res:this.res,scope:this.controllerName,statusCode:t})}catch(e){let t;t="string"==typeof e?e:"object"==typeof e&&"Error"===e.name?e.message:"err",r.default.err(t)}}validateJsonSchema(e,t){this.log("Validating JSON Schema"),o.default(e,"get"===this.method?this.req.query:this.req.body,e=>{null===e?t():this.answerError(e)})}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});s(0);const r=s(4),i=s(3),o=s(2);r.config();const n=1e3;t.default=function(e,t,s){t.cache=(s=>{const r=s*n,a=o.default(e);return{json:e=>(i.put(a,e,r),t.json({isJson:!0,body:e})),render:(e,s,o)=>{void 0===s||"object"!=typeof s?t.render(e,(e,s)=>{null===e&&i.put(a,{isJson:!1,body:s},r),void 0===o?t.send(s):o(e,s)}):t.render(e,s,(e,s)=>{null===e&&i.put(a,{isJson:!1,body:s},r),void 0===o?t.send(s):o(e,s)})}}}),s()}},function(e,t){e.exports=require("chalk")},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=s(9);t.default=r.default.gray(`\n,\n"\\",\n"=\\=",\n "=\\=",\n  "=\\=",\n   "-\\-"\n      \\\n       \\  ${r.default.magenta("Lexpress")} ${r.default.blue("0.39.4")}\n\n`)},function(e,t){e.exports=require("fs")},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=s(11);t.default=function(e){try{return r.accessSync(e),!0}catch(e){return!1}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return JSON.stringify(e).replace(/\W+/g,"-").replace(/^-|-$/g,"").toLocaleLowerCase()}},function(e,t){e.exports=require("pug")},function(e,t){e.exports=require("mustache-express")},function(e,t){e.exports=require("https")},function(e,t){e.exports=require("helmet")},function(e,t){e.exports=require("express-session")},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("body-parser")},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=s(0),i=s(20),o=s(4),n=s(19),a=s(18),u=s(17),c=s(16),d=s(3),l=s(15),h=s(14),p=s(2),f=s(1),m=s(12),v=s(10),w=s(8),g={headers:{},helmet:{},https:!1,locals:{},middlewares:[],routes:[],staticOptions:{},viewsEngine:"mustache",viewsPath:"src"},y=3e3,x=32,_=process.cwd();m.default(`${_}/.env`)&&o.config({path:`${_}/.env`});t.default=class{constructor(e){const t=Object.assign({},g,e);this.headers=t.headers,this.helmet=t.helmet,this.https=t.https,this.locals=t.locals,this.middlewares=t.middlewares,this.notFoundmiddleware=t.notFoundmiddleware,this.routes=t.routes,this.staticOptions=t.staticOptions,this.staticPath=t.staticPath,this.viewsEngine=t.viewsEngine,this.viewsPath=t.viewsPath,this.init()}init(){switch(this.port=void 0!==process.env.PORT?Number(process.env.PORT):y,this.app=n(),this.app.locals=this.locals,this.setMiddlewares(),this.setCustomMiddlewares(),this.app.use(u(this.helmet)),this.setRoutes(),this.viewsEngine){case"pug":this.app.engine("pug",h.__express),this.app.set("view engine","pug");break;default:this.app.engine("mst",l()),this.app.set("view engine","mst")}this.app.set("views",`${_}/${this.viewsPath}`),this.app.use(n.static(`${_}/${this.staticPath}`,this.staticOptions)),this.app.all("*",(e,t,s)=>{let r;for(r in this.headers)this.headers.hasOwnProperty(r)&&t.header(r,this.headers[r]);s()}),this.app.enable("trust proxy"),void 0!==this.notFoundmiddleware&&this.app.use(this.notFoundmiddleware)}answer(e,t,s,i,o={}){const{controller:n,method:a}=this.routes[i];if(void 0===o.isCached||o.isCached){const s=this.cache(e,t);if(void 0!==s)return void(s.isJson?t.json(s.body):t.send(s.body))}let u;for(u in this.headers)this.headers.hasOwnProperty(u)&&t.header(u,this.headers[u]);r.default(`${a.toUpperCase()} on ${e.path} > ${n.name}.${a}()`);try{new n(e,t,s)[a]()}catch(e){f.default({err:e,isJson:!0,res:t,scope:`${n.name}.${a}()`})}}cache(e,t){const s=p.default(e),r=d.get(s);return null!==r?r:void 0}setCustomMiddlewares(){this.middlewares.forEach(e=>this.app.use(e))}setMiddlewares(){("string"!=typeof process.env.SESSION_SECRET||process.env.SESSION_SECRET.length<x)&&r.default.err("Lexpress#setMiddlewares(): Your %s must contain at least 32 characters.","process.env.SESSION_SECRET"),this.app.use(i.json()),this.app.use(i.urlencoded({extended:!0})),this.app.use(a({cookie:{secure:!0},name:"sessionId",proxy:!0,resave:!1,saveUninitialized:!1,secret:process.env.SESSION_SECRET})),this.app.use(w.default)}setRoutes(){this.routes.forEach((e,t)=>void 0!==e.middleware?Array.isArray(e.middleware)?void 0!==e.call?this.app[e.method](e.path,...e.middleware,e.call):this.app[e.method](e.path,...e.middleware,(s,r,i)=>{this.answer(s,r,i,t,e.settings)}):void 0!==e.call?this.app[e.method](e.path,e.middleware,e.call):this.app[e.method](e.path,e.middleware,(s,r,i)=>{this.answer(s,r,i,t,e.settings)}):void 0!==e.call?this.app[e.method](e.path,e.call):this.app[e.method](e.path,(s,r,i)=>{this.answer(s,r,i,t,e.settings)}))}start(){console.log(v.default),!1!==this.https?this.startHttps():this.startHttp()}startHttp(){r.default.warn("Lexpress Server will start in a production mode (non-secure)."),this.app.listen(this.port,()=>r.default.info(`Lexpress Server is listening on port ${this.port}.`))}startHttps(){r.default.warn("Lexpress Server will start in a production mode (secure)."),c.createServer(this.https,this.app).listen(this.port,()=>r.default.info(`Lexpress Server is listening on port ${this.port}.`))}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=s(21);t.Lexpress=r.default;const i=s(7);t.BaseController=i.default}]));