// Exportamos la función que nos permite dar el formato de fecha deseado
export function currentDate() {
  // Creamos una fecha, que es la actual
  const date = new Date();
  // Utilizamos setDate para poder cambiar la fecha creada, y como queremos añadirle un día, recogemos el día (getDate) y le añadimos 1
  const sumDay = date.setDate(date.getDate() + 1);
  // Creamos un nuevo Date que utiliza la fecha con el día añadido
  const sumDayFormat = new Date(sumDay).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  // Damos el formato deseado a la fecha (YYYY/MM/DD, sin barras y con guiones)
  const formatDate = sumDayFormat.split("/").reverse().join("-");
  return formatDate;
}
