const cacheName = "showMeTheMoneyV12";
var urlToCache = [
    './build/main.js',
    './build/main.css',
    './build/polyfills.js',
    'index.html',
    'manifest.json'
  ];

const baseUrl ="https://smtm-server-side.herokuapp.com/api/";  
//const baseUrl ="http://localhost:8080/api/";  

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(urlToCache);
    })
  );
});


self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!cacheName.includes(key)) {
          return caches.delete(key);
        }
      })
    )).then(() => {
      console.log('V2 now ready to handle fetches!');
    })
  );
});

var ignoreRequests = "\/smtm\/";

self.addEventListener('fetch', function(event) {
  if (event.request.method != 'GET') return;

  if (event.request.url.match(ignoreRequests)) {
    // // request will be networked
    // event.respondWith(
    //   caches.open(cacheName).then(function(cache) {
    //     return cache.match(event.request).then(function(response) {
    //       var fetchPromise = fetch(event.request).then(function(networkResponse) {
    //         cache.put(event.request, networkResponse.clone());
    //         return networkResponse;
    //       })
    //       return response || fetchPromise;
    //     })
    //   }));
    //   return;
    event.respondWith(desdeCache(event.request.clone()));
    event.waitUntil(update(event.request.clone()));
  }else{
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          }
          var fetchRequest = event.request.clone();
  
          return fetch(fetchRequest).then(
            function(response) {
              if(!response || response.status !== 200) {
                return response;
              }
              var responseToCache = response.clone();
              caches.open(cacheName)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  }
  
  // event.respondWith(desdeCache(event.request.clone()));
  // event.waitUntil(update(event.request.clone()));
});

function desdeCache(request) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  return caches.open(cacheName).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}



// -------------------------------------------------------
// push
// -------------------------------------------------------
// https://github.com/web-push-libs/web-push
self.addEventListener('push', event => {
  var body = JSON.parse(event.data.text());
  //console.log(`Push received and had this data: "${event.data.text()}"`);
  var title = '';
  var _body="";
  if(body){
    title=body.notification.title;
    _body=body.notification.body;
  }
  
  const options = {
    body: _body,
    icon: 'assets/icon/ic_launcher.png',
    badge: 'assets/icon/ic_launcher.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  console.log('Notification click Received.');

  event.notification.close();
  event.waitUntil(clients.openWindow('https://smtm-b6f56.firebaseapp.com'));
});


self.importScripts('assets/js/idb-keyval-min.js');

self.addEventListener('sync', event => {
  if (event.tag === 'gasto-pwa') {
    event.waitUntil(getMessagesFromOutbox()
      .then(messages => Promise.all(mapAndSendMessages(messages)))
      .catch(err => console.log('ocurrio un error al enviar el mensaje', err))
      .then(response => removeMessagesFromOutBox(response)).then(res=>{
        if(res){
          const title = 'Gastos enviados';
          const options = {
            body: 'Los Gastos fueron sincronizados',
            icon: 'assets/icon/ic_launcher.png',
            badge: 'assets/icon/ic_launcher.png'
          };
        
          event.waitUntil(self.registration.showNotification(title, options));
        }
      })
    );
  }
});


function getMessagesFromOutbox() {
  const key = 'gastos-sync';
  return idbKeyval.get(key).then(values => {
    values = values || '[]';
    const messages = JSON.parse(values) || [];
    return messages;
  });
}

function mapAndSendMessages(messages) {
  return messages.map(
    message => sendMessage(message)
      .then(response => response.json())
      .catch(err => swLog('server unable to handle the message', message, err))
  );
}

function sendMessage(message) {
  const headers = {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '+message.token,
    'Access-Control-Allow-Origin':'*'
  };
  const msg = {
    method: 'POST',
    body: JSON.stringify(message.gasto),
    headers: headers
  };
  return fetch(baseUrl+'smtm/addGasto', msg).then((response) => {
    //console.log('message sent!', message);

    return response;
  });
}

function removeMessagesFromOutBox(response) {
  // If the first worked,let's assume for now they all did
  if (response && response.length && response[0]) {
    return idbKeyval.clear()
      .then(() => Promise.resolve(true) )
      .catch(err => console.log('unable to remove messages from outbox', err));
  }else{
    return Promise.resolve(false);
  }
  
}