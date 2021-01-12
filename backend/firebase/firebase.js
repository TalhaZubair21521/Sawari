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
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        return false;
    }
}