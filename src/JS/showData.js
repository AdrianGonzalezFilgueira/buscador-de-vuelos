"use strict";
import { fetchApi } from "./main.js";

const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let locations = {
    origin: document.querySelector("#origin").value.toUpperCase(),
    destination: document.querySelector("#destination").value.toUpperCase(),
  };
  const cheapestFlight = await fetchApi(locations);
  const { itineraries } = cheapestFlight;

  let arrivalAt = [];
  let departureAt = [];
  let carrierCode = "";
  let duration = "";
  let numberOfStops = "";

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

  const ul = document.querySelector("#resultList");
  const li = document.createElement("li");

  li.innerHTML = `<article><p>
  Código de aerolínea:${carrierCode},
  Llegada:${arrivalAt},
  Salida:${departureAt},
  Duración del vuelo: ${duration},
  Número de paradas:${numberOfStops}

  </p></article>`;
  ul.appendChild(li);
});
