importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '137353849542'
});

var messaging = firebase.messaging();


self.addEventListener('notificationclick', function(event) {
    const target = (event.notification.data.click_action || '/');
    event.notification.close();
    event.waitUntil(clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then(function(clientList) {
        // clientList always is empty?!
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == target && 'focus' in client) {
                return client.focus();
            }
        }

        return clients.openWindow(target);
    }));
});

self.addEventListener('push', function(event) {
    var json_data = JSON.parse(event.data.text());
    console.log('[Service Worker] Push JSON:', json_data, self.registration, event);
    var not_title = json_data.notification.title;
    var not_data = {
        body: json_data.notification.body.length > 100 ? json_data.notification.body.substr(0, 97) + '...' : json_data.notification.body,
        icon: 'https://russian.rt.com/static/img/logo-gray.png',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        click_action: json_data.notification.click_action
    };

    if (json_data.data) {
        // not_data.badge = payload.notification.data.image ? payload.notification.data.image : '';
        not_data.image = json_data.data.image ? json_data.data.image : '';
    }

    // self.registration.showNotification(not_title, not_data);
});

messaging.setBackgroundMessageHandler((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ');
    return null;
});