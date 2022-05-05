import { cheapestFlight } from "./showResult.js";

export function dataManager() {
  // Desestructuración del vuelo más barato recibido (cheapestFlight)
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
  return customizedResult;
}
