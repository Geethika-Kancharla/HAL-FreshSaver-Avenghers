importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

const firebaseConfig = {
    apiKey: "AIzaSyAmOnGufVnQyeXTg8D9HtuDSwzII1XkWjA",
    authDomain: "freshsaver-b617d.firebaseapp.com",
    projectId: "freshsaver-b617d",
    storageBucket: "freshsaver-b617d.appspot.com",
    messagingSenderId: "827219542944",
    appId: "1:827219542944:web:c2b8ec8f383c50eb6e9ac5"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        "[firebase-messaging-switch.js] Received background message", payload
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image,
    };

    self.ServiceWorkerRegistration.showNotification(notificationTitle, notificationOptions);
});