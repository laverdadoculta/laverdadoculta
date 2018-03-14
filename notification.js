var config = {
    apiKey: "AIzaSyANbu2tivm242tSMM9meOrDRm9N03OgIQk",
    authDomain: "la-verdad-oculta-1492430268318.firebaseapp.com",
    databaseURL: "https://la-verdad-oculta-1492430268318.firebaseio.com",
    projectId: "la-verdad-oculta-1492430268318",
    storageBucket: "la-verdad-oculta-1492430268318.appspot.com",
    messagingSenderId: "137353849542"
};
var key = 'AAAAH_rtasY:APA91bG5HAYy3RVnInFEC-2YGrP6PVnPlb-U0GVG7izJ0QZiQzaHIkoCX_FiJPv7k4Bm74S-JhcI7CWfVQuqUnOoZ9VNe6Ntx5rLxVp2rDDtCqt36bnCMV-1WoRLC043vjhOm1bC-5-w';
var topic = 'web-test-topic';

firebase.initializeApp(config);

if (window.location.protocol === 'https:' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'localStorage' in window &&
    'fetch' in window &&
    'postMessage' in window
) {
    var messaging = firebase.messaging();
    getToken();
    messaging.onMessage(function (payload) {
        Notification.requestPermission(function (permission) {
            if (permission === 'granted') {
                navigator.serviceWorker.ready.then(function (registration) {
                    var not_title = payload.notification.title;
                    var not_data = {
                        body: payload.notification.body,
                        icon: payload.notification.icon ? payload.notification.icon : 'https://russian.rt.com/static/img/logo-gray.png',
                        vibrate: [200, 100, 200, 100, 200, 100, 200],
                        click_action: payload.notification.click_action
                    };

                    if(payload.data) {
                        // not_data.badge = payload.notification.data.image ? payload.notification.data.image : '';
                        not_data.image = payload.data.image ? payload.data.image : '';
                    }

                    registration.showNotification(not_title, not_data);

                }).catch(function (error) {
                    // registration failed :(
                    console.error('ServiceWorker registration failed.', error);
                });
            }
        });
    });

} else {
    if (window.location.protocol !== 'https:') {
        console.error('Is not from HTTPS');
    } else if (!('Notification' in window)) {
        console.error('Notification not supported');
    } else if (!('serviceWorker' in navigator)) {
        console.error('ServiceWorker not supported');
    } else if (!('localStorage' in window)) {
        console.error('LocalStorage not supported');
    } else if (!('fetch' in window)) {
        console.error('fetch not supported');
    } else if (!('postMessage' in window)) {
        console.error('postMessage not supported');
    }

    console.warn('This browser does not support desktop notification.');
    console.log('Is HTTPS', window.location.protocol === 'https:');
    console.log('Support Notification', 'Notification' in window);
    console.log('Support ServiceWorker', 'serviceWorker' in navigator);
    console.log('Support LocalStorage', 'localStorage' in window);
    console.log('Support fetch', 'fetch' in window);
    console.log('Support postMessage', 'postMessage' in window);
}

// Подписываемся
function getToken() {
    // 1. Запрос разрешения у пользователя (всплывающее окно "разрешить/запретить")
    messaging.requestPermission()
        .then(function (permission) {
            console.log('permission', permission);
            // 2.1 Если пользователь разрешил, то получаем токен
            messaging.getToken()
                .then(function (token) {
                    console.log('token', token);
                    fetch('/fcm/register/' + token, {
                        'method': 'POST',
                        'Content-Type': 'application/json'
                    }).then(function (res) {
                        // Если подписка разрешена, то получим объект с данными подписки
                        console.log('/fcm/register/ responsed: ', res);
                    }).catch(function (error) {
                        console.error('Unable to get permission to notify.', error);
                    });
                });
        })
        .catch(function (error) {
            // 2.2 Если пользователь запретил подписку эта функция будет выполняться
            // при каждой загрузке страницы
            console.error('Unable to get permission to notify.', error);
        });
};
