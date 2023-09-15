'use strict'


function createMarkupProductCard(product) {
    return `
    <div class="product-card" data-id="${product.id}">
        <div class="product-card__box-img">
            <div class="product-card__hover-box">
                <a class="product-card__button" href="#">
                    <img src="img/button-cart.svg" alt="button cart">
                    Add to Cart
                </a>
            </div>
            <img src="${product.img.src}" alt="${product.img.src}" class="product-card__img">
        </div>
        <a class="product-card__box" href="${product.href}">
            <h3 class="product-card__title">
                ${product.name}
            </h3>
            <p class="product-card__text">
                ${product.description}
            </p>
            <p class="product-card__price">
                $ ${product.price.usd}
            </p>
        </a>
    </div>`
}

async function fetchData(url) {
    const response = await fetch(url);
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Ошибка получения данных!');
    }
}

async function fillToPage() {
    const productsEl = document.querySelector('.products');
    const URL = 'data.json';

    try {
        const products = await fetchData(URL);
        products.forEach(product => {
            productsEl.insertAdjacentHTML('beforeEnd', createMarkupProductCard(product))
        })
        return true;
    } catch (error) {
        console.error(error);
        const errorEl = document.createElement('div');
        errorEl.textContent = 'Ошибка загрузки данных';
        errorEl.classList.add('error');
        productsEl.insertAdjacentElement('beforeBegin', errorEl);
        return false;
    }
}
window.addEventListener('DOMContentLoaded', () => {
    fillToPage();
});