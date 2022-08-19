/**
 * Adds two times in format HH:MM
 * @param {string} [time1] - time in format HH:MM:SS or simple MM
 * @param {string} [time2] - time in format HH:MM:SS or simple MM
 */
export const addTime = (time1: string, time2: string) => {
  const [seconds1, minutes1, hour1] = time1.split(':').reverse();
  const [seconds2, minutes2, hour2] = time2.split(':').reverse();

  let seconds = Number(seconds1) + Number(seconds2);
  let minutes = Number(minutes1) + Number(minutes2);
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
