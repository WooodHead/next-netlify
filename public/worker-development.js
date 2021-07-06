/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
function messageToClient(client, data) {
  return new Promise(function (resolve, reject) {
    const channel = new MessageChannel();

    channel.port1.onmessage = function (event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };

    client.postMessage(data, [channel.port2]);
  });
} // self.addEventListener('install', event => {
//   console.log("SW INSTALLED")
// })


self.addEventListener('push', function (event) {
  const webPushData = event.data.text();

  if (webPushData !== 'callDisconnected') {
    /* title only works on desktop? */
    const title = webPushData === "getTokboxAPI" ? 'Talktree Call' : 'Talktree Message';
    const options = {
      body: webPushData === "getTokboxAPI" ? '' : `You received a message: ${webPushData}`,
      vibrate: [500, 250, 500, 250, 500, 250, 500]
    };
    self.registration.showNotification(title, options);
  }

  clients.matchAll().then(function (clientList) {
    clientList.forEach(client => {
      messageToClient(client, {
        message: webPushData === "callDisconnected" ? "callDisconnected" : webPushData === "getTokboxAPI" ? "sessionCreated" : webPushData
      });
    });
  });
});
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  /* too much work to get env variable in sw */

  const devAddress = 'https://dev.talktree.me/phone';
  const prodAddress = 'https://talktree.me/phone';
  let matchingClient = null;
  const promiseChain = clients.matchAll().then(function (clientList) {
    clientList.forEach(client => {
      if (devAddress === client.url || prodAddress === client.url) {
        matchingClient = client;
      }

      if (matchingClient) {
        return matchingClient.focus();
      }
    });
  });
  event.waitUntil(promiseChain);
});
self.__WB_DISABLE_DEV_LOGS = true;
/******/ })()
;