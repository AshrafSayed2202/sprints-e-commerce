const baseUrl = 'https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list';
const url = `${baseUrl}?country=us&lang=en&currentpage=0&pagesize=12&productTypes=T-shirt`;
const collectionUrl = `${baseUrl}?country=us&lang=en&currentpage=0&pagesize=30`;
const productListing = document.getElementById("T-shirts-container");
const collectionListing = document.getElementById("home-collection");
const options = {
    method: "GET",
    headers: {
        "x-rapidapi-key": "042bb0e6d0msh99500dc4f7b05b0p1fe784jsnd729b3dfb35d",
        "x-rapidapi-host": "apidojo-hm-hennes-mauritz-v1.p.rapidapi.com",
    },
};

const getProducts = async () => {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        displayProducts(data.results, productListing);
    } catch (error) {
        console.error(error);
    }
};

let collectionCards;

const getCollection = async () => {
    try {
        const response = await fetch(collectionUrl, options);
        const data = await response.json();
        displayProducts(data.results, collectionListing);
        collectionCards = document.querySelectorAll('#home-collection .product-card');
        for (let r = 3; r < collectionCards.length; r++) {
            collectionCards[r].style.display = 'none';
        }
    } catch (error) {
        console.error(error);
    }
};

const displayProducts = (products, listing) => {
    listing.innerHTML = products.map(prod => `
        <div class="product-card" onclick="window.location.href='./product/?id=${prod.articles[0].code}'" data-categ="${prod.categoryName}">
            <img src="${prod.images[0].url}" alt="${prod.name}">
            <div class="product-info">
                <span>Category: ${prod.categoryName} ${prod.rgbColors ? `<span class="prod-card-color" style="background-color:${prod.rgbColors[0]}"></span>${prod.rgbColors.length > 1 ? `+${prod.rgbColors.length}` : ""}` : ""}</span>
                <div class="card-text">
                    <h4>${prod.name}</h4>
                    <p>${prod.price.formattedValue}</p>
                </div>
            </div>
        </div>
    `).join("");
};

let currentIndexLanding = 0;
let currentIndex = 0;
const imageContainer = document.getElementById('imageContainerLanding');
const tShirtContainer = document.getElementById('T-shirts-container');

function updateButtons() {
    document.getElementById('leftButtonLanding').disabled = currentIndexLanding === 0;
    document.getElementById('rightButtonLanding').disabled = currentIndexLanding === 2;
    document.getElementById('leftButton').disabled = currentIndex === 0;
    document.getElementById('rightButton').disabled = currentIndex === 3;
}

function moveLeftLanding() {
    if (currentIndexLanding > 0) {
        currentIndexLanding--;
        updateSliderLanding(imageContainer, currentIndexLanding, 25);
    }
}

function moveRightLanding() {
    if (currentIndexLanding < 2) {
        currentIndexLanding++;
        updateSliderLanding(imageContainer, currentIndexLanding, 25);
    }
}

function moveLeft() {
    if (currentIndex > 0) {
        currentIndex--;
        updateSliderLanding(tShirtContainer, currentIndex, 25);
    }
}

function moveRight() {
    if (currentIndex < 3) {
        currentIndex++;
        updateSliderLanding(tShirtContainer, currentIndex, 25);
    }
}

function updateSliderLanding(images, index, num) {
    const offset = -index * num; // 25% width per image
    images.style.transform = `translateX(${offset}%)`;
    updateButtons();
}

document.addEventListener('DOMContentLoaded', () => {
    getProducts();
    getCollection();
    updateButtons();
});

const collectionList = document.querySelectorAll('.home-categ-filter li');
const showMoreBtn = document.getElementById('show-more')
const showMoreBtnIcon = document.querySelector('#show-more i')
showMoreBtn.addEventListener('click', () => {
    if (showMoreBtn.children[0].innerText === 'More') {
        showMoreBtn.children[0].innerText = 'Less'
        showMoreBtnIcon.classList.replace('fa-angle-down', 'fa-angle-up')
        collectionCards.forEach((card) => {
            card.style.display = 'block'
        })
    } else {
        for (let r = 3; r < collectionCards.length; r++) {
            collectionCards[r].style.display = 'none';
        }
        showMoreBtn.children[0].innerText = 'More'
        showMoreBtnIcon.classList.replace('fa-angle-up', 'fa-angle-down')
    }
})
collectionList.forEach((e) => {
    e.addEventListener('click', () => {
        collectionList.forEach((i) => {
            i.classList.remove('actv-categ');
        });
        e.classList.add('actv-categ');

        let visibleCount = 0;
        collectionCards.forEach((card) => {
            if (e.innerHTML === card.dataset.categ || e.innerHTML === '(ALL)') {
                if (visibleCount < 3) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
                if (e.innerHTML === '(ALL)') {
                    showMoreBtn.style.display = 'flex'
                } else {
                    showMoreBtn.style.display = 'none'
                }
            } else {
                card.style.display = 'none';
            }
        });
    });
});
