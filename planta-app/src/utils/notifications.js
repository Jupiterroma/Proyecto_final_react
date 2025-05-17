// utils/notifications.js
import * as Notifications from 'expo-notifications';

export async function scheduleWaterReminder(plantId, seconds, plantName) {
  console.log(`⏱️ Scheduling water reminder in ${seconds}s for plant ${plantName}`);
  // cancela previo
  await Notifications.cancelScheduledNotificationAsync(plantId);
  // schedule
  await Notifications.scheduleNotificationAsync({
    identifier: plantId,
    content: {
      title: `💧 Riega tu ${plantName}`,
      body: `¡Tu planta lleva ${Math.round(seconds/60)} min sin riego!`,
      data: { plantId },
    },
    trigger: { seconds, repeats: false },
  });
}
