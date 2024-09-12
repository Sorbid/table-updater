function getStartOfJuly(year) {
  return new Date(year, 3, 7); // Month is zero-based in JavaScript (0 for January, 1 for February, etc.)
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getDatesInRange(start, end) {
  const dates = [];
  let currentDate = start;
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

function groupByWeek(dates) {
  const weeks = [];
  let weekStart = new Date(dates[0]);

  while (weekStart <= dates[dates.length - 1]) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 3); // Assuming weeks start on Sunday, adjust as needed

    weeks.push({
      start: new Date(weekStart),
      end: new Date(weekEnd),
    });

    // Move to the next week
    weekStart.setDate(weekStart.getDate() + 4);
  }
  return weeks;
}

// Example usage for this year
const startYear = new Date().getFullYear();
const startOfJuly = getStartOfJuly(startYear);
const today = new Date(2024, 5, 29);

const datesInRange = getDatesInRange(startOfJuly, today);
const groupedByWeek = groupByWeek(datesInRange);

module.exports = groupedByWeek;
