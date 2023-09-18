'use strict'

function createMarkupProductCard(product) {
    return `
    <div class="product-card" data-id="${product.id}">
        <div class="product-card__box-img">
            <div class="product-card__hover-box">
                <a class="product-card__button" href="#!">
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

function createMarkupProductInCart(product) {
    return `
    <section class="product-in-cart" data-id=${product.id}>
                <a href="${product.href}" class="product-in-cart__link-img">
                    <img src="${product.img.src}" alt="${product.img.alt}" class="product-in-cart__img">
                </a>
                <div class="product-in-cart__description">
                    <button class="btn-close product-in-cart__btn-close">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M11.2453 9L17.5302 2.71516C17.8285 2.41741 17.9962 2.01336 17.9966 1.59191C17.997 1.17045 17.8299 0.76611 17.5322 0.467832C17.2344 0.169555 16.8304 0.00177586 16.4089 0.00140366C15.9875 0.00103146 15.5831 0.168097 15.2848 0.465848L9 6.75069L2.71516 0.465848C2.41688 0.167571 2.01233 0 1.5905 0C1.16868 0 0.764125 0.167571 0.465848 0.465848C0.167571 0.764125 0 1.16868 0 1.5905C0 2.01233 0.167571 2.41688 0.465848 2.71516L6.75069 9L0.465848 15.2848C0.167571 15.5831 0 15.9877 0 16.4095C0 16.8313 0.167571 17.2359 0.465848 17.5342C0.764125 17.8324 1.16868 18 1.5905 18C2.01233 18 2.41688 17.8324 2.71516 17.5342L9 11.2493L15.2848 17.5342C15.5831 17.8324 15.9877 18 16.4095 18C16.8313 18 17.2359 17.8324 17.5342 17.5342C17.8324 17.2359 18 16.8313 18 16.4095C18 15.9877 17.8324 15.5831 17.5342 15.2848L11.2453 9Z"
                                fill="#575757" />
                        </svg>
                    </button>
                    <h3 class="product-in-cart__heading">${product.name}</h3>
                    <p class="product-in-cart__option">
                        Price:
                        <span class="product-in-cart__selected-option product-in-cart__price ">$ ${product.price.usd * product.count}</span>
                    </p>
                    <p class="product-in-cart__option">
                        Color:
                        <span class="product-in-cart__selected-option product-in-cart__color">${product.options.color}</span>
                    </p>
                    <p class="product-in-cart__option">
                        Size:
                        <span class="product-in-cart__selected-option product-in-cart__size">${product.options.size}</span>
                    </p>
                    <p class="product-in-cart__option">
                        Quantity:
                        <input type="number" min="1" max="10" value="${product?.count || 0}"
                            class="product-in-cart__quantity product-in-cart__selected-option">
                    </p>
                </div>
            </section>`
}

async function fetchData(url) {
    const response = await fetch(url);
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Ошибка получения данных!');
    }
}

async function fillProductsToPage() {
    const productsEl = document.querySelector('.products');
    const URL = 'data.json';

    try {
        const products = await fetchData(URL);
        products.forEach(product => {
            allProducts.push(product);
            productsEl.insertAdjacentHTML('beforeEnd', createMarkupProductCard(product));
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


function fillProductsToCart() {
    const productsInCartEl = document.querySelector('.product-in-cart-grid-box');
    const cart = getCartFromStorage();
    cart.forEach(product => {
        const productEl = productsInCartEl.querySelector(`.product-in-cart[data-id="${product.id}"`);
        if (product.count) {
            if (!productEl) {
                productsInCartEl.insertAdjacentHTML('afterBegin', createMarkupProductInCart(product));
            } else {
                productEl.querySelector('.product-in-cart__quantity').value = product.count;
            }
        }
    })
}


function getCartFromStorage() {
    return JSON.parse(localStorage.getItem('cart'));
}


function getProductById(id) {
    const cart = getCartFromStorage();
    return cart.find(product => product.id == id);
}

function getCountCart() {
    const cart = getCartFromStorage();
    if (cart) {
        return cart.reduce((acc, product) => acc + Number(product.count), 0);
    }
    return 0;
}

function getTotalSumCart(currency = 'usd') {
    const cart = getCartFromStorage();
    if (cart) {
        return cart.reduce((acc, product) => acc + (Number(product.count) * product.price[currency]), 0);
    }
    return 0;
}

function addToCart(product) {
    let cart = getCartFromStorage();
    if (!cart) {
        cart = [];
    }
    const productInCart = cart.find(el => el.id == product.id);

    if (productInCart) {
        productInCart.count++;

    } else {
        if (!product.count) {
            product.count = 1;
        }
        cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart))
}

function removeFromCart(productId) {
    const product = getProductById(productId);
    if (product) {
        const cart = getCartFromStorage();
        const cartIds = cart.map(el => el.id);
        const index = cartIds.indexOf(Number(productId));
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        return true;
    } else {
        return false;
    }

}

function clearCart() {
    localStorage.clear();
    if (document.location.pathname === '/cart.html') {
        document.querySelectorAll('.product-in-cart').forEach(el => el.remove());
    }
    changeTotalSum();
    changeIconCountCart();
}

function changeProductCountInCart(productId, count) {
    const cart = getCartFromStorage();
    const product = cart.find(el => el.id == productId);
    if (count) {
        product.count = Number(count);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}


function changeIconCountCart() {
    const countProductInCartIconEls = document.querySelectorAll('.header__cart-text');
    countProductInCartIconEls.forEach(icon => {
        icon.textContent = getCountCart();
        if (icon.textContent == 0) {
            icon.style.display = 'none';
        }
    })
}

function changeTotalSum() {
    if (document.location.pathname === '/cart.html') {
        const subTotalEl = document.querySelector('.order__subtotal-price');
        const totalEl = document.querySelector('.order__grandtotal-price');
        subTotalEl.textContent = `$ ${getTotalSumCart()}`;
        totalEl.textContent = `$ ${getTotalSumCart()}`;
    }

}

const allProducts = [];

window.addEventListener('DOMContentLoaded', () => {
    changeIconCountCart();
    changeTotalSum();

    if (document.location.pathname === '/') {
        fillProductsToPage();

        const productsEl = document.querySelector('.products');
        productsEl.addEventListener('click', (e) => {
            if (e.target.className === 'product-card__button') {
                const targetId = e.target.closest('.product-card').dataset.id;
                const product = allProducts.find(({ id }) => id == targetId);
                addToCart(product);
                changeTotalSum();
                changeIconCountCart();
            }
        })
    }



    if (document.location.pathname === '/cart.html') {
        const cartBoxEl = document.querySelector('.product-in-cart-grid-box');
        const clearButtonEl = document.querySelector('.btn-clear-cart');

        if (localStorage.getItem('cart')) {
            fillProductsToCart();
            changeTotalSum();
            changeIconCountCart();
        }

        clearButtonEl.addEventListener('click', clearCart);
        cartBoxEl.addEventListener('click', (e) => {
            if (e.target.closest('.btn-close')) {
                const product = e.target.closest('.product-in-cart');
                product.remove();
                removeFromCart(product.dataset.id);
                changeTotalSum();
                changeIconCountCart();
            }
        })
        cartBoxEl.addEventListener('change', (e) => {
            if (e.target.classList.contains('product-in-cart__quantity')) {
                const count = e.target.value;
                const productEl = e.target.closest('.product-in-cart');
                const productId = productEl.dataset.id;

                if (count == 0) {
                    removeFromCart(productId);
                    productEl.remove();
                } else {
                    changeProductCountInCart(productId, count);
                    const productInCart = getProductById(productId);
                    productEl.querySelector('.product-in-cart__price')
                        .innerHTML = `$ ${productInCart.count * productInCart.price.usd}`;
                }
                changeTotalSum();
                changeIconCountCart();
            }
        })
    }

    window.addEventListener('storage', () => {
        if (document.location.pathname === '/cart.html') {
            fillProductsToCart();
        }
    })
});