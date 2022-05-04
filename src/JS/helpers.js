// Exportamos la función que nos permite dar el formato de fecha deseado
export function currentDate() {
  const date = new Date();
  const sumDay = date.setDate(date.getDate() + 1);
  const sumDayFormat = new Date(sumDay).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formatDate = sumDayFormat.split("/").reverse().join("-");
  return formatDate;
}
