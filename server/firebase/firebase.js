const fetch = require('node-fetch');
require("dotenv").config();

exports.SendNotification = async (title, subTitle, fcmToken) => {
    const message = {
        to: fcmToken,
        notification: {
            title: title,
            body: subTitle,
            vibrate: 1,
            sound: "default",
            show_in_foreground: true,
            priority: "high",
            content_available: true,
        },
        data: {
            title: "Innua Notification",
            body: "Congrats",
        }
    }
    let response = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "key=AAAA7TfmKFw:APA91bHxSeG85hCGiqliQy7W6egLw4_g4XGGXAvhyhxuPgqc8hQZ7DH3ATU1M6w1MPmBkEWrMupUiXe-4RWPbzp7l6CYxHcYzFEhXrt-bhwINuf28Vzoxd2EkaRgzPahkjVhRH_PUTDC",
        },
        body: JSON.stringify(message)
    })
    response = await response.json();
    console.log(response);
    return response;
}