"use strict";
// Importación de la función asíncrona para solicitar la información requerida por nuestro usuario
import { fetchApi } from "./apiFetchers.js";

// Selector del form
const form = document.querySelector("form");
// Añadimos evento 'click' del form
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  //Seleccionamos los valores introducidos por el usuario (origen y destino del vuelo)
  let locations = {
    origin: document.querySelector("#origin").value.toUpperCase(),
    destination: document.querySelector("#destination").value.toUpperCase(),
  };
  // Creación de animación de espera
  const gallery = document.querySelector("#flightGallery");
  const ul = document.querySelector("#resultList");
  if (ul.firstChild) {
    ul.firstChild.remove();
  }
  const loader = document.createElement("div");
  loader.classList.add("lds-ellipsis");
  loader.innerHTML = "<div></div><div></div><div></div><div></div>";
  gallery.appendChild(loader);

  // Fetch a la api usando la función exportada
  const cheapestFlight = await fetchApi(locations);
  // Desestructuración de los datos recibidos
  const { itineraries } = cheapestFlight;
  //Declaración de variables para almacenar los datos que vamos a tratar
  let arrivalAt = [];
  let departureAt = [];
  let carrierCode = "";
  let duration = "";
  let numberOfStops = "";

  //Bucles y recogida de datos
  for (const itinerary of itineraries) {
    const { segments } = itinerary;
    for (const segment of segments) {
      arrivalAt.push(segment.arrival.at);
      departureAt.push(segment.departure.at);
      carrierCode = segment.carrierCode;
      duration = segment.duration;
      numberOfStops = segment.numberOfStops;
    }
  }

  // Tratamiento de errores
  if (cheapestFlight === undefined) {
    loader.remove();
    const error = document.createElement("li");
    error.innerHTML =
      "<h2>Parece que no existen vuelos para los códigos introducidos</h2>";
    ul.appendChild(error);
  } else {
    // Creación de li en caso de que no haya errores
    const li = document.createElement("li");
    li.classList.add("flightArticle");
    //Eliminar animación de espera
    loader.remove();

    //Mostrar resultados
    li.innerHTML = `<article><p>
    Código de aerolínea:${carrierCode},
    Llegada:${arrivalAt},
    Salida:${departureAt},
    Duración del vuelo: ${duration},
    Número de paradas:${numberOfStops}
    </p></article>`;
    ul.appendChild(li);
  }
});
