const toggleBtn = document.querySelector('.header__toggle');
const nav = document.querySelector('.header__nav');
const pageOpacity = document.querySelector('.header__page-opacity');
const body = document.querySelector('body');
const petsCards = document.querySelector('.pets__cards');
const prevBtn = document.getElementById('prevBtn');
const currentBtn = document.getElementById('currentBtn');
const nextBtn = document.getElementById('nextBtn');
const firstPageBtn = document.getElementById('firstPageBtn');
const lastPageBtn = document.getElementById('lastPageBtn');

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

let pets = [];
fetch('pets.json') // Отправка GET-запроса на файл array.json
    .then(response => response.json()) // Преобразование ответа в JSON
    .then(data => {
        // Обработка данных из файла array.json
        pets = data; // Вывод массива на консоль
        createPageArr();
        checkSize();
})
    .catch(error => {
        console.error('Ошибка чтения файла:', error); // Вывод ошибки в консоль, если что-то пошло не так
});


//pagination

let pageArr = [];

function createPageArr() {
    let arr = generateArr(pets);
    pageArr = [...arr];
    for (let i = 0; i<5; i++) {
        pageArr = [...pageArr,...updateArray(arr)];
    }
}

function generateArr(pets) {
    let arr = [];
    while (arr.length < pets.length) {
        let randomValue = generateRandom(pets.length);
        if (!arr.includes(randomValue)) { // Проверка на уникальность значения
            arr.push(randomValue); // Добавление уникального значения в массив
        }
    }
    return arr;
}

function generateRandom(size) {
    return Math.floor(Math.random() * size);
}

function updateArray(arr) {  
    const arr1 = shuffleArray(arr.slice(0, 3));
    const arr2 = shuffleArray(arr.slice(3, 6));
    const arr3 = shuffleArray(arr.slice(6, 8));
    arr = [...arr1, ...arr2, ...arr3];
    return arr;
}

// Fisher-Yates shuffle algorithm
function shuffleArray(arr) {
    let lastIndex = arr.length - 1;
    for (let current = lastIndex; current > 0; current--) {
        const random = generateRandom(current + 1);
        [arr[current], arr[random]] = [arr[random], arr[current]];
    }
    return arr;
}

function createPetsCards() {
    petsCards.innerHTML ="";
    let index = size*(currentNumber - 1);
    let lastIndex = size*currentNumber-1;
    for (index; index <= lastIndex; index++) {
        const pet = pets[pageArr[index]];
        const card = `
            <div class="pets__card card" data-number=${pageArr[index]}>
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
        petsCards.insertAdjacentHTML('beforeend', card);
    };
}

let currentNumber = 1;

function updateNumber() {
    currentBtn.textContent = currentNumber.toString();
    createPetsCards();
    cardsOnClick();

    if (currentNumber === 1) {
        prevBtn.setAttribute('disabled', '');
        firstPageBtn.setAttribute('disabled', '');
    } else if (currentNumber === numberPages) {
        nextBtn.setAttribute('disabled', '');
        lastPageBtn.setAttribute('disabled', '');
    }
    else {
        prevBtn.removeAttribute('disabled');
        firstPageBtn.removeAttribute('disabled');
        nextBtn.removeAttribute('disabled');
        lastPageBtn.removeAttribute('disabled');
    }
}

// Event listener for previous button click
prevBtn.addEventListener('click', () => {
    if (currentNumber > 1) {
        currentNumber--;
        updateNumber();
    }
});

// Event listener for next button click
nextBtn.addEventListener('click', () => {
    if (currentNumber < numberPages) {
        currentNumber++;
        updateNumber();
    }
});

firstPageBtn.addEventListener('click', () => {
    currentNumber = 1;
    updateNumber();
    nextBtn.removeAttribute('disabled');
    lastPageBtn.removeAttribute('disabled');
});

lastPageBtn.addEventListener('click', () => {
    currentNumber = numberPages;
    updateNumber();
    prevBtn.removeAttribute('disabled');
    firstPageBtn.removeAttribute('disabled');
});

//ресайз формирует значение сайз
//сайз умножаем на намбер
//от size*(number-1) до size*number-1
let size;
let numberPages;

window.addEventListener("resize", checkSize);

function checkSize() {
    // Get the window width
    let newSize;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (windowWidth<=320) {
        newSize = 3;
    } else if (windowWidth<=768) {
        newSize = 6;
    } else {
        newSize = 8;
    }
    if (size!==newSize) {
        size=newSize;
        numberPages = pageArr.length/size;
        if (currentNumber>numberPages) currentNumber=numberPages;
        updateNumber();
    }
}

let cards;

const popup = document.getElementById("popup");
const popupCont = document.querySelector(".popup__container");

function cardsOnClick() {
    cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        card.addEventListener("click", (e) => {
            const number = e.currentTarget.dataset.number;
            const pet = pets[number];
            pageOpacity.classList.toggle("active");
            popup.classList.toggle("active");
            body.classList.toggle("noscroll");
            const card = `
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
            popupCont.innerHTML = card;
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