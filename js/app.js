const carrito = document.querySelector("#carrito");
const carritoContainer = document.querySelector("#lista-carrito tbody");
const listaCursos = document.querySelector("#lista-cursos");
const botonVaciarCarrito = document.querySelector("#vaciar-carrito");
const mensaje = document.querySelector(".mensaje");
let pagar = 0;
const ultimaFila = carritoContainer.querySelector(".ultima-fila");
let articulosCarrito = [ultimaFila];

//Agregar curso al carrito
listaCursos.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("agregar-carrito")) {
    const card = e.target.parentElement.parentElement;
    let cursoInfo = {
      imagen: card.querySelector("img").src,
      titulo: card.children[1].children[0].textContent,
      precio: card.children[1].children[3].querySelector("span").textContent,
      cantidad: 1, //Por defecto la cantidad de cursos en el carrito cuando se agrega es 1
      id: e.target.getAttribute("data-id"),
    };
    let existe = articulosCarrito.some((curso, index) => {
      if (index !== articulosCarrito.length - 1) {
        return curso.id === cursoInfo.id;
      }
    });
    if (existe) {
      //Si existe el curso aumento la cantidad en el carrito
      articulosCarrito.forEach((curso, index) => {
        if (articulosCarrito.length !== 1) {
          if (
            curso.id === cursoInfo.id &&
            index !== articulosCarrito.length - 1
          ) {
            curso.cantidad++;
            pagar += parseFloat(curso.precio.replace("$", ""));
          }
        }
      });
    } else {
      //Si no existe el curso en el carrito se agrega
      articulosCarrito.unshift(cursoInfo);
      pagar += parseFloat(cursoInfo.precio.replace("$", ""));
    }
    //Mensaje para confirmar que se agregó el curso
    msje("Se ha agregado el curso");
    totalAPagar();
    cargarCarrito();
  }
});

//Limpiar el carrito
function limpiarCarrito() {
  while (carritoContainer.firstChild !== ultimaFila) {
    carritoContainer.removeChild(carritoContainer.firstChild);
  }
}

//Cargar el carrito en el HTML
function cargarCarrito() {
  limpiarCarrito();

  articulosCarrito.forEach((curso, index) => {
    if (index !== articulosCarrito.length - 1) {
      let { imagen, titulo, id, precio, cantidad } = curso;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
        <img src="${imagen}" alt="" width="100">
        </td>
        <td>
        ${titulo}
        </td>
        <td>
        ${precio}
        </td>
        <td>
        ${cantidad}
        </td>
        <td>
        <a href="#" class="borrar-curso" data-id="${id}">X</a>
        </td>
        `;
      // carritoContainer.appendChild(row)
      carritoContainer.insertBefore(row, carritoContainer.firstChild);
    }
  });
}

//Obtener curso
function obtenerCurso(id) {
  return articulosCarrito.find(
    (curso, index) => curso.id === id && index !== articulosCarrito.length - 1
  );
}

//Eliminar el curso
carrito.addEventListener("click", (e) => {
  if (e.target.classList.contains("borrar-curso")) {
    let cursoAEliminar = obtenerCurso(e.target.getAttribute("data-id"));
    let cant = parseInt(cursoAEliminar.cantidad);
    let pos = articulosCarrito.findIndex(
      (curso, index) =>
        curso.id === cursoAEliminar.id && index !== articulosCarrito.length - 1
    );
    if (cant > 1) {
      pagar -= parseFloat(cursoAEliminar.precio.replace("$", ""));
      articulosCarrito[pos].cantidad--;
    } else {
      pagar -= parseFloat(cursoAEliminar.precio.replace("$", ""));
      articulosCarrito.splice(pos, 1);
    }
    if (articulosCarrito.length === 0) {
      msje("Se ha limpiado el carrito");
    }
    cargarCarrito();
    totalAPagar();
  }
});

//Vaciar carrito
botonVaciarCarrito.addEventListener("click", () => {
  articulosCarrito = [];
  limpiarCarrito();
  pagar=0
  totalAPagar()
  msje("Se ha limpiado el carrito");
});

//Ocultar el mensaje de borrar
function hideMsje() {
  mensaje.style.display = "none";
}

//Mostrar mensaje
function msje(msje) {
  let span = mensaje.querySelector("span");
  span.textContent = msje;
  mensaje.style.display = "flex";
  setTimeout(hideMsje, 1200);
}

function totalAPagar() {
  ultimaFila.querySelector(".cantidad-total").textContent = `$${pagar}`;
}
