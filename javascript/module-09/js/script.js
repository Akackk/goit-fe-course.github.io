'use strict';

/*
  Создайте скрипт секундомера.  
  По ссылке можно посмотреть пример выбрав Stopwatch http://www.online-stopwatch.com/full-screen-stopwatch/
  
  Изначально в HTML есть разметка:
  
  <div class="stopwatch">
    <p class="time js-time">00:00.0</p>
    <button class="btn js-start">Start</button>
    <button class="btn js-take-lap">Lap</button>
    <button class="btn js-reset">Reset</button>
  </div>
  <ul class="laps js-laps"></ul>
  
  Добавьте следующий функционал:
  
  - При нажатии на кнопку button.js-start, запускается таймер, который считает время 
    со старта и до текущего момента времени, обновляя содержимое элемента p.js-time 
    новым значение времени в формате xx:xx.x (минуты:секунды.сотни_миллисекунд).
       
    🔔 Подсказка: так как необходимо отображать только сотни миллисекунд, интервал
                  достаточно повторять не чаще чем 1 раз в 100 мс.
    
  - Когда секундомер запущен, текст кнопки button.js-start меняется на 'Pause', 
    а функционал при клике превращается в оставновку секундомера без сброса 
    значений времени.
    
    🔔 Подсказка: вам понадобится буль который описывает состояние таймера активен/неактивен.
  
  - Если секундомер находится в состоянии паузы, текст на кнопке button.js-start
    меняется на 'Continue'. При следующем клике в нее, продолжается отсчет времени, 
    а текст меняется на 'Pause'. То есть если во время нажатия 'Pause' прошло 6 секунд 
    со старта, при нажатии 'Continue' 10 секунд спустя, секундомер продолжит отсчет времени 
    с 6 секунд, а не с 16. 
    
    🔔 Подсказка: сохраните время секундомера на момент паузы и используйте его 
                  при рассчете текущего времени после возобновления таймера отнимая
                  это значение от времени запуска таймера.
    
  - Если секундомер находится в активном состоянии или в состоянии паузы, кнопка 
    button.js-reset должна быть активна (на нее можно кликнуть), в противном случае
    disabled. Функционал при клике - остановка таймера и сброс всех полей в исходное состояние.
    
  - Функционал кнопки button.js-take-lap при клике - сохранение текущего времени секундомера 
    в массив и добавление в ul.js-laps нового li с сохраненным временем в формате xx:xx.x
*/

const clockface = document.querySelector(".js-time");
const startBtn = document.querySelector(".js-start");
const stopBtn = document.querySelector(".js-reset");
const lapBtn = document.querySelector(".js-take-lap");
const laps = document.querySelector(".js-laps");


const timer = {
  startTime: null,
  deltaTime: null,
  id: null,
  bool: false,
  number: 1,
  startTimer() {
    if(this.bool) return;
    stopBtn.removeAttribute('disabled');
    this.bool = true;
    this.startTime = Date.now() - this.deltaTime;
    this.id = setInterval(() => {
      const currentTime = Date.now();
      this.deltaTime = currentTime - this.startTime;
      updateClockface(clockface, this.deltaTime);
    }, 100);
  },
  startClick() {
    if(!this.bool) {
        this.startTimer();
        startBtn.textContent = 'pause';
    } else {
        this.stopTimer();
        startBtn.textContent = 'Continue';
    }
  },
  stopClick() {
    stopBtn.setAttribute('disabled', '');
    this.stopTimer();
    this.deltaTime = 0;
    this.number = 1;
    startBtn.textContent = 'start';
    updateClockface(clockface, this.deltaTime);
    laps.innerHTML = '';
  },
  stopTimer() {
    clearInterval(this.id);
    this.bool = false;
  },
  lapClick() {
    const li = document.createElement('li');
    li.textContent = `${this.number++}) ${getFormattedTime(this.deltaTime)}`;
    laps.append(li);
  }
  
};

function getFormattedTime(time) {
  let date = new Date(time);
  let min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  let sec = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  let ms = String(date.getMilliseconds());
  return `${min}:${sec}.${ms[0]}`
}

function updateClockface(elem, time) {
  elem.textContent = getFormattedTime(time);
}

startBtn.addEventListener('click', timer.startClick.bind(timer));
stopBtn.addEventListener('click', timer.stopClick.bind(timer));
lapBtn.addEventListener('click', timer.lapClick.bind(timer));
