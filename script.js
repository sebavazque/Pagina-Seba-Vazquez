const cards = document.getElementById('cards')
const items = document.getElementById('items')
const carrito = document.getElementById('carrito') 
const templateCard = document.getElementById('template-card').content
const templateCarrito = document.getElementById('template-carrito').content
const templateFooter = document.getElementById('template-footer').content
const fragment = document.createDocumentFragment()

let carro = {};

document.addEventListener('DOMContentLoaded', e => { fetchData() });

cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAction(e)
})


// Traer productos
const fetchData = async () => {
    const res = await fetch('productos.json');
    const data = await res.json()
     console.log(data)
    pintarCards(data)
}

// Pintar productos
const pintarCards = data => {
    data.forEach(item => {
        templateCard.querySelector('h3').textContent = item.titulo
        templateCard.querySelector('.precios').textContent = item.precio
        templateCard.querySelector('button').dataset.id = item.id
        templateCard.querySelector('img').setAttribute("src",item.imagen)
        templateCard.querySelector('h5').textContent = item.descripcion
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

// Agregar al carrito
const addCarrito = e => {
    
    if (e.target.classList.contains('btn-dark')) {
        //  console.log(e.target.dataset.id)
        //  console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
     //console.log(objeto)
    const producto = {
        title: objeto.querySelector('h3').textContent,
        precio: objeto.querySelector('.precios').textContent,
        id: objeto.querySelector('button').dataset.id,
        cantidad: 1
        }
     //console.log(producto)
        if (carro.hasOwnProperty(producto.id)) {
            producto.cantidad = carro[producto.id].cantidad + 1
    }

    carro[producto.id] = { ...producto }
    
    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''

    Object.values(carro).forEach(item => {
        templateCarrito.querySelector('th').textContent = item.id
        templateCarrito.querySelectorAll('td')[0].textContent = item.title
        templateCarrito.querySelectorAll('td')[1].textContent = item.cantidad
        templateCarrito.querySelector('span').textContent = item.precio * item.cantidad
        
        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = item.id
        templateCarrito.querySelector('.btn-danger').dataset.id = item.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()
}

const pintarFooter = () => {
    footer.innerHTML = ''
    
    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carro).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carro).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    // console.log(nPrecio)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carro = {}
        pintarCarrito()
    })

}

const btnAction = e => {
    if(e.target.classList.contains('btn-info')){
        
        const producto = carro[e.target.dataset.id]
        producto.cantidad = carro[e.target.dataset.id].cantidad + 1
        carro[e.target.dataset.id] = { ...producto }
        pintarCarrito()
        
    }

    if(e.target.classList.contains('btn-danger')){
        const producto = carro[e.target.dataset.id]
        producto.cantidad = carro[e.target.dataset.id].cantidad - 1
        if (producto.cantidad === 0 ){
            delete carro[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}