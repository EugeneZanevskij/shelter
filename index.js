const toggleBtn = document.querySelector('.header__toggle');
const nav = document.querySelector('.header__nav');
const pageOpacity = document.querySelector('.header__page-opacity');
const body = document.querySelector('body');
const ourfriendsCards = document.querySelector('.ourfriends__cards');
const sliderLeft = document.querySelector('.ourfriends__button-arrow__left');
const sliderRight = document.querySelector('.ourfriends__button-arrow__right');

toggleBtn.addEventListener("click", () => {
    toggleBtn.classList.toggle("active");
    nav.classList.toggle("active");
    pageOpacity.classList.toggle("active");
    body.classList.toggle("noscroll");
    // body {overflow: hidden;}
    nav.addEventListener("click", () => {
        toggleBtn.classList.remove("active");
        nav.classList.remove("active");
        pageOpacity.classList.remove("active");
        body.classList.remove("noscroll");
    });
});

window.addEventListener("click", (e) => {
    if (e.target !== nav && e.target !== toggleBtn) {
        if (nav.classList.contains("active")) {
            nav.classList.remove("active");
            toggleBtn.classList.remove("active");
            pageOpacity.classList.remove("active");
            body.classList.toggle("noscroll");
        }
    }
});

//Slider

let pets = [];
fetch('pets.json') // Отправка GET-запроса на файл array.json
    .then(response => response.json()) // Преобразование ответа в JSON
    .then(data => {
        // Обработка данных из файла array.json
        pets = data; // Вывод массива на консоль
        createCards();
        cardsOnClick();
})
    .catch(error => {
        console.error('Ошибка чтения файла:', error); // Вывод ошибки в консоль, если что-то пошло не так
});


var nextArr = []; // Массив nextArr для генерации случайных значений
var currArr = []; // Массив currArr, в который будут перемещаться значения
var pastArr = []; // Массив pastArr

function init() {
    generateNextArr(nextArr, currArr);
    moveToEmptyArr(nextArr, currArr);
    generateNextArr(nextArr, currArr);
    moveToEmptyArr(currArr, pastArr);
    moveToEmptyArr(nextArr, currArr);
    generateNextArr(nextArr, currArr);
}

// Генерация случайных уникальных значений и добавление их в массив nextArr
function generateNextArr(nextArr, currArr) {
    while (nextArr.length < 3) {
        let randomValue = generateRandom(8); // Генерация случайного значения от 0 до 7
        if (!(nextArr.includes(randomValue)||currArr.includes(randomValue))) { // Проверка на уникальность значения
            nextArr.push(randomValue); // Добавление уникального значения в массив
        }
    }
}

// Перемещение значений из массива в пустой массив
function moveToEmptyArr(arrFrom, arrTo) {
    while (arrFrom.length > 0) {
        var value = arrFrom.shift(); // Извлечение значения из массива nextArr
        arrTo.push(value); // Добавление значения в массив currArr
    }
}

init(); // Вызов функции init

function forward() {
    // движение справа налево
    pastArr = [];
    moveToEmptyArr(currArr, pastArr);
    moveToEmptyArr(nextArr, currArr);
    generateNextArr(nextArr, currArr);
}

function backward() {
    // движение справа налево
    [pastArr, currArr] = [currArr, pastArr];
    nextArr = [];
    generateNextArr(nextArr, currArr);
    //чтобы сделать их порядок правильным -  предыдущий массив должен быть правее (на месте next)
    [pastArr, nextArr] = [nextArr, pastArr];
}

function createCards() {
    ourfriendsCards.innerHTML ="";
    for (let index = 0; index < currArr.length; index++) {
        const pet = pets[currArr[index]];
        const card = `
        <div class="ourfriends__card card ${index===2?"hide-on-768":index===1?"hide-on-320":""}" data-num=${currArr[index]}>
            <div class="card__image">
                <img src=${pet.img} alt="Pet ${pet.name}">
            </div>
            <p class="card__name">
                ${pet.name}
            </p>
            <button class="card__button button button__secondary">
                Learn more
            </button>
        </div>
        `;
        ourfriendsCards.insertAdjacentHTML('beforeend', card);
    };
}

sliderLeft.addEventListener("click", () => {
    backward();
    createCards();
    cardsOnClick();
});
sliderRight.addEventListener("click", () => {
    forward();
    createCards();
    cardsOnClick()
});

function generateRandom(size) {
    return Math.floor(Math.random() * size);
}

//popup

let cards;

const popup = document.getElementById("popup");
const popupCont = document.querySelector(".popup__container");

function cardsOnClick() {
    cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        card.addEventListener("click", (e) => {
            const number = e.currentTarget.dataset.num;
            const pet = pets[number];
            pageOpacity.classList.toggle("active");
            popup.classList.toggle("active");
            body.classList.toggle("noscroll");
            const cardPopup = `
                <div class="popup__image" src=${pet.img} alt="Pet ${pet.name}">
                    <img src=${pet.img} alt="Pet ${pet.name}">
                </div>
                <div class="popup__content">
                    <div class="popup__primary">
                        <h3 class="popup__name">${pet.name}</h3>
                        <h4 class="popup__breed">${pet.type} - ${pet.breed}</h4>
                    </div>
                    <h5 class="popup__description">${pet.description}</h5>
                    <ul class="popup__secondary">
                        <li>
                            <h5><span class="h5-modal-window">Age:</span> ${pet.age}</h5>
                        </li>
                        <li>
                            <h5><span class="h5-modal-window">Inoculations:</span> ${pet.inoculations}</h5>
                        </li>
                        <li>
                            <h5><span class="h5-modal-window">Diseases:</span> ${pet.diseases}</h5>
                        </li>
                        <li>
                            <h5><span class="h5-modal-window">Parasites:</span> ${pet.parasites}</h5>
                        </li>
                    </ul>
                    <!-- Additional content for the popup goes here -->
                    <button class="popup__close button button__secondary" onclick="closePopup()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            popupCont.innerHTML = cardPopup;
        })
    })
}

window.addEventListener("click", (e) => {
    if (e.target === pageOpacity) {
        if (popup.classList.contains("active")) {
            closePopup();
        }
    }
});

function closePopup () {
    popup.classList.remove("active");
    pageOpacity.classList.remove("active");
    body.classList.remove("noscroll");
}

console.log("shelter. week-3\n\n\nДобавление функционала при помощи JavaScript\n\n\nРеализация burger menu на обеих страницах: (26/26)\n\n\nРеализация слайдера-карусели на странице Main: (32/36)\n\nсмена блоков происходит с соответствующей анимацией карусели (способ выполнения анимации не проверяется): (0/4)\n\n\nРеализация пагинации на странице Pets: (36/36)\n\n\nРеализация попап на обеих страницах: (11/12)\n\nокно попапа (не считая кнопку с крестиком) центрировано по всем осям, размеры элементов попапа и их расположение совпадают с макетом: (1/2)");