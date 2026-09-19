!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).firebase=t()}(this,(function(){"use strict";
/**
     * @license
     * Copyright 2025 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */const e=function(e){const t=[];let n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=63&i|128):55296==(64512&i)&&r+1<e.length&&56320==(64512&e.charCodeAt(r+1))?(i=65536+((1023&i)<<10)+(1023&e.charCodeAt(++r)),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=63&i|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=63&i|128)}return t},t={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let t=0;t<e.length;t+=3){const i=e[t],a=t+1<e.length,o=a?e[t+1]:0,s=t+2<e.length,c=s?e[t+2]:0,l=i>>2,u=(3&i)<<4|o>>4;let f=(15&o)<<2|c>>6,d=63&c;s||(d=64,a||(f=64)),r.push(n[l],n[u],n[f],n[d])}return r.join("")},encodeString(t,n){return this.HAS_NATIVE_SUPPORT&&!n?btoa(t):this.encodeByteArray(e(t),n)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):function(e){const t=[];let n=0,r=0;for(;n<e.length;){const i=e[n++];if(i<128)t[r++]=String.fromCharCode(i);else if(i>191&&i<224){const a=e[n++];t[r++]=String.fromCharCode((31&i)<<6|63&a)}else if(i>239&&i<365){const a=((7&i)<<18|(63&e[n++])<<12|(63&e[n++])<<6|63&e[n++])-65536;t[r++]=String.fromCharCode(55296+(a>>10)),t[r++]=String.fromCharCode(56320+(1023&a))}else{const a=e[n++],o=e[n++];t[r++]=String.fromCharCode((15&i)<<12|(63&a)<<6|63&o)}}return t.join("")}(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const r=t?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let t=0;t<e.length;){const a=r[e.charAt(t++)],o=t<e.length?r[e.charAt(t)]:0;++t;const s=t<e.length?r[e.charAt(t)]:64;++t;const c=t<e.length?r[e.charAt(t)]:64;if(++t,null==a||null==o||null==s||null==c)throw new n;const l=a<<2|o>>4;if(i.push(l),64!==s){const e=o<<4&240|s>>2;if(i.push(e),64!==c){const e=s<<6&192|c;i.push(e)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};
/**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */class n extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const r=function(n){return function(n){const r=e(n);return t.encodeByteArray(r,!0)}(n).replace(/\./g,"")},i=function(e){try{return t.decodeString(e,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};function a(e,t){if(!(t instanceof Object))return t;switch(t.constructor){case Date:return new Date(t.getTime());case Object:void 0===e&&(e={});break;case Array:e=[];break;default:return t}for(const n in t)t.hasOwnProperty(n)&&"__proto__"!==n&&(e[n]=a(e[n],t[n]));return e}
/**
     * @license
     * Copyright 2022 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
const o=()=>
/**
     * @license
     * Copyright 2022 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("Unable to locate global object.")}().__FIREBASE_DEFAULTS__,s=()=>{try{return o()||(()=>{if("undefined"==typeof process||void 0===process.env)return;const e=process.env.__FIREBASE_DEFAULTS__;return e?JSON.parse(e):void 0})()||(()=>{if("undefined"==typeof document)return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(e){return}const t=e&&i(e[1]);return t&&JSON.parse(t)})()}catch(e){return void console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`)}},c=()=>s()?.config
/**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */;class l{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),"function"==typeof e&&(this.promise.catch((()=>{})),1===e.length?e(t):e(t,n))}}}function u(){return"undefined"!=typeof WorkerGlobalScope&&"undefined"!=typeof self&&self instanceof WorkerGlobalScope}function f(){try{return"object"==typeof indexedDB}catch(e){return!1}}function d(){return new Promise(((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{t(i.error?.message||"")}}catch(e){t(e)}}))}class p extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,p.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,h.prototype.create)}}class h{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},r=`${this.service}/${e}`,i=this.errors[e],a=i?function(e,t){try{let n=0,r="";for(;n<e.length;){const i=e.indexOf("{$",n);if(-1===i){r+=e.substring(n);break}const a=e.indexOf("}",i+2);if(-1===a){r+=e.substring(n);break}const o=e.substring(i+2,a),s=t[o];r+=e.substring(n,i)+(null!=s?String(s):`<${o}?>`),n=a+1}return r}catch(t){return e}}
/**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */(i,n):"Error",o=`${this.serviceName}: ${a} (${r}).`;return new p(r,o,n)}}function g(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function m(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const i of n){if(!r.includes(i))return!1;const n=e[i],a=t[i];if(b(n)&&b(a)){if(!m(n,a))return!1}else if(n!==a)return!1}for(const e of r)if(!n.includes(e))return!1;return!0}function b(e){return null!==e&&"object"==typeof e}
/**
     * @license
     * Copyright 2021 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */class v{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */const y="[DEFAULT]";
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */class _{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new l;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch(e){}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e?.identifier),n=e?.optional??!1;if(!this.isInitialized(t)&&!this.shouldAutoInitialize()){if(n)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:t})}catch(e){if(n)return null;throw e}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(function(e){return"EAGER"===e.instantiationMode}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */(e))try{this.getOrInitializeService({instanceIdentifier:y})}catch(e){}for(const[e,t]of this.instancesDeferred.entries()){const n=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:n});t.resolve(e)}catch(e){}}}}clearInstance(e=y){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter((e=>"INTERNAL"in e)).map((e=>e.INTERNAL.delete())),...e.filter((e=>"_delete"in e)).map((e=>e._delete()))])}isComponentSet(){return null!=this.component}isInitialized(e=y){return this.instances.has(e)}getOptions(e=y){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[e,t]of this.instancesDeferred.entries()){n===this.normalizeInstanceIdentifier(e)&&t.resolve(r)}return r}onInit(e,t){const n=this.normalizeInstanceIdentifier(t),r=this.onInitCallbacks.get(n)??new Set;r.add(e),this.onInitCallbacks.set(n,r);const i=this.instances.get(n);return i&&e(i,n),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const r of n)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:(r=e,r===y?void 0:r),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}var r;return n||null}normalizeInstanceIdentifier(e=y){return this.component?this.component.multipleInstances?e:y:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}class w{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new _(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */var E,S;!function(e){e.LAZY="LAZY",e.EAGER="EAGER",e.EXPLICIT="EXPLICIT"}(E||(E={})),function(e){e.PUBLIC="PUBLIC",e.PRIVATE="PRIVATE",e.VERSION="VERSION"}(S||(S={}));
/**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
const I=[];var T;!function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"}(T||(T={}));const C={debug:T.DEBUG,verbose:T.VERBOSE,info:T.INFO,warn:T.WARN,error:T.ERROR,silent:T.SILENT},A=T.INFO,D={[T.DEBUG]:"log",[T.VERBOSE]:"log",[T.INFO]:"info",[T.WARN]:"warn",[T.ERROR]:"error"},N=(e,t,...n)=>{if(t<e.logLevel)return;const r=(new Date).toISOString(),i=D[t];if(!i)throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`);console[i](`[${r}]  ${e.name}:`,...n)};class k{constructor(e){this.name=e,this._logLevel=A,this._logHandler=N,this._userLogHandler=null,I.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in T))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?C[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,T.DEBUG,...e),this._logHandler(this,T.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,T.VERBOSE,...e),this._logHandler(this,T.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,T.INFO,...e),this._logHandler(this,T.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,T.WARN,...e),this._logHandler(this,T.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,T.ERROR,...e),this._logHandler(this,T.ERROR,...e)}}let O,M;const L=new WeakMap,P=new WeakMap,R=new WeakMap,B=new WeakMap,F=new WeakMap;let $={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return P.get(e);if("objectStoreNames"===t)return e.objectStoreNames||R.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return j(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function U(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(M||(M=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(V(this),t),j(L.get(this))}:function(...t){return j(e.apply(V(this),t))}:function(t,...n){const r=e.call(V(this),t,...n);return R.set(r,t.sort?t.sort():[t]),j(r)}}function x(e){return"function"==typeof e?U(e):(e instanceof IDBTransaction&&function(e){if(P.has(e))return;const t=new Promise(((t,n)=>{const r=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",a),e.removeEventListener("abort",a)},i=()=>{t(),r()},a=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",i),e.addEventListener("error",a),e.addEventListener("abort",a)}));P.set(e,t)}(e),t=e,(O||(O=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some((e=>t instanceof e))?new Proxy(e,$):e);var t}function j(e){if(e instanceof IDBRequest)return function(e){const t=new Promise(((t,n)=>{const r=()=>{e.removeEventListener("success",i),e.removeEventListener("error",a)},i=()=>{t(j(e.result)),r()},a=()=>{n(e.error),r()};e.addEventListener("success",i),e.addEventListener("error",a)}));return t.then((t=>{t instanceof IDBCursor&&L.set(t,e)})).catch((()=>{})),F.set(t,e),t}(e);if(B.has(e))return B.get(e);const t=x(e);return t!==e&&(B.set(e,t),F.set(t,e)),t}const V=e=>F.get(e);function z(e,t,{blocked:n,upgrade:r,blocking:i,terminated:a}={}){const o=indexedDB.open(e,t),s=j(o);return r&&o.addEventListener("upgradeneeded",(e=>{r(j(o.result),e.oldVersion,e.newVersion,j(o.transaction),e)})),n&&o.addEventListener("blocked",(e=>n(e.oldVersion,e.newVersion,e))),s.then((e=>{a&&e.addEventListener("close",(()=>a())),i&&e.addEventListener("versionchange",(e=>i(e.oldVersion,e.newVersion,e)))})).catch((()=>{})),s}const H=["get","getKey","getAll","getAllKeys","count"],q=["put","add","delete","clear"],W=new Map;function J(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(W.get(t))return W.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,i=q.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!i&&!H.includes(n))return;const a=async function(e,...t){const a=this.transaction(e,i?"readwrite":"readonly");let o=a.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&a.done]))[0]};return W.set(t,a),a}$=(e=>({...e,get:(t,n,r)=>J(t,n)||e.get(t,n,r),has:(t,n)=>!!J(t,n)||e.has(t,n)}))($);
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
class K{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map((e=>{if(function(e){const t=e.getComponent();return"VERSION"===t?.type}(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null})).filter((e=>e)).join(" ")}}const G="@firebase/app",X="0.16.2",Y=new k("@firebase/app"),Z="@firebase/app-compat",Q="@firebase/analytics-compat",ee="@firebase/analytics",te="@firebase/app-check-compat",ne="@firebase/app-check",re="@firebase/auth",ie="@firebase/auth-compat",ae="@firebase/database",oe="@firebase/data-connect",se="@firebase/database-compat",ce="@firebase/functions",le="@firebase/functions-compat",ue="@firebase/installations",fe="@firebase/installations-compat",de="@firebase/messaging",pe="@firebase/messaging-compat",he="@firebase/performance",ge="@firebase/performance-compat",me="@firebase/remote-config",be="@firebase/remote-config-compat",ve="@firebase/storage",ye="@firebase/storage-compat",_e="@firebase/firestore",we="@firebase/ai",Ee="@firebase/firestore-compat",Se="firebase",Ie="[DEFAULT]",Te={[G]:"fire-core",[Z]:"fire-core-compat",[ee]:"fire-analytics",[Q]:"fire-analytics-compat",[ne]:"fire-app-check",[te]:"fire-app-check-compat",[re]:"fire-auth",[ie]:"fire-auth-compat",[ae]:"fire-rtdb",[oe]:"fire-data-connect",[se]:"fire-rtdb-compat",[ce]:"fire-fn",[le]:"fire-fn-compat",[ue]:"fire-iid",[fe]:"fire-iid-compat",[de]:"fire-fcm",[pe]:"fire-fcm-compat",[he]:"fire-perf",[ge]:"fire-perf-compat",[me]:"fire-rc",[be]:"fire-rc-compat",[ve]:"fire-gcs",[ye]:"fire-gcs-compat",[_e]:"fire-fst",[Ee]:"fire-fst-compat",[we]:"fire-vertex","fire-js":"fire-js",[Se]:"fire-js-all"},Ce=new Map,Ae=new Map,De=new Map;function Ne(e,t){try{e.container.addComponent(t)}catch(n){Y.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function ke(e){const t=e.name;if(De.has(t))return Y.debug(`There were multiple attempts to register component ${t}.`),!1;De.set(t,e);for(const t of Ce.values())Ne(t,e);for(const t of Ae.values())Ne(t,e);return!0}function Oe(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function Me(e){return void 0!==e.options}function Le(e){return!Me(e)&&("authIdToken"in e||"appCheckToken"in e||"releaseOnDeref"in e||"automaticDataCollectionEnabled"in e)}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
const Pe=new h("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
class Re{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new v("app",(()=>this),"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Pe.create("app-deleted",{appName:this._name})}}
/**
     * @license
     * Copyright 2023 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */function Be(e,t){const n=i(e.split(".")[1]);if(null===n)return void console.error(`FirebaseServerApp ${t} is invalid: second part could not be parsed.`);if(void 0===JSON.parse(n).exp)return void console.error(`FirebaseServerApp ${t} is invalid: expiration claim could not be parsed`);1e3*JSON.parse(n).exp-(new Date).getTime()<=0&&console.error(`FirebaseServerApp ${t} is invalid: the token has expired.`)}class Fe extends Re{constructor(e,t,n,r){const i=void 0===t.automaticDataCollectionEnabled||t.automaticDataCollectionEnabled,a={name:n,automaticDataCollectionEnabled:i};if(void 0!==e.apiKey)super(e,a,r);else{super(e.options,a,r)}this._serverConfig={automaticDataCollectionEnabled:i,...t},this._serverConfig.authIdToken&&Be(this._serverConfig.authIdToken,"authIdToken"),this._serverConfig.appCheckToken&&Be(this._serverConfig.appCheckToken,"appCheckToken"),this._finalizationRegistry=null,"undefined"!=typeof FinalizationRegistry&&(this._finalizationRegistry=new FinalizationRegistry((()=>{this.automaticCleanup()}))),this._refCount=0,this.incRefCount(this._serverConfig.releaseOnDeref),this._serverConfig.releaseOnDeref=void 0,t.releaseOnDeref=void 0,je(G,X,"serverapp")}toJSON(){}get refCount(){return this._refCount}incRefCount(e){this.isDeleted||(this._refCount++,void 0!==e&&null!==this._finalizationRegistry&&this._finalizationRegistry.register(e,this))}decRefCount(){return this.isDeleted?0:--this._refCount}automaticCleanup(){xe(this)}get settings(){return this.checkDestroyed(),this._serverConfig}checkDestroyed(){if(this.isDeleted)throw Pe.create("server-app-deleted")}}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */const $e="12.19.0";function Ue(e,t={}){let n=e;if("object"!=typeof t){t={name:t}}const r={name:Ie,automaticDataCollectionEnabled:!0,...t},i=r.name;if("string"!=typeof i||!i)throw Pe.create("bad-app-name",{appName:String(i)});if(n||(n=c()),!n)throw Pe.create("no-options");const a=Ce.get(i);if(a){if(m(n,a.options)){if(m(r,a.config))return a;throw Pe.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(a.config),newValue:JSON.stringify(r)})}throw Pe.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(a.options),newValue:JSON.stringify(n)})}const o=new w(i);for(const e of De.values())o.addComponent(e);const s=new Re(n,r,o);return Ce.set(i,s),s}async function xe(e){let t=!1;const n=e.name;if(Ce.has(n))t=!0,Ce.delete(n);else if(Ae.has(n)){e.decRefCount()<=0&&(Ae.delete(n),t=!0)}t&&(await Promise.all(e.container.getProviders().map((e=>e.delete()))),e.isDeleted=!0)}function je(e,t,n){let r=Te[e]??e;n&&(r+=`-${n}`);const i=r.match(/\s|\//),a=t.match(/\s|\//);if(i||a){const e=[`Unable to register library "${r}" with version "${t}":`];return i&&e.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&a&&e.push("and"),a&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void Y.warn(e.join(" "))}ke(new v(`${r}-version`,(()=>({library:r,version:t})),"VERSION"))}function Ve(e,t){if(null!==e&&"function"!=typeof e)throw Pe.create("invalid-log-argument");!function(e,t){for(const n of I){let r=null;t&&t.level&&(r=C[t.level]),n.userLogHandler=null===e?null:(t,n,...i)=>{const a=i.map((e=>{if(null==e)return null;if("string"==typeof e)return e;if("number"==typeof e||"boolean"==typeof e)return e.toString();if(e instanceof Error)return e.message;try{return JSON.stringify(e)}catch(e){return null}})).filter((e=>e)).join(" ");n>=(r??t.logLevel)&&e({level:T[n].toLowerCase(),message:a,args:i,type:t.name})}}}(e,t)}function ze(e){var t;t=e,I.forEach((e=>{e.setLogLevel(t)}))}
/**
     * @license
     * Copyright 2021 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */const He="firebase-heartbeat-store";let qe=null;function We(){return qe||(qe=z("firebase-heartbeat-database",1,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(He)}catch(e){console.warn(e)}}}).catch((e=>{throw Pe.create("idb-open",{originalErrorMessage:e.message})}))),qe}async function Je(e,t){try{const n=(await We()).transaction(He,"readwrite"),r=n.objectStore(He);await r.put(t,Ke(e)),await n.done}catch(e){if(e instanceof p)Y.warn(e.message);else{const t=Pe.create("idb-set",{originalErrorMessage:e?.message});Y.warn(t.message)}}}function Ke(e){return`${e.name}!${e.options.appId}`}
/**
     * @license
     * Copyright 2021 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */class Ge{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Ye(t),this._heartbeatsCachePromise=this._storage.read().then((e=>(this._heartbeatsCache=e,e)))}async triggerHeartbeat(){try{const e=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),t=Xe();if(null==this._heartbeatsCache?.heartbeats&&(this._heartbeatsCache=await this._heartbeatsCachePromise,null==this._heartbeatsCache?.heartbeats))return;if(this._heartbeatsCache.lastSentHeartbeatDate===t||this._heartbeatsCache.heartbeats.some((e=>e.date===t)))return;if(this._heartbeatsCache.heartbeats.push({date:t,agent:e}),this._heartbeatsCache.heartbeats.length>30){const e=function(e){if(0===e.length)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(e,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){Y.warn(e)}}async getHeartbeatsHeader(){try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==this._heartbeatsCache?.heartbeats||0===this._heartbeatsCache.heartbeats.length)return"";const e=Xe(),{heartbeatsToSend:t,unsentEntries:n}=function(e,t=1024){const n=[];let r=e.slice();for(const i of e){const e=n.find((e=>e.agent===i.agent));if(e){if(e.dates.push(i.date),Ze(n)>t){e.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Ze(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}(this._heartbeatsCache.heartbeats),i=r(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,n.length>0?(this._heartbeatsCache.heartbeats=n,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return Y.warn(e),""}}}function Xe(){return(new Date).toISOString().substring(0,10)}class Ye{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!f()&&d().then((()=>!0)).catch((()=>!1))}async read(){if(await this._canUseIndexedDBPromise){const e=await async function(e){try{const t=(await We()).transaction(He),n=await t.objectStore(He).get(Ke(e));return await t.done,n}catch(e){if(e instanceof p)Y.warn(e.message);else{const t=Pe.create("idb-get",{originalErrorMessage:e?.message});Y.warn(t.message)}}}(this.app);return e?.heartbeats?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const t=await this.read();return Je(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){if(await this._canUseIndexedDBPromise){const t=await this.read();return Je(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:[...t.heartbeats,...e.heartbeats]})}}}function Ze(e){return r(JSON.stringify({version:2,heartbeats:e})).length}var Qe;
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */Qe="",ke(new v("platform-logger",(e=>new K(e)),"PRIVATE")),ke(new v("heartbeat",(e=>new Ge(e)),"PRIVATE")),je(G,X,Qe),je(G,X,"esm2020"),je("fire-js","");var et=Object.freeze({__proto__:null,FirebaseError:p,SDK_VERSION:$e,_DEFAULT_ENTRY_NAME:Ie,_addComponent:Ne,_addOrOverwriteComponent:function(e,t){e.container.addOrOverwriteComponent(t)},_apps:Ce,_clearComponents:function(){De.clear()},_components:De,_getProvider:Oe,_isFirebaseApp:Me,_isFirebaseServerApp:function(e){return null!=e&&void 0!==e.settings},_isFirebaseServerAppSettings:Le,_registerComponent:ke,_removeServiceInstance:function(e,t,n=Ie){Oe(e,t).clearInstance(n)},_serverApps:Ae,deleteApp:xe,getApp:function(e=Ie){const t=Ce.get(e);if(!t&&e===Ie&&c())return Ue();if(!t)throw Pe.create("no-app",{appName:e});return t},getApps:function(){return Array.from(Ce.values())},initializeApp:Ue,initializeServerApp:function(e,t={}){if(("undefined"!=typeof window||u())&&!u())throw Pe.create("invalid-server-app-environment");let n,r=t||{};if(e&&(Me(e)?n=e.options:Le(e)?r=e:n=e),void 0===r.automaticDataCollectionEnabled&&(r.automaticDataCollectionEnabled=!0),n||(n=c()),!n)throw Pe.create("no-options");const i={...r,...n};if(void 0!==i.releaseOnDeref&&delete i.releaseOnDeref,void 0!==r.releaseOnDeref&&"undefined"==typeof FinalizationRegistry)throw Pe.create("finalization-registry-not-supported",{});const a=""+(e=>[...e].reduce(((e,t)=>Math.imul(31,e)+t.charCodeAt(0)|0),0))(JSON.stringify(i)),o=Ae.get(a);if(o)return o.incRefCount(r.releaseOnDeref),o;const s=new w(a);for(const e of De.values())s.addComponent(e);const l=new Fe(n,r,a,s);return Ae.set(a,l),l},onLog:Ve,registerVersion:je,setLogLevel:ze});
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */class tt{constructor(e,t){this._delegate=e,this.firebase=t,Ne(e,new v("app-compat",(()=>this),"PUBLIC"))}get automaticDataCollectionEnabled(){return this._delegate.automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.automaticDataCollectionEnabled=e}get name(){return this._delegate.name}get options(){return this._delegate.options}delete(){return this.firebase.INTERNAL.removeApp(this.name),xe(this._delegate)}_getService(e,t=Ie){return this._delegate.checkDestroyed(),this._delegate.container.getProvider(e).getImmediate({identifier:t})}}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */const nt=new h("app-compat","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance."});
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
function rt(e){const t={},n={__esModule:!0,initializeApp:function(r,i={}){const a=Ue(r,i);if(g(t,a.name))return t[a.name];const o=new e(a,n);return t[a.name]=o,o},app:r,registerVersion:je,setLogLevel:ze,onLog:Ve,apps:null,SDK_VERSION:$e,INTERNAL:{registerComponent:function(t){const i=t.name,o=i.replace("-compat","");if(ke(t)&&"PUBLIC"===t.type){const s=(e=r())=>{if("function"!=typeof e[o])throw nt.create("invalid-app-argument",{appName:i});return e[o]()};void 0!==t.serviceProps&&a(s,t.serviceProps),n[o]=s,e.prototype[o]=function(...e){return this._getService.bind(this,i).apply(this,t.multipleInstances?e:[])}}return"PUBLIC"===t.type?n[o]:null},removeApp:function(e){delete t[e]},useAsService:function(e,t){if("serverAuth"===t)return null;return t},modularAPIs:et}};function r(e){if(!g(t,e=e||Ie))throw nt.create("no-app",{appName:e});return t[e]}return n.default=n,Object.defineProperty(n,"apps",{get:function(){return Object.keys(t).map((e=>t[e]))}}),r.App=e,n}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
const it=function(){const e=rt(tt);e.SDK_VERSION=`${e.SDK_VERSION}_LITE`;const t=e.INTERNAL.registerComponent;return e.INTERNAL.registerComponent=function(e){if("PUBLIC"===e.type&&!e.name.includes("performance")&&!e.name.includes("installations"))throw Error(`${name} cannot register with the standalone perf instance`);return t(e)},e}();!
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
function(e){je("@firebase/app-compat","0.5.18",e)}("lite");
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
it.registerVersion("firebase","12.19.0","app-compat");var at,ot,st=function(){var e=self.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];if(e&&e.responseStart>0&&e.responseStart<performance.now())return e},ct=function(e){if("loading"===document.readyState)return"loading";var t=st();if(t){if(e<t.domInteractive)return"loading";if(0===t.domContentLoadedEventStart||e<t.domContentLoadedEventStart)return"dom-interactive";if(0===t.domComplete||e<t.domComplete)return"dom-content-loaded"}return"complete"},lt=function(e){var t=e.nodeName;return 1===e.nodeType?t.toLowerCase():t.toUpperCase().replace(/^#/,"")},ut=function(e,t){var n="";try{for(;e&&9!==e.nodeType;){var r=e,i=r.id?"#"+r.id:lt(r)+(r.classList&&r.classList.value&&r.classList.value.trim()&&r.classList.value.trim().length?"."+r.classList.value.trim().replace(/\s+/g,"."):"");if(n.length+i.length>(t||100)-1)return n||i;if(n=n?i+">"+n:i,r.id)break;e=r.parentNode}}catch(e){}return n},ft=-1,dt=function(e){addEventListener("pageshow",(function(t){t.persisted&&(ft=t.timeStamp,e(t))}),!0)},pt=function(){var e=st();return e&&e.activationStart||0},ht=function(e,t){var n=st(),r="navigate";return ft>=0?r="back-forward-cache":n&&(document.prerendering||pt()>0?r="prerender":document.wasDiscarded?r="restore":n.type&&(r=n.type.replace(/_/g,"-"))),{name:e,value:void 0===t?-1:t,rating:"good",delta:0,entries:[],id:"v4-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:r}},gt=function(e,t,n){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){var r=new PerformanceObserver((function(e){Promise.resolve().then((function(){t(e.getEntries())}))}));return r.observe(Object.assign({type:e,buffered:!0},n||{})),r}}catch(e){}},mt=function(e,t,n,r){var i,a;return function(o){t.value>=0&&(o||r)&&((a=t.value-(i||0))||void 0===i)&&(i=t.value,t.delta=a,t.rating=function(e,t){return e>t[1]?"poor":e>t[0]?"needs-improvement":"good"}(t.value,n),e(t))}},bt=function(e){requestAnimationFrame((function(){return requestAnimationFrame((function(){return e()}))}))},vt=function(e){document.addEventListener("visibilitychange",(function(){"hidden"===document.visibilityState&&e()}))},yt=function(e){var t=!1;return function(){t||(e(),t=!0)}},_t=-1,wt=function(){return"hidden"!==document.visibilityState||document.prerendering?1/0:0},Et=function(e){"hidden"===document.visibilityState&&_t>-1&&(_t="visibilitychange"===e.type?e.timeStamp:0,It())},St=function(){addEventListener("visibilitychange",Et,!0),addEventListener("prerenderingchange",Et,!0)},It=function(){removeEventListener("visibilitychange",Et,!0),removeEventListener("prerenderingchange",Et,!0)},Tt=function(){return _t<0&&(_t=wt(),St(),dt((function(){setTimeout((function(){_t=wt(),St()}),0)}))),{get firstHiddenTime(){return _t}}},Ct=function(e){document.prerendering?addEventListener("prerenderingchange",(function(){return e()}),!0):e()},At=[1800,3e3],Dt=[.1,.25],Nt=function(e,t){!function(e,t){t=t||{},function(e,t){t=t||{},Ct((function(){var n,r=Tt(),i=ht("FCP"),a=gt("paint",(function(e){e.forEach((function(e){"first-contentful-paint"===e.name&&(a.disconnect(),e.startTime<r.firstHiddenTime&&(i.value=Math.max(e.startTime-pt(),0),i.entries.push(e),n(!0)))}))}));a&&(n=mt(e,i,At,t.reportAllChanges),dt((function(r){i=ht("FCP"),n=mt(e,i,At,t.reportAllChanges),bt((function(){i.value=performance.now()-r.timeStamp,n(!0)}))})))}))}(yt((function(){var n,r=ht("CLS",0),i=0,a=[],o=function(e){e.forEach((function(e){if(!e.hadRecentInput){var t=a[0],n=a[a.length-1];i&&e.startTime-n.startTime<1e3&&e.startTime-t.startTime<5e3?(i+=e.value,a.push(e)):(i=e.value,a=[e])}})),i>r.value&&(r.value=i,r.entries=a,n())},s=gt("layout-shift",o);s&&(n=mt(e,r,Dt,t.reportAllChanges),vt((function(){o(s.takeRecords()),n(!0)})),dt((function(){i=0,r=ht("CLS",0),n=mt(e,r,Dt,t.reportAllChanges),bt((function(){return n()}))})),setTimeout(n,0))})))}((function(t){var n=function(e){var t,n={};if(e.entries.length){var r=e.entries.reduce((function(e,t){return e&&e.value>t.value?e:t}));if(r&&r.sources&&r.sources.length){var i=(t=r.sources).find((function(e){return e.node&&1===e.node.nodeType}))||t[0];i&&(n={largestShiftTarget:ut(i.node),largestShiftTime:r.startTime,largestShiftValue:r.value,largestShiftSource:i,largestShiftEntry:r,loadState:ct(r.startTime)})}}return Object.assign(e,{attribution:n})}(t);e(n)}),t)},kt=0,Ot=1/0,Mt=0,Lt=function(e){e.forEach((function(e){e.interactionId&&(Ot=Math.min(Ot,e.interactionId),Mt=Math.max(Mt,e.interactionId),kt=Mt?(Mt-Ot)/7+1:0)}))},Pt=function(){return at?kt:performance.interactionCount||0},Rt=function(){"interactionCount"in performance||at||(at=gt("event",Lt,{type:"event",buffered:!0,durationThreshold:0}))},Bt=[],Ft=new Map,$t=0,Ut=[],xt=function(e){if(Ut.forEach((function(t){return t(e)})),e.interactionId||"first-input"===e.entryType){var t=Bt[Bt.length-1],n=Ft.get(e.interactionId);if(n||Bt.length<10||e.duration>t.latency){if(n)e.duration>n.latency?(n.entries=[e],n.latency=e.duration):e.duration===n.latency&&e.startTime===n.entries[0].startTime&&n.entries.push(e);else{var r={id:e.interactionId,latency:e.duration,entries:[e]};Ft.set(r.id,r),Bt.push(r)}Bt.sort((function(e,t){return t.latency-e.latency})),Bt.length>10&&Bt.splice(10).forEach((function(e){return Ft.delete(e.id)}))}}},jt=function(e){var t=self.requestIdleCallback||self.setTimeout,n=-1;return e=yt(e),"hidden"===document.visibilityState?e():(n=t(e),vt(e)),n},Vt=[200,500],zt=function(e,t){"PerformanceEventTiming"in self&&"interactionId"in PerformanceEventTiming.prototype&&(t=t||{},Ct((function(){var n;Rt();var r,i=ht("INP"),a=function(e){jt((function(){e.forEach(xt);var t=function(){var e=Math.min(Bt.length-1,Math.floor((Pt()-$t)/50));return Bt[e]}();t&&t.latency!==i.value&&(i.value=t.latency,i.entries=t.entries,r())}))},o=gt("event",a,{durationThreshold:null!==(n=t.durationThreshold)&&void 0!==n?n:40});r=mt(e,i,Vt,t.reportAllChanges),o&&(o.observe({type:"first-input",buffered:!0}),vt((function(){a(o.takeRecords()),r(!0)})),dt((function(){$t=Pt(),Bt.length=0,Ft.clear(),i=ht("INP"),r=mt(e,i,Vt,t.reportAllChanges)})))})))},Ht=[],qt=[],Wt=0,Jt=new WeakMap,Kt=new Map,Gt=-1,Xt=function(e){Ht=Ht.concat(e),Yt()},Yt=function(){Gt<0&&(Gt=jt(Zt))},Zt=function(){Kt.size>10&&Kt.forEach((function(e,t){Ft.has(t)||Kt.delete(t)}));var e=Bt.map((function(e){return Jt.get(e.entries[0])})),t=qt.length-50;qt=qt.filter((function(n,r){return r>=t||e.includes(n)}));for(var n=new Set,r=0;r<qt.length;r++){var i=qt[r];Qt(i.startTime,i.processingEnd).forEach((function(e){n.add(e)}))}var a=Ht.length-1-50;Ht=Ht.filter((function(e,t){return e.startTime>Wt&&t>a||n.has(e)})),Gt=-1};Ut.push((function(e){e.interactionId&&e.target&&!Kt.has(e.interactionId)&&Kt.set(e.interactionId,e.target)}),(function(e){var t,n=e.startTime+e.duration;Wt=Math.max(Wt,e.processingEnd);for(var r=qt.length-1;r>=0;r--){var i=qt[r];if(Math.abs(n-i.renderTime)<=8){(t=i).startTime=Math.min(e.startTime,t.startTime),t.processingStart=Math.min(e.processingStart,t.processingStart),t.processingEnd=Math.max(e.processingEnd,t.processingEnd),t.entries.push(e);break}}t||(t={startTime:e.startTime,processingStart:e.processingStart,processingEnd:e.processingEnd,renderTime:n,entries:[e]},qt.push(t)),(e.interactionId||"first-input"===e.entryType)&&Jt.set(e,t),Yt()}));var Qt=function(e,t){for(var n,r=[],i=0;n=Ht[i];i++)if(!(n.startTime+n.duration<e)){if(n.startTime>t)break;r.push(n)}return r},en=function(e,t){ot||(ot=gt("long-animation-frame",Xt)),zt((function(t){var n=function(e){var t=e.entries[0],n=Jt.get(t),r=t.processingStart,i=n.processingEnd,a=n.entries.sort((function(e,t){return e.processingStart-t.processingStart})),o=Qt(t.startTime,i),s=e.entries.find((function(e){return e.target})),c=s&&s.target||Kt.get(t.interactionId),l=[t.startTime+t.duration,i].concat(o.map((function(e){return e.startTime+e.duration}))),u=Math.max.apply(Math,l),f={interactionTarget:ut(c),interactionTargetElement:c,interactionType:t.name.startsWith("key")?"keyboard":"pointer",interactionTime:t.startTime,nextPaintTime:u,processedEventEntries:a,longAnimationFrameEntries:o,inputDelay:r-t.startTime,processingDuration:i-r,presentationDelay:Math.max(u-i,0),loadState:ct(t.startTime)};return Object.assign(e,{attribution:f})}(t);e(n)}),t)},tn=[2500,4e3],nn={},rn=function(e,t){!function(e,t){t=t||{},Ct((function(){var n,r=Tt(),i=ht("LCP"),a=function(e){t.reportAllChanges||(e=e.slice(-1)),e.forEach((function(e){e.startTime<r.firstHiddenTime&&(i.value=Math.max(e.startTime-pt(),0),i.entries=[e],n())}))},o=gt("largest-contentful-paint",a);if(o){n=mt(e,i,tn,t.reportAllChanges);var s=yt((function(){nn[i.id]||(a(o.takeRecords()),o.disconnect(),nn[i.id]=!0,n(!0))}));["keydown","click"].forEach((function(e){addEventListener(e,(function(){return jt(s)}),{once:!0,capture:!0})})),vt(s),dt((function(r){i=ht("LCP"),n=mt(e,i,tn,t.reportAllChanges),bt((function(){i.value=performance.now()-r.timeStamp,nn[i.id]=!0,n(!0)}))}))}}))}((function(t){var n=function(e){var t={timeToFirstByte:0,resourceLoadDelay:0,resourceLoadDuration:0,elementRenderDelay:e.value};if(e.entries.length){var n=st();if(n){var r=n.activationStart||0,i=e.entries[e.entries.length-1],a=i.url&&performance.getEntriesByType("resource").filter((function(e){return e.name===i.url}))[0],o=Math.max(0,n.responseStart-r),s=Math.max(o,a?(a.requestStart||a.startTime)-r:0),c=Math.max(s,a?a.responseEnd-r:0),l=Math.max(c,i.startTime-r);t={element:ut(i.element),timeToFirstByte:o,resourceLoadDelay:s-o,resourceLoadDuration:c-s,elementRenderDelay:l-c,navigationEntry:n,lcpEntry:i},i.url&&(t.url=i.url),a&&(t.lcpResourceEntry=a)}}return Object.assign(e,{attribution:t})}(t);e(n)}),t)};const an="@firebase/installations",on="0.6.24",sn=1e4,cn=`w:${on}`,ln="FIS_v2",un=36e5,fn=new h("installations","Installations",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."});function dn(e){return e instanceof p&&e.code.includes("request-failed")}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */function pn({projectId:e}){return`https://firebaseinstallations.googleapis.com/v1/projects/${e}/installations`}function hn(e){return{token:e.token,requestStatus:2,expiresIn:(t=e.expiresIn,Number(t.replace("s","000"))),creationTime:Date.now()};var t}async function gn(e,t){const n=(await t.json()).error;return fn.create("request-failed",{requestName:e,serverCode:n.code,serverMessage:n.message,serverStatus:n.status})}function mn({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function bn(e,{refreshToken:t}){const n=mn(e);return n.append("Authorization",function(e){return`${ln} ${e}`}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */(t)),n}async function vn(e){const t=await e();return t.status>=500&&t.status<600?e():t}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
function yn(e){return new Promise((t=>{setTimeout(t,e)}))}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
const _n=/^[cdef][\w-]{21}$/;function wn(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const t=function(e){const t=(n=e,btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_"));var n;return t.substr(0,22)}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */(e);return _n.test(t)?t:""}catch{return""}}function En(e){return`${e.appName}!${e.appId}`}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */const Sn=new Map;function In(e,t){const n=En(e);Tn(n,t),function(e,t){const n=function(){!Cn&&"BroadcastChannel"in self&&(Cn=new BroadcastChannel("[Firebase] FID Change"),Cn.onmessage=e=>{Tn(e.data.key,e.data.fid)});return Cn}();n&&n.postMessage({key:e,fid:t});0===Sn.size&&Cn&&(Cn.close(),Cn=null)}(n,t)}function Tn(e,t){const n=Sn.get(e);if(n)for(const e of n)e(t)}let Cn=null;
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
const An="firebase-installations-store";let Dn=null;function Nn(){return Dn||(Dn=z("firebase-installations-database",1,{upgrade:(e,t)=>{if(0===t)e.createObjectStore(An)}})),Dn}async function kn(e,t){const n=En(e),r=(await Nn()).transaction(An,"readwrite"),i=r.objectStore(An),a=await i.get(n);return await i.put(t,n),await r.done,a&&a.fid===t.fid||In(e,t.fid),t}async function On(e){const t=En(e),n=(await Nn()).transaction(An,"readwrite");await n.objectStore(An).delete(t),await n.done}async function Mn(e,t){const n=En(e),r=(await Nn()).transaction(An,"readwrite"),i=r.objectStore(An),a=await i.get(n),o=t(a);return void 0===o?await i.delete(n):await i.put(o,n),await r.done,!o||a&&a.fid===o.fid||In(e,o.fid),o}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */async function Ln(e){let t;const n=await Mn(e.appConfig,(n=>{const r=function(e){const t=e||{fid:wn(),registrationStatus:0};return Bn(t)}(n),i=function(e,t){if(0===t.registrationStatus){if(!navigator.onLine){return{installationEntry:t,registrationPromise:Promise.reject(fn.create("app-offline"))}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},r=async function(e,t){try{const n=await async function({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const r=pn(e),i=mn(e),a=t.getImmediate({optional:!0});if(a){const e=await a.getHeartbeatsHeader();e&&i.append("x-firebase-client",e)}const o={fid:n,authVersion:ln,appId:e.appId,sdkVersion:cn},s={method:"POST",headers:i,body:JSON.stringify(o)},c=await vn((()=>fetch(r,s)));if(c.ok){const e=await c.json();return{fid:e.fid||n,registrationStatus:2,refreshToken:e.refreshToken,authToken:hn(e.authToken)}}throw await gn("Create Installation",c)}(e,t);return kn(e.appConfig,n)}catch(n){throw dn(n)&&409===n.customData.serverCode?await On(e.appConfig):await kn(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}(e,n);return{installationEntry:n,registrationPromise:r}}return 1===t.registrationStatus?{installationEntry:t,registrationPromise:Pn(e)}:{installationEntry:t}}(e,r);return t=i.registrationPromise,i.installationEntry}));return""===n.fid?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}async function Pn(e){let t=await Rn(e.appConfig);for(;1===t.registrationStatus;)await yn(100),t=await Rn(e.appConfig);if(0===t.registrationStatus){const{installationEntry:t,registrationPromise:n}=await Ln(e);return n||t}return t}function Rn(e){return Mn(e,(e=>{if(!e)throw fn.create("installation-not-found");return Bn(e)}))}function Bn(e){return 1===(t=e).registrationStatus&&t.registrationTime+sn<Date.now()?{fid:e.fid,registrationStatus:0}:e;var t;
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */}async function Fn({appConfig:e,heartbeatServiceProvider:t},n){const r=function(e,{fid:t}){return`${pn(e)}/${t}/authTokens:generate`}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */(e,n),i=bn(e,n),a=t.getImmediate({optional:!0});if(a){const e=await a.getHeartbeatsHeader();e&&i.append("x-firebase-client",e)}const o={installation:{sdkVersion:cn,appId:e.appId}},s={method:"POST",headers:i,body:JSON.stringify(o)},c=await vn((()=>fetch(r,s)));if(c.ok){return hn(await c.json())}throw await gn("Generate Auth Token",c)}async function $n(e,t=!1){let n;const r=await Mn(e.appConfig,(r=>{if(!xn(r))throw fn.create("not-registered");const i=r.authToken;if(!t&&function(e){return 2===e.requestStatus&&!function(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+un}(e)}(i))return r;if(1===i.requestStatus)return n=async function(e,t){let n=await Un(e.appConfig);for(;1===n.authToken.requestStatus;)await yn(100),n=await Un(e.appConfig);const r=n.authToken;return 0===r.requestStatus?$n(e,t):r}(e,t),r;{if(!navigator.onLine)throw fn.create("app-offline");const t=function(e){const t={requestStatus:1,requestTime:Date.now()};return{...e,authToken:t}}(r);return n=async function(e,t){try{const n=await Fn(e,t),r={...t,authToken:n};return await kn(e.appConfig,r),n}catch(n){if(!dn(n)||401!==n.customData.serverCode&&404!==n.customData.serverCode){const n={...t,authToken:{requestStatus:0}};await kn(e.appConfig,n)}else await On(e.appConfig);throw n}}(e,t),t}}));return n?await n:r.authToken}function Un(e){return Mn(e,(e=>{if(!xn(e))throw fn.create("not-registered");const t=e.authToken;return 1===(n=t).requestStatus&&n.requestTime+sn<Date.now()?{...e,authToken:{requestStatus:0}}:e;var n;
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */}))}function xn(e){return void 0!==e&&2===e.registrationStatus}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
async function jn(e,t=!1){const n=e;await async function(e){const{registrationPromise:t}=await Ln(e);t&&await t}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */(n);return(await $n(n,t)).token}function Vn(e){return fn.create("missing-app-config-values",{valueName:e})}
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */const zn="installations",Hn=e=>{const t=Oe(e.getProvider("app").getImmediate(),zn).getImmediate();return{getId:()=>async function(e){const t=e,{installationEntry:n,registrationPromise:r}=await Ln(t);return r?r.catch(console.error):$n(t).catch(console.error),n.fid}(t),getToken:e=>jn(t,e)}};ke(new v(zn,(e=>{const t=e.getProvider("app").getImmediate(),n=function(e){if(!e||!e.options)throw Vn("App Configuration");if(!e.name)throw Vn("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw Vn(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}(t);return{app:t,appConfig:n,heartbeatServiceProvider:Oe(t,"heartbeat"),_delete:()=>Promise.resolve()}}),"PUBLIC")),ke(new v("installations-internal",Hn,"PRIVATE")),je(an,on),je(an,on,"esm2020");const qn="@firebase/performance",Wn="0.7.14",Jn=Wn,Kn="FB-PERF-TRACE-MEASURE",Gn="_wt_",Xn="_fcp",Yn="_fid",Zn="_lcp",Qn="_inp",er="_cls",tr="@firebase/performance/config",nr="@firebase/performance/configexpire",rr="Performance",ir=new h("performance",rr,{"trace started":"Trace {$traceName} was started before.","trace stopped":"Trace {$traceName} is not running.","nonpositive trace startTime":"Trace {$traceName} startTime should be positive.","nonpositive trace duration":"Trace {$traceName} duration should be positive.","no window":"Window is not available.","no app id":"App id is not available.","no project id":"Project id is not available.","no api key":"Api key is not available.","invalid cc log":"Attempted to queue invalid cc event","FB not default":"Performance can only start when Firebase app instance is the default one.","RC response not ok":"RC response is not ok","invalid attribute name":"Attribute name {$attributeName} is invalid.","invalid attribute value":"Attribute value {$attributeValue} is invalid.","invalid custom metric name":"Custom metric name {$customMetricName} is invalid","invalid String merger input":"Input for String merger is invalid, contact support team to resolve.","already initialized":"initializePerformance() has already been called with different options. To avoid this error, call initializePerformance() with the same options as when it was originally called, or call getPerformance() to return the already initialized instance."}),ar=new k(rr);
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
let or,sr,cr,lr;ar.logLevel=T.INFO;class ur{constructor(e){if(this.window=e,!e)throw ir.create("no window");this.performance=e.performance,this.PerformanceObserver=e.PerformanceObserver,this.windowLocation=e.location,this.navigator=e.navigator,this.document=e.document,this.navigator&&this.navigator.cookieEnabled&&(this.localStorage=e.localStorage),e.perfMetrics&&e.perfMetrics.onFirstInputDelay&&(this.onFirstInputDelay=e.perfMetrics.onFirstInputDelay),this.onLCP=rn,this.onINP=en,this.onCLS=Nt}getUrl(){return this.windowLocation.href.split("?")[0]}mark(e){this.performance&&this.performance.mark&&this.performance.mark(e)}measure(e,t,n){this.performance&&this.performance.measure&&this.performance.measure(e,t,n)}getEntriesByType(e){return this.performance&&this.performance.getEntriesByType?this.performance.getEntriesByType(e):[]}getEntriesByName(e){return this.performance&&this.performance.getEntriesByName?this.performance.getEntriesByName(e):[]}getTimeOrigin(){return this.performance&&(this.performance.timeOrigin||this.performance.timing.navigationStart)}requiredApisAvailable(){return fetch&&Promise&&"undefined"!=typeof navigator&&navigator.cookieEnabled?!!f()||(ar.info("IndexedDB is not supported by current browser"),!1):(ar.info("Firebase Performance cannot start if browser does not support fetch and Promise or cookie is disabled."),!1)}setupObserver(e,t){if(!this.PerformanceObserver)return;new this.PerformanceObserver((e=>{for(const n of e.getEntries())t(n)})).observe({entryTypes:[e]})}static getInstance(){return void 0===or&&(or=new ur(sr)),or}}function fr(){return cr}
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
function dr(e,t){const n=e.length-t.length;if(n<0||n>1)throw ir.create("invalid String merger input");const r=[];for(let n=0;n<e.length;n++)r.push(e.charAt(n)),t.length>n&&r.push(t.charAt(n));return r.join("")}
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */class pr{constructor(){this.instrumentationEnabled=!0,this.dataCollectionEnabled=!0,this.loggingEnabled=!1,this.tracesSamplingRate=1,this.networkRequestsSamplingRate=1,this.logEndPointUrl="https://firebaselogging.googleapis.com/v0cc/log?format=json_proto",this.flTransportEndpointUrl=dr("hts/frbslgigp.ogepscmv/ieo/eaylg","tp:/ieaeogn-agolai.o/1frlglgc/o"),this.transportKey=dr("AzSC8r6ReiGqFMyfvgow","Iayx0u-XT3vksVM-pIV"),this.logSource=462,this.logTraceAfterSampling=!1,this.logNetworkAfterSampling=!1,this.configTimeToLive=12,this.logMaxFlushSize=40}getFlTransportFullUrl(){return this.flTransportEndpointUrl.concat("?key=",this.transportKey)}static getInstance(){return void 0===lr&&(lr=new pr),lr}}
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */var hr;!function(e){e[e.UNKNOWN=0]="UNKNOWN",e[e.VISIBLE=1]="VISIBLE",e[e.HIDDEN=2]="HIDDEN"}(hr||(hr={}));const gr=["firebase_","google_","ga_"],mr=new RegExp("^[a-zA-Z]\\w*$");function br(){const e=ur.getInstance().navigator;return e?.serviceWorker?e.serviceWorker.controller?2:3:1}function vr(){switch(ur.getInstance().document.visibilityState){case"visible":return hr.VISIBLE;case"hidden":return hr.HIDDEN;default:return hr.UNKNOWN}}function yr(){const e=ur.getInstance().navigator.connection;switch(e&&e.effectiveType){case"slow-2g":return 1;case"2g":return 2;case"3g":return 3;case"4g":return 4;default:return 0}}
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
function _r(e){const t=e.options?.appId;if(!t)throw ir.create("no app id");return t}
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
const wr="0.0.1",Er={loggingEnabled:!0},Sr="FIREBASE_INSTALLATIONS_AUTH";function Ir(e,t){const n=function(){const e=ur.getInstance().localStorage;if(!e)return;const t=e.getItem(nr);if(!(t&&(n=t,Number(n)>Date.now())))return;var n;const r=e.getItem(tr);if(!r)return;try{return JSON.parse(r)}catch{return}}();return n?(Cr(n),Promise.resolve()):function(e,t){return function(e){const t=e.getToken();return t.then((e=>{})),t}(e.installations).then((n=>{const r=function(e){const t=e.options?.projectId;if(!t)throw ir.create("no project id");return t}(e.app),i=function(e){const t=e.options?.apiKey;if(!t)throw ir.create("no api key");return t}(e.app),a=new Request(`https://firebaseremoteconfig.googleapis.com/v1/projects/${r}/namespaces/fireperf:fetch?key=${i}`,{method:"POST",headers:{Authorization:`${Sr} ${n}`},body:JSON.stringify({app_instance_id:t,app_instance_id_token:n,app_id:_r(e.app),app_version:Jn,sdk_version:wr})});return fetch(a).then((e=>{if(e.ok)return e.json();throw ir.create("RC response not ok")}))})).catch((()=>{ar.info(Tr)}))}(e,t).then(Cr).then((e=>function(e){const t=ur.getInstance().localStorage;if(!e||!t)return;t.setItem(tr,JSON.stringify(e)),t.setItem(nr,String(Date.now()+60*pr.getInstance().configTimeToLive*60*1e3))}(e)),(()=>{}))}const Tr="Could not fetch config, will use default configs";function Cr(e){if(!e)return e;const t=pr.getInstance(),n=e.entries||{};return void 0!==n.fpr_enabled?t.loggingEnabled="true"===String(n.fpr_enabled):t.loggingEnabled=Er.loggingEnabled,n.fpr_log_source?t.logSource=Number(n.fpr_log_source):Er.logSource&&(t.logSource=Er.logSource),n.fpr_log_endpoint_url?t.logEndPointUrl=n.fpr_log_endpoint_url:Er.logEndPointUrl&&(t.logEndPointUrl=Er.logEndPointUrl),n.fpr_log_transport_key?t.transportKey=n.fpr_log_transport_key:Er.transportKey&&(t.transportKey=Er.transportKey),void 0!==n.fpr_vc_network_request_sampling_rate?t.networkRequestsSamplingRate=Number(n.fpr_vc_network_request_sampling_rate):void 0!==Er.networkRequestsSamplingRate&&(t.networkRequestsSamplingRate=Er.networkRequestsSamplingRate),void 0!==n.fpr_vc_trace_sampling_rate?t.tracesSamplingRate=Number(n.fpr_vc_trace_sampling_rate):void 0!==Er.tracesSamplingRate&&(t.tracesSamplingRate=Er.tracesSamplingRate),n.fpr_log_max_flush_size?t.logMaxFlushSize=Number(n.fpr_log_max_flush_size):Er.logMaxFlushSize&&(t.logMaxFlushSize=Er.logMaxFlushSize),t.logTraceAfterSampling=Ar(t.tracesSamplingRate),t.logNetworkAfterSampling=Ar(t.networkRequestsSamplingRate),e}function Ar(e){return Math.random()<=e}
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */let Dr,Nr=1;function kr(e){return Nr=2,Dr=Dr||function(e){return function(){const e=ur.getInstance().document;return new Promise((t=>{if(e&&"complete"!==e.readyState){const n=()=>{"complete"===e.readyState&&(e.removeEventListener("readystatechange",n),t())};e.addEventListener("readystatechange",n)}else t()}))}().then((()=>function(e){const t=e.getId();return t.then((e=>{cr=e})),t}(e.installations))).then((t=>Ir(e,t))).then((()=>Or()),(()=>Or()))}(e),Dr}function Or(){Nr=3}
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */const Mr=1e4,Lr=new TextEncoder;let Pr,Rr=3,Br=[],Fr=!1;function $r(e){setTimeout((()=>{Rr<=0||(Br.length>0&&function(){const e=Br.splice(0,1e3);(function(e){const t=pr.getInstance().getFlTransportFullUrl();return Lr.encode(e).length<=65536&&navigator.sendBeacon&&navigator.sendBeacon(t,e)?Promise.resolve():fetch(t,{method:"POST",body:e})})(Ur(e)).then((()=>{Rr=3})).catch((()=>{Br=[...e,...Br],Rr--,ar.info(`Tries left: ${Rr}.`),$r(Mr)}))}(),$r(Mr))}),e)}function Ur(e){const t=e.map((e=>({source_extension_json_proto3:e.message,event_time_ms:String(e.eventTime)}))),n={request_time_ms:String(Date.now()),client_info:{client_type:1,js_client_info:{}},log_source:pr.getInstance().logSource,log_event:t};return JSON.stringify(n)}function xr(e){return(...t)=>{!function(e){if(!e.eventTime||!e.message)throw ir.create("invalid cc log");Br=[...Br,e]}({message:e(...t),eventTime:Date.now()})}}function jr(){const e=pr.getInstance().getFlTransportFullUrl();for(;Br.length>0;){const t=Br.splice(-pr.getInstance().logMaxFlushSize),n=Ur(t);if(!navigator.sendBeacon||!navigator.sendBeacon(e,n)){Br=[...Br,...t];break}}if(Br.length>0){const t=Ur(Br);fetch(e,{method:"POST",body:t}).catch((()=>{ar.info("Failed flushing queued events.")}))}}
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */function Vr(e,t){Pr||(Pr={send:xr(qr),flush:jr}),Pr.send(e,t)}function zr(e){const t=pr.getInstance();!t.instrumentationEnabled&&e.isAuto||(t.dataCollectionEnabled||e.isAuto)&&ur.getInstance().requiredApisAvailable()&&(3===Nr?Hr(e):kr(e.performanceController).then((()=>Hr(e)),(()=>Hr(e))))}function Hr(e){if(!fr())return;const t=pr.getInstance();t.loggingEnabled&&t.logTraceAfterSampling&&Vr(e,1)}function qr(e,t){return 0===t?function(e){const t={url:e.url,http_method:e.httpMethod||0,http_response_code:200,response_payload_bytes:e.responsePayloadBytes,client_start_time_us:e.startTimeUs,time_to_response_initiated_us:e.timeToResponseInitiatedUs,time_to_response_completed_us:e.timeToResponseCompletedUs},n={application_info:Wr(e.performanceController.app),network_request_metric:t};return JSON.stringify(n)}(e):function(e){const t={name:e.name,is_auto:e.isAuto,client_start_time_us:e.startTimeUs,duration_us:e.durationUs};0!==Object.keys(e.counters).length&&(t.counters=e.counters);const n=e.getAttributes();0!==Object.keys(n).length&&(t.custom_attributes=n);const r={application_info:Wr(e.performanceController.app),trace_metric:t};return JSON.stringify(r)}(e)}function Wr(e){return{google_app_id:_r(e),app_instance_id:fr(),web_app_info:{sdk_version:Jn,page_url:ur.getInstance().getUrl(),service_worker_status:br(),visibility_state:vr(),effective_connection_type:yr()},application_process_state:0}}
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */function Jr(e,t){const n=t;if(!n||void 0===n.responseStart)return;const r=ur.getInstance().getTimeOrigin(),i=Math.floor(1e3*(n.startTime+r)),a=n.responseStart?Math.floor(1e3*(n.responseStart-n.startTime)):void 0,o=Math.floor(1e3*(n.responseEnd-n.startTime));!function(e){const t=pr.getInstance();if(!t.instrumentationEnabled)return;const n=e.url,r=t.logEndPointUrl.split("?")[0],i=t.flTransportEndpointUrl.split("?")[0];n!==r&&n!==i&&t.loggingEnabled&&t.logNetworkAfterSampling&&Vr(e,0)}({performanceController:e,url:n.name&&n.name.split("?")[0],responsePayloadBytes:n.transferSize,startTimeUs:i,timeToResponseInitiatedUs:a,timeToResponseCompletedUs:o})}
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */const Kr=["_fp",Xn,Yn,Zn,er,Qn];
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
class Gr{constructor(e,t,n=!1,r){this.performanceController=e,this.name=t,this.isAuto=n,this.state=1,this.customAttributes={},this.counters={},this.api=ur.getInstance(),this.randomId=Math.floor(1e6*Math.random()),this.isAuto||(this.traceStartMark=`FB-PERF-TRACE-START-${this.randomId}-${this.name}`,this.traceStopMark=`FB-PERF-TRACE-STOP-${this.randomId}-${this.name}`,this.traceMeasure=r||`${Kn}-${this.randomId}-${this.name}`,r&&this.calculateTraceMetrics())}start(){if(1!==this.state)throw ir.create("trace started",{traceName:this.name});this.api.mark(this.traceStartMark),this.state=2}stop(){if(2!==this.state)throw ir.create("trace stopped",{traceName:this.name});this.state=3,this.api.mark(this.traceStopMark),this.api.measure(this.traceMeasure,this.traceStartMark,this.traceStopMark),this.calculateTraceMetrics(),zr(this)}record(e,t,n){if(e<=0)throw ir.create("nonpositive trace startTime",{traceName:this.name});if(t<=0)throw ir.create("nonpositive trace duration",{traceName:this.name});if(this.durationUs=Math.floor(1e3*t),this.startTimeUs=Math.floor(1e3*e),n&&n.attributes&&(this.customAttributes={...n.attributes}),n&&n.metrics)for(const e of Object.keys(n.metrics))isNaN(Number(n.metrics[e]))||(this.counters[e]=Math.floor(Number(n.metrics[e])));zr(this)}incrementMetric(e,t=1){void 0===this.counters[e]?this.putMetric(e,t):this.putMetric(e,this.counters[e]+t)}putMetric(e,t){if(!function(e,t){return!(0===e.length||e.length>100)&&(t&&t.startsWith(Gn)&&Kr.indexOf(e)>-1||!e.startsWith("_"))}(e,this.name))throw ir.create("invalid custom metric name",{customMetricName:e});this.counters[e]=function(e){const t=Math.floor(e);return t<e&&ar.info(`Metric value should be an Integer, setting the value as : ${t}.`),t}(t??0)}getMetric(e){return this.counters[e]||0}putAttribute(e,t){const n=function(e){return!(0===e.length||e.length>40)&&(!gr.some((t=>e.startsWith(t)))&&!!e.match(mr))}(e),r=function(e){return 0!==e.length&&e.length<=100}(t);if(n&&r)this.customAttributes[e]=t;else{if(!n)throw ir.create("invalid attribute name",{attributeName:e});if(!r)throw ir.create("invalid attribute value",{attributeValue:t})}}getAttribute(e){return this.customAttributes[e]}removeAttribute(e){void 0!==this.customAttributes[e]&&delete this.customAttributes[e]}getAttributes(){return{...this.customAttributes}}setStartTime(e){this.startTimeUs=e}setDuration(e){this.durationUs=e}calculateTraceMetrics(){const e=this.api.getEntriesByName(this.traceMeasure),t=e&&e[0];t&&(this.durationUs=Math.floor(1e3*t.duration),this.startTimeUs=Math.floor(1e3*(t.startTime+this.api.getTimeOrigin())))}static createOobTrace(e,t,n,r,i){const a=ur.getInstance().getUrl();if(!a)return;const o=new Gr(e,Gn+a,!0),s=Math.floor(1e3*ur.getInstance().getTimeOrigin());o.setStartTime(s),t&&t[0]&&(o.setDuration(Math.floor(1e3*t[0].duration)),o.putMetric("domInteractive",Math.floor(1e3*t[0].domInteractive)),o.putMetric("domContentLoadedEventEnd",Math.floor(1e3*t[0].domContentLoadedEventEnd)),o.putMetric("loadEventEnd",Math.floor(1e3*t[0].loadEventEnd)));if(n){const e=n.find((e=>"first-paint"===e.name));e&&e.startTime&&o.putMetric("_fp",Math.floor(1e3*e.startTime));const t=n.find((e=>"first-contentful-paint"===e.name));t&&t.startTime&&o.putMetric(Xn,Math.floor(1e3*t.startTime)),i&&o.putMetric(Yn,Math.floor(1e3*i))}this.addWebVitalMetric(o,Zn,"lcp_element",r.lcp),this.addWebVitalMetric(o,er,"cls_largestShiftTarget",r.cls),this.addWebVitalMetric(o,Qn,"inp_interactionTarget",r.inp),zr(o),Pr&&Pr.flush()}static addWebVitalMetric(e,t,n,r){r&&(e.putMetric(t,Math.floor(1e3*r.value)),r.elementAttribution&&(r.elementAttribution.length>100?e.putAttribute(n,r.elementAttribution.substring(0,100)):e.putAttribute(n,r.elementAttribution)))}static createUserTimingTrace(e,t){zr(new Gr(e,t,!1,t))}}
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */let Xr,Yr={},Zr=!1;function Qr(e){fr()&&(setTimeout((()=>function(e){const t=ur.getInstance();"onpagehide"in window?t.document.addEventListener("pagehide",(()=>ti(e))):t.document.addEventListener("unload",(()=>ti(e)));t.document.addEventListener("visibilitychange",(()=>{"hidden"===t.document.visibilityState&&ti(e)})),t.onFirstInputDelay&&t.onFirstInputDelay((e=>{Xr=e}));t.onLCP((e=>{Yr.lcp={value:e.value,elementAttribution:e.attribution?.element}})),t.onCLS((e=>{Yr.cls={value:e.value,elementAttribution:e.attribution?.largestShiftTarget}})),t.onINP((e=>{Yr.inp={value:e.value,elementAttribution:e.attribution?.interactionTarget}}))}(e)),0),setTimeout((()=>function(e){const t=ur.getInstance(),n=t.getEntriesByType("resource");for(const t of n)Jr(e,t);t.setupObserver("resource",(t=>Jr(e,t)))}(e)),0),setTimeout((()=>function(e){const t=ur.getInstance(),n=t.getEntriesByType("measure");for(const t of n)ei(e,t);t.setupObserver("measure",(t=>ei(e,t)))}(e)),0))}function ei(e,t){const n=t.name;n.substring(0,21)!==Kn&&Gr.createUserTimingTrace(e,n)}function ti(e){if(!Zr){Zr=!0;const t=ur.getInstance(),n=t.getEntriesByType("navigation"),r=t.getEntriesByType("paint");setTimeout((()=>{Gr.createOobTrace(e,n,r,Yr,Xr)}),0)}}
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */class ni{constructor(e,t){this.app=e,this.installations=t,this.initialized=!1}_init(e){this.initialized||(void 0!==e?.dataCollectionEnabled&&(this.dataCollectionEnabled=e.dataCollectionEnabled),void 0!==e?.instrumentationEnabled&&(this.instrumentationEnabled=e.instrumentationEnabled),ur.getInstance().requiredApisAvailable()?d().then((e=>{e&&(Fr||($r(5500),Fr=!0),kr(this).then((()=>Qr(this)),(()=>Qr(this))),this.initialized=!0)})).catch((e=>{ar.info(`Environment doesn't support IndexedDB: ${e}`)})):ar.info('Firebase Performance cannot start if the browser does not support "Fetch" and "Promise", or cookies are disabled.'))}set instrumentationEnabled(e){pr.getInstance().instrumentationEnabled=e}get instrumentationEnabled(){return pr.getInstance().instrumentationEnabled}set dataCollectionEnabled(e){pr.getInstance().dataCollectionEnabled=e}get dataCollectionEnabled(){return pr.getInstance().dataCollectionEnabled}}ke(new v("performance",((e,{options:t})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("installations-internal").getImmediate();if("[DEFAULT]"!==n.name)throw ir.create("FB not default");if("undefined"==typeof window)throw ir.create("no window");!function(e){sr=e}
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */(window);const i=new ni(n,r);return i._init(t),i}),"PUBLIC")),je(qn,Wn),je(qn,Wn,"esm2020");
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
class ri{constructor(e,t){this.app=e,this._delegate=t}get instrumentationEnabled(){return this._delegate.instrumentationEnabled}set instrumentationEnabled(e){this._delegate.instrumentationEnabled=e}get dataCollectionEnabled(){return this._delegate.dataCollectionEnabled}set dataCollectionEnabled(e){this._delegate.dataCollectionEnabled=e}trace(e){return function(e,t){var n;return e=(n=e)&&n._delegate?n._delegate:n,new Gr(e,t)}(this._delegate,e)}}function ii(e){const t=e.getProvider("app-compat").getImmediate(),n=e.getProvider("performance").getImmediate();return new ri(t,n)}
/**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
var ai;(ai=it).INTERNAL.registerComponent(new v("performance-compat",ii,"PUBLIC")),ai.registerVersion("@firebase/performance-compat","0.2.27");
/**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
return it.registerVersion("firebase","12.19.0","compat-lite"),it}));
//# sourceMappingURL=firebase-performance-standalone-compat.js.map
