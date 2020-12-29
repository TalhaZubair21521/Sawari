const fetch = require('node-fetch');

exports.SendNotification = async (title, subTitle, fcmToken) => {
    try {
        const FETCH_URL = "https://fcm.googleapis.com/fcm/send";
        require("dotenv").config();
        const FIREBASE_APP_KEY = process.env.FIREBASE_APP_KEY;

        const message = {
            registration_ids: [fcmToken],
            notification: {
                title: title,
                body: subTitle,
                vibrate: 1,
                sound: 1,
                show_in_foreground: true,
                priority: "high",
                content_available: true,
            },
            data: { title: "Sawario", body: "You have a unread Message !!" }
        }

        let response = await fetch(FETCH_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: FIREBASE_APP_KEY, },
            body: JSON.stringify(message)
        });

        response = await response.json();
        return response;
    } catch (error) {
        console.log(error);
        return false;
    }
};

exports.CreateDynamicLink = async () => {
    try {
        const fetchURL = "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=[KEY_HERE]";
        var body = {
            "longDynamicLink": "https://example.page.link/?link=http://www.example.com/&apn=com.example.android&ibi=com.example.ios",
            "suffix": {
                "option": "SHORT"
            }
        }
        let response = await fetch(fetchURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        response = await response.json();
        return response;
    } catch (error) {
        console.log(error);
        return false;
    }
}