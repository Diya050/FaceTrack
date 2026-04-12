export type NotificationSound = "chime" | "ping" | "ding" | "beep" | "none";

const SOUND_FILE_PATHS: Record<Exclude<NotificationSound, "none">, string> = {
  chime: "/sounds/chime.mp3",
  ping: "/sounds/ping.mp3",
  ding: "/sounds/ding.mp3",
  beep: "/sounds/beep.mp3",
};

export const playNotificationSound = async (
  sound: NotificationSound,
  volumePercent = 60
) => {
  if (sound === "none") {
    return;
  }

  const normalizedVolume = Math.min(1, Math.max(0.05, volumePercent / 100));

  const audio = new Audio(SOUND_FILE_PATHS[sound]);
  audio.volume = normalizedVolume;
  audio.preload = "auto";
  await audio.play();
};

export const isNotificationQuietHours = (
  enabled: boolean,
  start: string,
  end: string,
  now = new Date()
) => {
  if (!enabled || !start || !end) {
    return false;
  }

  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  if (startMinutes === endMinutes) {
    return true;
  }

  if (startMinutes < endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
};
