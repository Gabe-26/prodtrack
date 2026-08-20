self.addEventListener('push', event => {
  let data = {};
  try{ data = event.data ? event.data.json() : {}; }
  catch(e){ data = {title:'ProdTrack', body: event.data ? event.data.text() : 'New photo uploaded'}; }
  const title = data.title || 'ProdTrack';
  const options = {
    body: data.body || 'A new photo was uploaded.',
    icon: data.icon || undefined,
    badge: data.badge || undefined,
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(windowClients => {
      for(const client of windowClients){
        if('focus' in client) return client.focus();
      }
      if(clients.openWindow) return clients.openWindow(url);
    })
  );
});
