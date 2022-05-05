"use strict";
// Importación de la función asíncrona para solicitar la información requerida por nuestro usuario
import { fetchApi, response } from "./apiFetchers.js";

// Selector del form
const form = document.querySelector("form");
// Añadimos evento 'submit' al form
form.addEventListener("submit", async (e) => {
  try {
    // Evitamos el comportamiento por defecto del form
    e.preventDefault();
    //Seleccionamos y deshabilitamos el botón hasta que el resultado esté listo
    const buttonSend = document.querySelector("#send");
    buttonSend.disabled = true;

    //Seleccionamos los valores introducidos por el usuario (origen y destino del vuelo) y los convertimos siempre a mayúscula (necesario para código IATA)
    let locations = {
      origin: document.querySelector("#origin").value.toUpperCase(),
      destination: document.querySelector("#destination").value.toUpperCase(),
    };

    // Creación de animación de espera, mientras esperamos a los resultados
    const gallery = document.querySelector("#flightGallery");
    const ul = document.querySelector("#resultList");
    if (ul.firstChild) {
      ul.firstChild.remove();
    }
    const loader = document.createElement("div");
    loader.classList.add("lds-ellipsis");
    loader.innerHTML = "<div></div><div></div><div></div><div></div>";
    gallery.appendChild(loader);

    // Fetch a la api usando la función exportada (nos devuelve el resultado más barato de la búsqueda)
    const cheapestFlight = await fetchApi(locations);
    // Tratamiento de error undefined (un valor introducido en el form es incorrecto) y el 400 (ambos datos incorrectos, bad request)
    if (cheapestFlight === undefined || response.status === 400) {
      loader.remove();
      const error = document.createElement("li");
      error.innerHTML =
        "<h2 class='error'>Parece que no existen vuelos para los códigos introducidos</h2>";
      ul.appendChild(error);
    } else if (response.status === 500) {
      loader.remove();
      const error = document.createElement("li");
      error.innerHTML =
        "<h2 class='error'>Error de conexión, inténtalo de nuevo</h2>";
      ul.appendChild(error);
    } else {
      // Desestructuración del vuelo más barato recibido
      const { itineraries, price, pricingOptions, travelerPricings } =
        cheapestFlight;

      // Objeto donde almacenamos los datos que queremos mostrar al usuario
      let customizedResult = {
        arrivalAt: "[]",
        departureAt: "[]",
        carrierCode: "",
        duration: "",
        numberOfStops: "",
        numberOfBookableSeats: cheapestFlight.numberOfBookableSeats,
        totalPrice: price.total,
        oneWay: cheapestFlight.oneWay,
        currency: price.currency,
        includedCheckedBagsOnly: pricingOptions.includedCheckedBagsOnly,
        fareOption: "",
        cabin: "",
        typeOfClass: "",
      };

      //Bucles y recogida de datos (necesarios cuando la información está en un array de objetos)
      for (const itinerary of itineraries) {
        const { segments } = itinerary;
        for (const segment of segments) {
          customizedResult.arrivalAt = segment.arrival.at;
          customizedResult.departureAt = segment.departure.at;
          customizedResult.carrierCode = segment.carrierCode;
          customizedResult.duration = segment.duration;
          customizedResult.numberOfStops = segment.numberOfStops;
        }
      }

      for (const travel of travelerPricings) {
        customizedResult.fareOption = travel.fareOption;
        const { fareDetailsBySegment } = travel;
        for (const fareDetailBySegment of fareDetailsBySegment) {
          customizedResult.cabin = fareDetailBySegment.cabin;
          customizedResult.typeOfClass = fareDetailBySegment.class;
        }
      }
      // Creación de li en caso de que no haya errores
      const li = document.createElement("li");
      li.classList.add("flightArticle");
      //Eliminar animación de espera
      loader.remove();

      //Mostrar resultados
      li.innerHTML = `<article><p>
      Código de aerolínea: ${customizedResult.carrierCode}</p>
      <p>Salida: ${customizedResult.departureAt}</p>
      <p>Llegada: ${customizedResult.arrivalAt}</p>
      <p>Duración del vuelo: ${customizedResult.duration}</p>
      <p>Número de paradas: ${customizedResult.numberOfStops}</p>
      <p>Número de asientos disponibles: ${
        customizedResult.numberOfBookableSeats
      }</p>
      <p>Trayecto: ${customizedResult.oneWay ? "Sólo ida" : "Ida y vuelta"}</p>
      <p>
      Registro de maletas incluido: ${
        customizedResult.includedCheckedBagsOnly ? "Sí" : "No"
      }
      </p>
      <p>Tarifa: ${customizedResult.fareOption}</p>
      <p>Cabina: ${customizedResult.cabin}</p>
      <p>Clase: ${customizedResult.typeOfClass}</p>
      <strong>PRECIO FINAL: ${customizedResult.totalPrice} ${
        customizedResult.currency
      }</strong>
      </article>`;
      ul.appendChild(li);
    }
    // Habilitamos de nuevo el botón tras los resultados
    buttonSend.disabled = false;
  } catch (error) {
    console.log(error);
  }
});
