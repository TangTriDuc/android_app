import moment from "moment";

//Change VN / EN
const viDayLabels = {
  1: "T2",
  2: "T3",
  3: "T4",
  4: "T5",
  5: "T6",
  6: "T7",
  7: "CN",
};

const getDayLabel = (date, language = "en") => {
  if (language === "vn") {
    return viDayLabels[date.isoWeekday()];
  }

  return date.format("dd");
};

//Process of Start & End Date
export const FormatDate = (timestamp) => {
  return new Date(timestamp);
};

export const FormatDateForText = (date, language = "en") => {
  if (!date) return null;

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return new Intl.DateTimeFormat(language === "vn" ? "vi-VN" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

//Process of Reminder Time
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  console.log(timeString);
  return timeString;
};

//Process of Date Range to show like format below
export const getDatesRange = (startdate, endDate) => {
  const start = moment(new Date(startdate), "MM/DD/YYYY");
  const end = moment(new Date(endDate), "MM/DD/YYYY");
  const dates = [];

  while (start.isSameOrBefore(end)) {
    dates.push(start.format("MM/DD/YYYY"));
    start.add(1, "days");
  }

  return dates;
};

//Process of Add Medical List
export const GetDataRangeToDisplay = (language = "en") => {
  const dateList = [];
  for (let i = 0; i <= 7; i++) {
    const date = moment().add(i, "days");

    dateList.push({
      date: date.format("DD"),
      day: getDayLabel(date, language),
      formattedDate: date.format("L"),
    });
  }
  return dateList;
};

//Process of History
export const GetPrevDateRangeToDisplay = (language = "en") => {
  const dates = [];
  for (let i = 0; i <= 7; i++) {
    const date = moment().subtract(i, "days");

    dates.push({
      date: date.format("DD"),
      day: getDayLabel(date, language),
      formattedDate: date.format("L"),
    });
  }
  return dates;
};
