// Variables

const cartBtn = document.querySelector('.cart-btn'),
    closeCartBtn = document.querySelector('.cart-close'),
    clearCartBtn = document.querySelector('.cart-clear'),
    cartDOM = document.querySelector('.cart'),
    cartOverlay = document.querySelector('.cart-overlay'),
    cartQtd = document.querySelector('.cart-qtd'), //cartItems
    cartContent = document.querySelector('.cart-content'),
    cartTotal = document.querySelector('.cart-total-price'),
    productsDOM = document.querySelector('.shop-content'),
    tagFrete = document.querySelector('.frete'),
    buyButton = document.querySelector('.btn-buy');

// Cart
let cart = [];
//Buttons
let buttonsDOM = [];


// URLS
const url = '/service/loja-de-bombons.json';

// Obtendo produtos
class Products {
    async getProducts() {
        try {
            let result = await fetch(url)
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                // console.log(item);
                const name = item.name;
                const price = item.price;
                const sellingPrice = item.sellingPrice;
                const imageUrl = item.imageUrl;
                const id = item.productId;
                return { name, price, sellingPrice, imageUrl, id }
            })
            return products
        }
        catch (error) {
            console.log(error);
        }
    }
};
// Display products
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += `
                 <div class="shop-card">
                    <div class="shop-image">
                        <img src=${product.imageUrl} class="product-img" alt="">
                    </div>
                    <div class="shop-description">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="price">
                            <p class="product-discont">R$ ${product.price / 100}</p>
                            <h4 class="product-sell-price">R$ ${product.sellingPrice / 100}</h4>
                        </div>
                    </div>
                    <i class="uil uil-shopping-cart btn add-cart" data-id=${product.id}></i>
                </div>
            `
        });
        productsDOM.innerHTML = result;
    }
    getBagButtons() {
        const btnAddCart = [...document.querySelectorAll('.add-cart')];
        buttonsDOM = btnAddCart;
        btnAddCart.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.disabled = true;
            }
            button.addEventListener('click', (event) => {
                event.target.classList.remove("uil-shopping-cart");
                event.target.classList.add("uil-check-circle");
                event.target.style.color = "#ffde39";
                event.target.disabled = true;

                // obter produto de produtos
                let cartItem = { ...Storage.getProducts(id), amount: 1 };

                // adicionar produto ao carrinho
                cart = [...cart, cartItem];

                // salvar carrinho no localStorage
                Storage.saveCart(cart);

                // definir valores do carrinho
                this.setCartValues(cart);

                // adicionar item ao carrinho
                this.addCartItem(cartItem);

                // mostre o carrinho
                this.showCart();
            })
        })
    }
    setCartValues(cart) {
        let tempTotal = 0.00;
        let itemsTotal = 0.00;
        cart.map(item => {
            tempTotal += item.sellingPrice * item.amount;
            itemsTotal += item.amount;
        });

        let priceTotal = parseFloat(tempTotal / 100);
        cartTotal.innerText = priceTotal;
        cartQtd.innerText = itemsTotal;
        if (priceTotal > 10) {
            tagFrete.classList.add('activeFrete')
        } else {
            tagFrete.classList.remove('activeFrete')
        }
    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<img src="${item.imageUrl}" alt="" class="cart-product-img">
                        <div class="cart-product-description">
                            <h3 class="cart-product-title">${item.name}</h3>
                            <div class="cart-product-price">
                                <p class="cart-discount">R$ ${item.price / 100}</p>
                                <h4 class="cart-price">R$ ${item.sellingPrice / 100}</h4>
                            </div>
                        </div>
                        <div class="cart-product-qtd">
                            <i class="uil uil-angle-up" data-id="${item.id}"></i>
                            <p class="item-amount">${item.amount}</p>
                            <i class="uil uil-angle-down" data-id="${item.id}"></i>
                        </div>
                        <i class="uil uil-trash-alt cart-product-remove" data-id="${item.id}"></i>`
        cartContent.appendChild(div);
    }
    setupAPP() {
        cart = Storage.getCart();
        // console.log("Aaaaaaaaaaaa", Storage.getCart())
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
        cartOverlay.addEventListener('click', this.hideCart);
    }
    showCart() {
        cartDOM.classList.add('show-cart')
        cartOverlay.classList.add('overlay-active')
    }
    hideCart() {
        cartDOM.classList.remove('show-cart')
        cartOverlay.classList.remove('overlay-active')
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    // Botao de Finalizar compra

    cartLogic() {

        // Limpar carrinho
        clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        });
        // Funcionalidades
        cartContent.addEventListener('click', event => {
            if (event.target.classList.contains('cart-product-remove')) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement);
                this.removeItem(id)
            }
            else if (event.target.classList.contains('uil-angle-up')) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount
                // console.log(addAmount);
            }
            else if (event.target.classList.contains('uil-angle-down')) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount
                } else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        })
        // Finalizar Compra
        buyButton.addEventListener('click', () => {
            alert("Compra finalizada com sucesso. Bom apetite!")
            this.clearCart();
        });
    }
    clearCart() {
        // console.log(this);
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id))

        console.log(cartContent.children);
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0])
        };
        this.hideCart();
    }
    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        // button.innerHTML = `<i class="uil uil-ban"></i> Teste`
        button.classList.add("uil-shopping-cart");
        button.classList.remove("uil-check-circle");
        button.style.color = "#FFFFFF";
    }
    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id)
    }

};


// Local Storage 
class Storage {

    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getProducts(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    static getCart() {
        // console.log("STATIC ", localStorage.getItem('cart') );
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const ui = new UI();
    const products = new Products();
    //setup App
    ui.setupAPP();
    // Obter todos os produtos
    products
        .getProducts()
        .then(products => {
            ui.displayProducts(products)
            Storage.saveProducts(products)
        })
        .then(() => {
            ui.getBagButtons();
            ui.cartLogic();
        });
});



// // Criando a loja --------------------------------------------------------------------
// async function getItems1() {
//     let url = '/service/abaixo-10-reais.json';
//     try {
//         let res = await fetch(url);
//         return await res.json();
//     } catch (error) {
//         console.log(error);
//     }
// }

// async function getItems2() {
//     let url = '/service/acima-10-reais.json';
//     try {
//         let res = await fetch(url);
//         return await res.json();
//     } catch (error) {
//         console.log(error);
//     }
// }

// function renderItems() {
//     // Limpeza da div de itens
//     // document.getElementById('shopContentItens').innerHTML = "";

//     //Renderizacao de itens 1
//     getItems1().then(function (response) {
//         response.items.forEach(function (value, index) {
//             document.getElementById('shopContentItens').innerHTML += componentItem(value);
//         });
//     });

//     //Renderizacao de itens 2
//     getItems2().then(function (response) {
//         response.items.forEach(function (value, index) {
//             document.getElementById('shopContentItens').innerHTML += componentItem(value);
//         });
//     });
// }

// function componentItem(item) {
//     return `    
//             <div class="shop-card">
//                 <div class="shop-image">
//                     <img class="product-img" src="${item.imageUrl}" alt="">
//                 </div>
//                 <div class="shop-description">
//                     <h3 class="product-title">${item.name}</h3>
//                     <div class="price">
//                         <p>R$ ${item.price / 100}</p>
//                          <h4 class="product-sell-price">R$ ${item.sellingPrice / 100}</h4>
//                     </div>
//                     <i class="btn add-cart uil uil-shopping-cart"></i>
//                 </div>
//             </div>
//             `;
// }

// renderItems();

