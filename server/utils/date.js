/**
 * Возвращает вчерашнюю дату в формате гггг-мм-дд.
 * @returns {string} Вчерашняя дата в формате гггг-мм-дд.
 */
function getYesterdayDate() {
  const today = new Date();
  today.setDate(today.getDate() - 1); // Вычитаем 1 день от текущей даты

  const year = today.getFullYear(); // Получаем год
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Получаем месяц и добавляем ведущий ноль
  const day = String(today.getDate()).padStart(2, "0"); // Получаем день и добавляем ведущий ноль

  return `${year}-${month}-${day}`;
}

module.exports = { getYesterdayDate };
