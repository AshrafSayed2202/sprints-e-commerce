const productListing = document.getElementById("T-shirts-container");
const collectionListing = document.getElementById("home-collection");

const getProducts = async () => {
    try {
        const products = await new Promise((resolve, reject) => {
            const storedProducts = localStorage.getItem('products');
            if (storedProducts) {
                resolve(JSON.parse(storedProducts));
            } else {
                reject('No products found in localStorage');
            }
        });

        displayProducts(products, productListing);
    } catch (error) {
        console.error(error);
    }
};

let collectionCards;

const getCollection = async () => {
    try {
        const collectionData = await new Promise((resolve, reject) => {
            const storedCollection = localStorage.getItem('products');
            if (storedCollection) {
                try {
                    const parsedData = JSON.parse(storedCollection);
                    if (parsedData && Array.isArray(parsedData)) {
                        resolve(parsedData);
                    } else {
                        reject('No results array found in stored collection data');
                    }
                } catch (error) {
                    reject('Error parsing stored collection data');
                }
            } else {
                reject('No collection found in localStorage');
            }
        });
        displayProducts(collectionData, collectionListing);
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
        <div class="product-card" onclick="window.location.href='./product/?id=${prod.id}'" data-categ="${prod.category}">
            <img src="/assets/images/one.jfif" alt="${prod.name}" class="product-image">
            <div class="product-info">
                <span>Category: ${prod.category} ${prod.colors ? `<span class="prod-card-color" style="background-color:${prod.colors[0]}"></span>${prod.colors.length > 1 ? `+${prod.colors.length}` : ""}` : ""}</span>
                <div class="card-text">
                    <h4>${prod.name}</h4>
                    <p>${prod.price}$</p>
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
