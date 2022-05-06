
// Criando a loja --------------------------------------------------------------------
async function getItems1() {
    let url = '/data/abaixo-10-reais.json';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function getItems2() {
    let url = '/data/acima-10-reais.json';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

function renderItems() {
    // Limpeza da div de itens
    document.getElementById('shopContentItens').innerHTML = "";

    //Renderizacao de itens 1
    getItems1().then(function (response) {
        response.items.forEach(function (value, index) {
            document.getElementById('shopContentItens').innerHTML += componentItem(value);
        });
    });

    //Renderizacao de itens 2
    getItems2().then(function (response) {
        response.items.forEach(function (value, index) {
            document.getElementById('shopContentItens').innerHTML += componentItem(value);
        });
    });
}

function componentItem(item) {
    return `    <div class="shop-card">
                    <div class="shop-image">
                        <img class="product-img" src="${item.imageUrl}" alt="">
                    </div>
                    <div class="shop-description">
                        <h3 class="product-title">${item.name}</h3>
                        <div class="price">
                            <p>R$ ${item.price / 100}</p>
                            <h4 class="product-sell-price">R$ ${item.sellingPrice / 100}</h4>
                        </div>
                        <button class="btn add-cart">
                            <i class="uil uil-shopping-cart"></i>
                        </button>
                    </div>
                </div>`;
}

renderItems();


// Cart --------------------------------------------------------------------
let cartIcon = document.querySelector("#cartIcon");
let cart = document.querySelector(".cart");
let cartClose = document.querySelector(".cart-close");


// Open cart --------------------------------------------------------------------
cartIcon.onclick = () => {
    cart.classList.add("active")
};
// Close cart --------------------------------------------------------------------v
cartClose.onclick = () => {
    cart.classList.remove("active")
};

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    // Remove itens do carrinho
    var removeCartButtons = document.getElementsByClassName('cart-product-remove')
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i]
        button.addEventListener('click', removeCartItem)
    };

    // Alterações de quantidade
    var quantityInputs = document.getElementsByClassName('cart-product-qtd')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged)
    }

    // Adicionar ao carrinho
    var addCart = document.getElementsByClassName('add-cart')
    console.log(addCart.item);
    for (var i = 0; i < addCart.length; i++) {
        var button = addCart[i];
        console.log(button);
        button.addEventListener('click', function () {
            console.log("Teste Click");
        });
    }
};



// Remove itens do carrinho --------------------------------------------------------------------
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove()
    updateTotal();
};

// Mudar quantidade --------------------------------------------------------------------
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
}

// Adicionar ao Carrinho --------------------------------------------------------------------
function addCartClicked(event) {
    var button = event.target
    var shopProducts = button.parentElement
    var title = shopProducts.querySelector('.shop-description h3')[0].innerText;
    console.log(title);
    // var price = shopProducts.getElementsByClassName('product-price')[0].innerText;
    // var productImg = shopProducts.getElementsByClassName('product-img')[0].src;

    // addProductToCart(title, price, productImg);
    // updateTotal();
}

function addProductToCart(title, price, productImg) {
    var cartShopBox = document.createElement('div')
    // cartShopBox.classList.add('cart-product')
    var cartItems = document.getElementsByClassName('cart-content')[0];
    var cartItemsNames = cartItems.getElementsByClassName('cart-product-title')
    for (var i = 0; i < cartItemsNames.length; i++) {
        alert('Você já adicionou este produto ao carrinho')
    }
}


// Atualização do Total --------------------------------------------------------------------
function updateTotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-product');
    var total = 0;

    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i]
        var priceElement = cartBox.getElementsByClassName('cart-product-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-product-qtd')[0];
        var price = parseFloat(priceElement.innerText.replace("R$", ""));
        var quantity = quantityElement.value;
        total = total + (price * quantity);

        total = Math.round(total * 100) / 100

        document.querySelectorAll(".cart-total-price h2")[0].innerText = 'R$' + total;
    }
}