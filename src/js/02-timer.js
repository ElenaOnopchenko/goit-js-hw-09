import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inputTime = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const daysTime = document.querySelector('span[data-days]');
const hoursTime = document.querySelector('span[data-hours]');
const minutesTime = document.querySelector('span[data-minutes]');
const secondsTime = document.querySelector('span[data-seconds]');

let start = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      startBtn.disabled = true;
      return Notify.failure('Please choose a date in the future');
    }
    startBtn.disabled = false;

    const timer = () => {
      start = setInterval(() => {
        startBtn.disabled = true;

        const startTime = new Date();
        let deltaTime = selectedDates[0] - startTime;
        const { days, hours, minutes, seconds } = convertMs(deltaTime);

        daysTime.textContent = `${days}`;
        hoursTime.textContent = `${hours}`;
        minutesTime.textContent = `${minutes}`;
        secondsTime.textContent = `${seconds}`;

        inputTime.disabled = true;

        if (deltaTime < 1000) {
          clearInterval(start);
          return Notify.success('Time is over!');
        }
      }, 1000);
    };
    startBtn.addEventListener('click', timer);
  },
};

flatpickr(inputTime, options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}
