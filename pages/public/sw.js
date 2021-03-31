self.addEventListener('install', event => {
  console.log('sw install: ', event)
  // event.waitUntil(
  //   caches.open('newCache1').then(function (cache) {
  //     return cache.addAll([
  //       '/static/js/bundle.js'
  //     ])
  //   })
  // )
})

// self.clients.matchAll(async (client) => console.log(client))

function messageToClient(client, data) {
  return new Promise(function (resolve, reject) {
    const channel = new MessageChannel()
    channel.port1.onmessage = function (event) {
      if (event.data.error) {
        reject(event.data.error)
      } else {
        resolve(event.data)
      }
    }
    client.postMessage(data, [channel.port2])
  })
}

self.addEventListener('push', function (event) {
  const webPushData = event.data.text()
  if (webPushData === 'getTokboxAPI') {
    /* title only works on desktop? */
    const title = 'Recieving Talktree call'
    const options = {
      body: 'click the notification to go to the accept/decline window',
      vibrate: [500, 250, 500, 250, 500, 250, 500]
    };
    self.registration.showNotification(title, options)

    clients.matchAll().then(function (clientList) {
      clientList.forEach((client) => {
        messageToClient(client, { message: "sessionCreated" })
      })
    })
  } else if (webPushData === 'callDisconnected') {
    clients.matchAll().then(function (clientList) {
      clientList.forEach((client) => {
        messageToClient(client, { message: "callDisconnected" })
      })
    })
  }
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  /* too much work to get env variable in sw */
  const devAddress = 'https://dev.talktree.me/phone'
  const prodAddress = 'https://talktree.me/phone'
  let matchingClient = null
  const promiseChain = clients.matchAll().then(function (clientList) {
    clientList.forEach((client) => {
      if ((devAddress === client.url) || (prodAddress === client.url)) {
        matchingClient = client
      }
      if (matchingClient) {
        return matchingClient.focus()
      }
    })
  })
  event.waitUntil(promiseChain)
})