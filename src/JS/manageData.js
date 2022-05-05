'use strict';
// Importación de la función asíncrona para solicitar la información requerida por nuestro usuario
import { fetchApi } from './apiFetchers.js';

// Selector del form
const form = document.querySelector('form');
// Añadimos evento 'click' del form
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  //Seleccionamos los valores introducidos por el usuario (origen y destino del vuelo)
  let locations = {
    origin: document.querySelector('#origin').value.toUpperCase(),
    destination: document.querySelector('#destination').value.toUpperCase(),
  };
  // Creación de animación de espera
  const gallery = document.querySelector('#flightGallery');
  const ul = document.querySelector('#resultList');
  if (ul.firstChild) {
    ul.firstChild.remove();
  }
  const loader = document.createElement('div');
  loader.classList.add('lds-ellipsis');
  loader.innerHTML = '<div></div><div></div><div></div><div></div>';
  gallery.appendChild(loader);

  // Fetch a la api usando la función exportada
  const cheapestFlight = await fetchApi(locations);

  // Tratamiento de errores
  if (cheapestFlight === undefined) {
    loader.remove();
    const error = document.createElement('li');
    error.innerHTML =
      '<h2>Parece que no existen vuelos para los códigos introducidos</h2>';
    ul.appendChild(error);
  } else {
    // Desestructuración de los datos recibidos
    const { itineraries, price, pricingOptions, travelerPricings } =
      cheapestFlight;

    //Declaración de variables para almacenar los datos que vamos a tratar
    let customizedResult = {
      arrivalAt: '[]',
      departureAt: '[]',
      carrierCode: '',
      duration: '',
      numberOfStops: '',
      numberOfBookableSeats: cheapestFlight.numberOfBookableSeats,
      totalPrice: price.total,
      oneWay: cheapestFlight.oneWay,
      currency: price.currency,
      includedCheckedBagsOnly: pricingOptions.includedCheckedBagsOnly,
      fareOption: '',
      cabin: '',
      typeOfClass: '',
    };

    //Bucles y recogida de datos
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
    const li = document.createElement('li');
    li.classList.add('flightArticle');
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
    <p>Trayecto: ${customizedResult.oneWay ? 'Sólo ida' : 'Ida y vuelta'}</p>
    <p>
    Registro de maletas incluido: ${
      customizedResult.includedCheckedBagsOnly ? 'Sí' : 'No'
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
});
