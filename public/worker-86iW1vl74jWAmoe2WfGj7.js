(()=>{function e(e,t){return new Promise((function(n,o){const i=new MessageChannel;i.port1.onmessage=function(e){e.data.error?o(e.data.error):n(e.data)},e.postMessage(t,[i.port2])}))}console.log("sw exists"),self.addEventListener("install",(e=>{console.log("SW INSTALLED")})),self.addEventListener("push",(function(t){const n=t.data.text();if("getTokboxAPI"===n){const t="Recieving Talktree call",n={body:"click the notification to go to the accept/decline window",vibrate:[500,250,500,250,500,250,500]};self.registration.showNotification(t,n),clients.matchAll().then((function(t){t.forEach((t=>{e(t,{message:"sessionCreated"})}))}))}else"callDisconnected"===n&&clients.matchAll().then((function(t){t.forEach((t=>{e(t,{message:"callDisconnected"})}))}))})),self.addEventListener("notificationclick",(function(e){e.notification.close();let t=null;const n=clients.matchAll().then((function(e){e.forEach((e=>{if("https://dev.talktree.me/phone"!==e.url&&"https://talktree.me/phone"!==e.url||(t=e),t)return t.focus()}))}));e.waitUntil(n)}))})();