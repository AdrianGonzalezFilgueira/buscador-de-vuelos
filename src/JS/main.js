"use strict";
import { currentDate } from "./helpers.js";

// Función asíncrona para solicitar el token de acceso para la API
async function fetchToken() {
  try {
    const responseToken = await fetch(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials&client_id=DzFz6xgx71Nr8B1hOi2BUjZHxVFGCcb4&client_secret=n0fSOjZX4L1PNBKq",
      }
    );
    const dataToken = await responseToken.json();
    const token = dataToken.access_token;
    return token;
  } catch (error) {
    console.log(error);
  }
}
fetchToken();

const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let locations = {
    origin: document.querySelector("#origin").value.toUpperCase(),
    destination: document.querySelector("#destination").value.toUpperCase(),
  };
  const gallery = document.querySelector("#flightGallery");
  const loader = document.createElement("div");
  loader.classList.add("lds-ellipsis");
  loader.innerHTML = "<div></div><div></div><div></div><div></div>";
  gallery.appendChild(loader);
  const ul = document.querySelector("#resultList");
  if (ul.firstChild) {
    ul.firstChild.remove();
  }
  const cheapestFlight = await fetchApi(locations);

  const li = document.createElement("li");
  li.classList.add("flightArticle");
  li.innerHTML = `<article><p>a</p></article>`;
  loader.remove();
  ul.appendChild(li);
});

// Función asíncrona para solicitar la información requerida por nuestro usuario

export async function fetchApi(locations) {
  try {
    const response = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${
        locations.origin
      }&destinationLocationCode=${
        locations.destination
      }&departureDate=${currentDate()}&adults=1&nonStop=false&max=250`,
      { headers: { Authorization: `Bearer ${await fetchToken()}` } }
    );
    const results = await response.json();
    console.log(results.data[0]);
    return results.data[0];
  } catch (error) {
    alert(error);
  }
}
