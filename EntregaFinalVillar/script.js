fetch("/data.json")
    .then((res) => res.json())
    .then(data => {
        productos = data
        productosIniciales = JSON.parse(JSON.stringify(productos))
        if (localStorage.getItem("productos")) {
            productos = JSON.parse(localStorage.getItem("productos"))
        }

        renderizarContador()
        mostrarTienda(productos)
    })
    .catch((error) => {
        Swal.fire({
            title: 'Error!',
            text: 'No se pudieron obtener los datos',
            icon: 'error',
            confirmButtonText: 'OK!'
        })
    })

let botonesMenos = []
let botonesMas = []
let carrito = []
let carritoUnidades = 0
if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"))
}

if (localStorage.getItem("carritoUnidades")) {
    carritoUnidades = JSON.parse(localStorage.getItem("carritoUnidades"))
}

let carritoDOM = document.getElementById("wrapper")


function mostrarTienda(arrayProductos) {
    let contenedor = document.getElementById("contenedorProductos")
    let buscadorBoton = document.getElementById("buscador")
    let carritoBotonUnWrapped = document.getElementById("carritoBoton")
    let carritoWrapped = document.getElementById("wrapper")
    let botonVolverATienda = document.getElementById("botonVolverALaTienda")
    let botonComprar = document.getElementById("botonComprar")
    contenedor.classList = ""
    buscadorBoton.classList = ""
    carritoBotonUnWrapped.classList = "col-2 d-flex justify-content-end"
    carritoWrapped.classList = "ocultar"
    botonVolverATienda.classList = "ocultar"
    botonComprar.classList = "ocultar"
    contenedor.innerHTML = ""
    let buscador = document.getElementById("buscador")


    arrayProductos.forEach(producto => {
        let muestraProducto = document.createElement("div")
        muestraProducto.className = "muestraProducto"

        muestraProducto.innerHTML = `
        <div class=imagen style="background-image: url(${producto.img})"></div>
        <h2 class=tituloProducto>${producto.nombre}</h2>
        <p>${producto.categoria}</p>
        <h3>$ ${producto.precio}</h3>
        <p>Quedan ${producto.stock} unidades</p>
        <button> <img id=${producto.id} class=imgBotonCarrito src="./img/carritoCompras.png" alt=""> </button>
        `

        contenedor.appendChild(muestraProducto)

        let botonAgregarCarrito = document.getElementById(producto.id)
        botonAgregarCarrito.addEventListener("click", agregarAlCarrito)
        if (producto.stock > 0) {
            botonAgregarCarrito.addEventListener("click", lanzarTostada)
        }

    })
    buscador.addEventListener("input", filtrar)
    renderizarContador()
}

function filtrar(e) {
    let arrayFiltrado = productos.filter(producto => producto.nombre.includes(buscador.value))
    mostrarTienda(arrayFiltrado)
}

function limpiarFiltrado() {
    let buscadorString = document.getElementById("buscador")
    buscadorString.value = ""
}

function agregarAlCarrito(e) {
    let productoBuscado = productos.find(producto => producto.id === Number(e.target.id))
    if (productoBuscado.stock > 0) {
        if (carrito.some(producto => producto.id == productoBuscado.id)) {
            let pos = carrito.findIndex(producto => producto.id == productoBuscado.id)
            carrito[pos].unidades++
            carrito[pos].subtotal = carrito[pos].precio * carrito[pos].unidades
            carritoUnidades++
            productoBuscado.stock--
        } else {
            carrito.push({
                img: productoBuscado.img,
                id: productoBuscado.id,
                nombre: productoBuscado.nombre,
                precio: productoBuscado.precio,
                unidades: 1,
                subtotal: productoBuscado.precio
            })
            carritoUnidades++
            productoBuscado.stock--
        }
    }
    else {
        lanzarTostada2()
    }

    localStorage.setItem("carrito", JSON.stringify(carrito))
    localStorage.setItem("carritoUnidades", JSON.stringify(carritoUnidades))
    localStorage.setItem("productos", JSON.stringify(productos))

    let buscador = document.getElementById("buscador")

    renderizarContador()

    if (buscador.value == "") {
        mostrarTienda(productos)
    }
    else {
        let arrayFiltrado = productos.filter(producto => producto.nombre.includes(buscador.value))
        mostrarTienda(arrayFiltrado)
    }
}

let carritoBoton = document.getElementById("carritoBoton")
carritoBoton.addEventListener("click", renderizarCarrito)

function renderizarCarrito() {
    let contenedorEliminado = document.getElementById("contenedorProductos")
    let buscadorBoton = document.getElementById("buscador")
    let carritoUnWrapper = document.getElementById("wrapper")
    let botonVolverATienda = document.getElementById("botonVolverALaTienda")
    let botonComprar = document.getElementById("botonComprar")
    carritoUnWrapper.classList = ""
    contenedorEliminado.classList = "ocultar"
    buscadorBoton.classList = "ocultar"
    botonVolverATienda.classList = "botonVolverALaTienda"
    botonComprar.classList = "botonComprar"
    carritoDOM.innerHTML = ""
    carrito.forEach(producto => {

        let tarjetaCarrito = document.createElement("div")
        tarjetaCarrito.className = "carritoDOM"
        tarjetaCarrito.innerHTML = `
        <div class=imagen style="background-image: url(${producto.img})"></div>
        <div class="row d-flex flex-nowrap justify-content-center align-items-center">
        <button id="menos - ${producto.id}"> - </button>
        <h2 class="text-center">${producto.unidades}</h2>
        <button id="mas - ${producto.id}"> + </button>
        </div>
        <h2 class=tituloProducto>${producto.nombre}</h2>
        <h3>$ ${producto.subtotal}</h3>
        `

        carritoDOM.appendChild(tarjetaCarrito)

    })

    carrito.map(producto => {
        let botonMenos = document.getElementById(`menos - ${producto.id}`)
        botonesMenos[producto.id] = botonMenos
        botonMenos.addEventListener("click", restarCarrito)
        let botonMas = document.getElementById(`mas - ${producto.id}`)
        botonesMas[producto.id] = botonMas
        botonMas.addEventListener("click", sumarCarrito)
    })

    let carritoBotonEnTienda = document.getElementById("carritoBoton")
    carritoBotonEnTienda.classList = "ocultar"

    let botonVolverALaTienda = document.getElementById("botonVolverALaTienda")
    botonVolverALaTienda.addEventListener("click", function () { mostrarTienda(productos); limpiarFiltrado() })


    botonComprar.addEventListener("click", () => {
        let total = 0
        carrito.forEach(producto => {
            total += producto.subtotal
        })
        Swal.fire({
            title: `El total a pagar es: $ ${total}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Comprar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {

            if (result.isConfirmed) {
                comprar()
            }
        })

    })
}





function renderizarContador() {

    let contadorCarrito = document.getElementById("contadorCarrito")
    contadorCarrito.innerHTML = `
    ${carritoUnidades}
    `
}

function renderizarCarritoModificado() {
    carritoDOM.innerHTML = ""
    carrito.forEach(producto => {
        let tarjetaCarrito = document.createElement("div")
        tarjetaCarrito.className = "carritoDOM"
        tarjetaCarrito.innerHTML = `
            <div class=imagen style="background-image: url(${producto.img})"></div>
            <div class="row d-flex flex-nowrap justify-content-center align-items-center">
            <button id="menos - ${producto.id}"> - </button>
            <h2 class="text-center">${producto.unidades}</h2>
            <button id="mas - ${producto.id}"> + </button>
            </div>
            <h2 class=tituloProducto>${producto.nombre}</h2>
            <h3>$ ${producto.subtotal}</h3>
            `

        carritoDOM.appendChild(tarjetaCarrito)
    })

    carrito.map(producto => {
        let botonMenos = document.getElementById(`menos - ${producto.id}`)
        botonesMenos[producto.id] = botonMenos
        botonMenos.addEventListener("click", restarCarrito)
        let botonMas = document.getElementById(`mas - ${producto.id}`)
        botonesMas[producto.id] = botonMas
        botonMas.addEventListener("click", sumarCarrito)
    })

}

function restarCarrito(e) {
    idString = e.target.id
    let idSolo = Number(idString.match(/\d+/)[0])
    let productoBuscadoEnCarrito = carrito.find(producto => producto.id === idSolo)
    let productoBuscadoEnTienda = productos.find(producto => producto.id === productoBuscadoEnCarrito.id)
    if (productoBuscadoEnCarrito.unidades > 0) {
        let pos = carrito.findIndex(producto => producto.id == productoBuscadoEnCarrito.id)
        carrito[pos].unidades--
        carrito[pos].subtotal = carrito[pos].precio * carrito[pos].unidades
        carritoUnidades--
        productoBuscadoEnTienda.stock++
        if (productoBuscadoEnCarrito.unidades != 0) {
            renderizarCarritoModificado()
        }
        else if (productoBuscadoEnCarrito.unidades == 0) {
            let pos = carrito.findIndex(producto => producto.id == productoBuscadoEnCarrito.id)
            carrito.splice(pos, 1)
            renderizarCarritoModificado()
        }
    }
    localStorage.setItem("carritoUnidades", JSON.stringify(carritoUnidades))
    localStorage.setItem("carrito", JSON.stringify(carrito))
    localStorage.setItem("productos", JSON.stringify(productos))
}

function sumarCarrito(e) {
    let productosOriginales = JSON.parse(JSON.stringify(productosIniciales))
    idString = e.target.id
    let idSolo = Number(idString.match(/\d+/)[0])
    let productoBuscadoEnCarrito = carrito.find(producto => producto.id === idSolo)
    let productoBuscadoEnTienda = productos.find(producto => producto.id === productoBuscadoEnCarrito.id)
    let productoOriginalBuscado = productosOriginales.find(producto => producto.id === productoBuscadoEnCarrito.id)
    let productosStockTotal = productoOriginalBuscado.stock
    if (productoBuscadoEnCarrito.unidades < productosStockTotal && productoBuscadoEnTienda.stock > 0) {
        let pos = carrito.findIndex(producto => producto.id == productoBuscadoEnCarrito.id)
        carrito[pos].unidades++
        carrito[pos].subtotal = carrito[pos].precio * carrito[pos].unidades
        carritoUnidades++
        productoBuscadoEnTienda.stock--
    }
    localStorage.setItem("carritoUnidades", JSON.stringify(carritoUnidades))
    renderizarCarritoModificado()
}

function comprar() {
    localStorage.removeItem("carrito")
    carrito = []
    localStorage.removeItem("carritoUnidades")
    carritoUnidades = 0
    renderizarCarritoModificado()
}

function lanzarTostada() {
    Toastify({
        text: "Producto agregado",
        duration: 2000,
        newWindow: true,
        close: false,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#333333",
        },
        onClick: function () { console.log("HOLA") } // Callback after click
    }).showToast()
}

function lanzarTostada2() {
    Toastify({
        text: "No hay mas stock",
        duration: 2000,
        newWindow: true,
        close: false,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#333333",
        },
        onClick: function () { console.log("HOLA") } // Callback after click
    }).showToast()
}

