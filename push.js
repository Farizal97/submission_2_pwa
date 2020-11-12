var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BMtOjV_CzmFD4M8QILD1WKYZLu9j0a8gKErR5hYvOTa2K55DPKRvJxpBmZLhiYMdoL8XcSTA6tFLYjHAmwsZb0w",
    "privateKey": "9uKT_IStztrg-cd9iA0cx_Nf9dieWhjAvQkl3ECpZb0"
}

webPush.setVapidDetails(
    'mailto:rizalit2@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

var pushSubscription = {
    endpoint: "https://fcm.googleapis.com/fcm/send/cB8vrKJEh2c:APA91bFUTErzjY4cQif2895OHPoyghQzup0M8UhMCWYccpV3szNPXG7YvlRxURf6hRhSZNz3osTnIRM1d3S7wQ39RCgdJq_BHOA68BSH3irceXpgrMxPpYZgAneqCEedzxlP9ZMN7c-c",
    keys: {
        p256dh: "BKZSFhh/VqifJhfS9mMPXso7QeMcIste21t+iE/ZzWdBOe6StIoNQOaXoReMR8tHjLyQwe3WbOONnhQ3QVA2VGw=",
        auth: "Jq01NvekHqVmSvyPucaHzw=="
    }
};

var payload = "Selamat! Aplikasi anda sudah dapat menerima push notifikasi";
var options = {
    gcmAPIKey: "120923807186",
    TTL: 60
};

webPush.sendNotification(pushSubscription, payload, options);