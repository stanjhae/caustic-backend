const { Expo } = require('expo-server-sdk');

exports.pushNotification = (pushToken, message) => {
  if (!pushToken) return;
  const expo = new Expo();
  const messages = [];

  messages.push({
    to: pushToken,
    sound: 'default',
    body: message,
    data: { message },
  });

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  (async () => {
    chunks.forEach(async (chunk) => {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    });
  })();
};
