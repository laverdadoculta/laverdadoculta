var config = {
    apiKey: "AIzaSyAaf-4vaiqhH8HTRyq4zWkCFoX9x82cdsU",
    authDomain: "web-notifications-c3ca0.firebaseapp.com",
    databaseURL: "https://web-notifications-c3ca0.firebaseio.com",
    projectId: "web-notifications-c3ca0",
    storageBucket: "web-notifications-c3ca0.appspot.com",
    messagingSenderId: "543434318086"
};
var key = 'AAAAfoc1oQY:APA91bFy-X8gaE9LDc6Z68iy8EJZjNk6sdrew74T__sOv6ImnpWclif-3Z5F4K-SdCFcm6vvocVW4tzJEQULNa8FRqQkTN0xBIuJXIw0DHiZG76QgMfnzMbdOouBlZtFgC_4Tzm5khlB';
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
//
// // Эмуляция серверной части
// var button = document.getElementById('send');
// button.addEventListener('click', function () {
//
//     var notification = {
//         'title': 'this is demo push',
//         'sound' : 'default',
//         'body' : 'ЦБ не видит большой вероятности разморозки обязательных пенсионных накоплений ',
//         'click_action' : '/russia/article/472919-uvolnyat-prokurorov-nepredostavlenie-informacii',
//         'icon': 'https://russian.rt.com/static/img/logo-gray.png',
//         'image': 'https://cdni.rt.com/russian/images/2018.02/article/5a7bef60183561026f8b4567.jpg'
//     };
//
//     sendNotification(notification)
// });
// function sendNotification(notification) {
//
//     console.log('Send notification', notification);
//
//     messaging.getToken()
//         .then(function (currentToken) {
//             fetch('https://fcm.googleapis.com/fcm/send', {
//                 'method': 'POST',
//                 'headers': {
//                     'Authorization': 'key=' + key,
//                     'Content-Type': 'application/json'
//                 },
//                 'body': JSON.stringify({
//                     'notification': notification,
//                     'data': {
//                         'image': 'https://cdni.rt.com/russian/images/2018.02/article/5a7bef60183561026f8b4567.jpg'
//                     },
//                     'to': '/topics/' + topic// currentToken
//                 })
//             }).then(function (response) {
//                 console.log('response', response);
//                 return response.json();
//             }).then(function (json) {
//                 console.log('Response', json);
//             }).catch(function (error) {
//                 console.error(error);
//             });
//         })
//         .catch(function (error) {
//             console.error('Error retrieving Instance ID token.', error);
//         });
// }
//
//
//
