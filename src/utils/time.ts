/**
 * Adds two times in format HH:MM
 * @param {string} [time1] - time in format HH:MM:SS or simple MM
 * @param {string} [time2] - time in format HH:MM:SS or simple MM
 */
export const addTime = (time1: string, time2: string) => {
  const [hour1, minutes1, seconds1] = time1.split(':');
  const [hour2, minutes2, seconds2] = time2.split(':');

  let seconds = Number(seconds1 || 0) + Number(seconds2 || 0);
  let minutes = Number(minutes1 || 0) + Number(minutes2 || 0);
  let hours = Number(hour1 || 0) + Number(hour2 || 0);

  if (seconds >= 60) {
    seconds -= 60;
    minutes += 1;
  }

  if (minutes >= 60) {
    minutes -= 60;
    hours += 1;
  }

  return [String(hours).padStart(2, '0'), String(minutes).padStart(2, '0'), String(seconds).padStart(2, '0')].join(':');
};

/**
 * Return a value of minutes in time format HH:MM:SS
 * @param {string} [minutes] - integer number of minutes
 */
export const minutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const leastMinutes = minutes % 60;
  return [String(hours).padStart(2, '0'), String(leastMinutes).padStart(2, '0'), '00'].join(':');
};

/**
 * Get the integer number of minutes from a given time in format HH:MM:SS
 * @param {string} [time] - integer number of minutes
 */
export const timeToMinutes = (time: string) => {
  const [hour, minutes] = time.split(':');
  return Number(hour) * 60 + Number(minutes);
};

/**
 * Return duration between two times in format HH:MM
 * @param {string} [time1] - time in format HH:MM:SS or simple MM
 * @param {string} [time2] - time in format HH:MM:SS or simple MM
 */
export const getDuration = (time1: string, time2: string) => {
  const [hour1, minutes1, seconds1] = time1.split(':');
  const [hour2, minutes2, seconds2] = time2.split(':');

  let seconds = Number(seconds2 || 0) - Number(seconds1 || 0);
  let minutes = Number(minutes2 || 0) - Number(minutes1 || 0);
  let hours = Number(hour2 || 0) - Number(hour1 || 0);

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }

  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }

  return [String(hours).padStart(2, '0'), String(minutes).padStart(2, '0'), String(seconds).padStart(2, '0')].join(':');
};
