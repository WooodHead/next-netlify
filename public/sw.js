if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return n[e]||(s=new Promise((async s=>{if("document"in self){const n=document.createElement("script");n.src=e,document.head.appendChild(n),n.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!n[e])throw new Error(`Module ${e} didn’t register its module`);return n[e]}))},s=(s,n)=>{Promise.all(s.map(e)).then((e=>n(1===e.length?e[0]:e)))},n={require:Promise.resolve(s)};self.define=(s,r,a)=>{n[s]||(n[s]=Promise.resolve().then((()=>{let n={};const i={uri:location.origin+s.slice(1)};return Promise.all(r.map((s=>{switch(s){case"exports":return n;case"module":return i;default:return e(s)}}))).then((e=>{const s=a(...e);return n.default||(n.default=s),n}))})))}}define("./sw.js",["./workbox-21b21c9a"],(function(e){"use strict";importScripts("fallback-nUYefYRUA71-LfuyQwrOY.js","worker-nUYefYRUA71-LfuyQwrOY.js"),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/1200x630.png",revision:"1ebdbb893472ad01ad19f4029d298b33"},{url:"/17ppm.png",revision:"7d57bd982e5015ebfeb67f95a0a1de69"},{url:"/_next/static/chunks/167.80ebe78cb5f59e1cbe21.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/409.b2987d2a6f9f0a9caaef.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/471-5709aa97314262a65c8e.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/621.62cc652ef64f2d17be0a.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/963-641e565639f439ed0cdb.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/979-b028332843f08224f4e2.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/d6a9949e-a08864b25aabb0401ffe.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/eabe11fc.21f1b117605f34abd337.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/framework-cf6b0c9cfbde09c2e182.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/main-039d4eb6c1a370b950a7.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/%5Bid%5D-81c27fdc29bc19a88f58.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/%5Bid%5D/%5Btopic%5D-c2aec34bb0a37ce8d1bb.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/%5Bid%5D/message-6ade6522ea56c692341a.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/%5Bid%5D/review-4649151c8b903600ecbd.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/404-944024b465066edd4780.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/_app-3498020f1540fcf06d0b.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/_error-737a04e9a0da63c9d162.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/_offline-cbf9edee912317b319ab.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/about-6e9a98cb0e9419990b7f.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/about/privacy-dc41df1dfb572cdbe520.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/about/tos-02626dbde22a03924c0e.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/account-bd46ecc0620ef408190e.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/account/edit-c54086b3ede76e625b27.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/index-2f0e5c36ad4abd677bb8.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/phone-885cea954ace3cc8f8cf.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/pages/users-c0840659bc2ea1830312.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/polyfills-a54b4f32bdc1ef890ddd.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/chunks/webpack-2dac14fd45538a49c29f.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/css/1d971001c36dcbd74633.css",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/css/2e2da5cf7361bbe1faa2.css",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/nUYefYRUA71-LfuyQwrOY/_buildManifest.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_next/static/nUYefYRUA71-LfuyQwrOY/_ssgManifest.js",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/_offline",revision:"nUYefYRUA71-LfuyQwrOY"},{url:"/callButtonPPM.png",revision:"8b60adf3189d8c0b5d3746ae554e3bce"},{url:"/callScreen.png",revision:"04843f733f095bc66353c776a8f744c5"},{url:"/callbutton.png",revision:"ddaaeece9486205dd56de74f988ebf03"},{url:"/editor.png",revision:"8675917c8bc7610fd645f92803e9426b"},{url:"/favicon.png",revision:"673130ceb3311f9cf084967e3cdd59b4"},{url:"/favicon128.png",revision:"6e137ee965ad2a4b55cea61f6cd9655b"},{url:"/favicon512.png",revision:"02bc31038b2850d452fe6ca71673639e"},{url:"/light-on-light.png",revision:"19c45204172f7b68f3373c244c16aa66"},{url:"/manifest.json",revision:"6a7f24d93d16a52153de0616dc54a871"},{url:"/phone.png",revision:"bd1c27395395f3e402c70e1fae07039b"},{url:"/screenChat.png",revision:"afc873d14e2974fe020eb7f02856191a"},{url:"/settings.png",revision:"80dede8102961a8729298a21075cbca1"},{url:"/smallCallTest.png",revision:"3ce3b55e6b1f45d49b817dedfc9e0e0e"},{url:"/smallerUsers.png",revision:"5f6d7428ddb70eb7653a82d74308fa94"},{url:"/waitingOnCalls.png",revision:"855c955d076c35826fa26fe8154d6dca"},{url:"/with677.png",revision:"af723c09db6f912e2dda35440672206a"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:r})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s},{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600}),{handlerDidError:async({request:e})=>self.fallback(e)}]}),"GET")}));
