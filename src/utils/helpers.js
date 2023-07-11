export const getDaysOfMonth = (yearMonth) => {
  const [year, month] = yearMonth.split("/");
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const days = [];

  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const day = date.getDate();
    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    }).format(date);
    const formattedDate = `${day}${dayName} ${date.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    })}`;
    days.push(formattedDate);
  }

  return days;
};

/**
 * Returns an array of formatted dates for the past year.
 * @returns {string[]} An array of formatted dates in the format "YYYY/MM".
 */
export const getFormattedDates = () => {
  const endDate = new Date();
  const startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), 1);

  const dates = [];

  while (startDate <= endDate) {
    const year = startDate.getFullYear();
    const month = startDate.toLocaleString("en-US", { month: "2-digit" });
    const formattedDate = `${year}/${month}`;

    dates.push(formattedDate);

    startDate.setMonth(startDate.getMonth() + 1);
  }

  return dates;
};

const splitWeekends = (data) => {
  const weekends = data.filter(
    (item) =>
      item.date.includes("Sat") ||
      item.date.includes("Sun") ||
      item.date.includes("Fri")
  );

  return weekends.reduce(
    (acc, item) => {
      if (item.date.includes("Fri")) {
        acc.push([item]);
      } else {
        acc[acc.length - 1].push(item);
      }
      return acc;
    },
    [[]]
  );
};

export const findLeastBusyWeekend = (data) => {
  const weekends = splitWeekends(data);
  const leastBusyWeekend = weekends.reduce(
    (acc, item) => {
      const percentages = item.map((el) => parseInt(el.percentages));
      const sum = percentages.reduce((a, b) => a + b, 0);
      const avg = sum / percentages.length;
      if (avg < acc.avg) {
        acc = {
          avg,
          weekend: item,
        };
      }
      return acc;
    },
    { avg: 100, weekend: [] }
  );

  return leastBusyWeekend.weekend;
};

export const findLeastBusyWeek = (data) => {
  const splitWeek = data.reduce(
    (acc, item) => {
      if (item.date.includes("Sat")) {
        acc.push([item]);
      } else {
        acc[acc.length - 1].push(item);
      }
      return acc;
    },
    [[]]
  );

  const leastBusyWeek = splitWeek.reduce(
    (acc, item) => {
      const percentages = item.map((el) => parseInt(el.percentages));
      const sum = percentages.reduce((a, b) => a + b, 0);
      const avg = sum / percentages.length;
      if (avg < acc.avg) {
        acc = {
          avg,
          week: item,
        };
      }
      return acc;
    },
    { avg: 100, week: [] }
  );

  return leastBusyWeek.week;
};

// Best weekend per-Month (12)  to visit
export const findBestWeekendPerMonth = (data) => {
  const weekends = splitWeekends(data);

  //  group weekends by month
  const weekendsByMonth = weekends.reduce((acc, item) => {
    const month = item[0].date.split(" ");
    const monthYear = `${month[1]} ${month[2]}`;
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(item);
    return acc;
  }, {});

  // for each month, find the least busy weekend
  const bestWeekendPerMonth = Object.keys(weekendsByMonth).reduce(
    (acc, month) => {
      const leastBusyWeekend = weekendsByMonth[month].reduce(
        (acc, item) => {
          const percentages = item.map((el) => parseInt(el.percentages));
          const sum = percentages.reduce((a, b) => a + b, 0);
          const avg = sum / percentages.length;
          if (avg < acc.avg) {
            acc = {
              avg,
              weekend: item,
            };
          }
          return acc;
        },
        { avg: 100, weekend: [] }
      );

      acc[month] = leastBusyWeekend.weekend;
      return acc;
    },
    {}
  );

  return bestWeekendPerMonth;
};
