import { DATE_FORMAT, TIME_FORMAT } from "@/common/enums/enums";
import dayjs from "dayjs";
import { t } from "i18next";

// ====================
// DD MMMM YYYY
// ====================
export const DDMMMMYYY = (date: string | Date) => {
  const d = dayjs(date);
  const day = d.format("DD");
  let monthKey = d.format("MMMM").toLowerCase();
  if (monthKey === "may") monthKey = "may_full";
  const month = t(`calendar.months.${monthKey}`);
  const year = d.format("YYYY");
  return `${day} ${month} ${year}`;
};

// ====================
// DD MMM YYYY
// ====================
export const DDMMMYYY = (date: string | Date) => {
  const d = dayjs(date);
  const day = d.format("DD");
  let monthKey = d.format("MMM").toLowerCase();
  if (monthKey === "may") monthKey = "may_full";
  const month = t(`calendar.months.${monthKey}`);
  const year = d.format("YYYY");
  return `${day} ${month} ${year}`;
};

// ====================
// Show Date with Hour
// ====================
export const showDateWithHour = (
  date: string | Date,
  dateFormat: DATE_FORMAT,
  timeFormat: TIME_FORMAT,
  splitWith?: string
) => {
  const d = dayjs(date);

  const timePattern = timeFormat === TIME_FORMAT.H24 ? "HH:mm" : "hh:mm A";

  return `${d.format(dateFormat).split("/").join(splitWith ?? "-")} ${d.format(timePattern)}`;
};
