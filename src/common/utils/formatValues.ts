import { DATE_FORMAT, TIME_FORMAT } from "@/common/enums/enums";
import dayjs from "dayjs";
import { t } from "i18next";

// ====================
// DD MMMM YYYY
// ====================
export function DDMMMMYYY(date: string | Date) {
  const d = dayjs(date);
  const day = d.format("DD");
  let monthKey = d.format("MMMM").toLowerCase();
  if (monthKey === "may") monthKey = "may_full";
  const month = t(`calendar.months.${monthKey}`);
  const year = d.format("YYYY");
  return `${day} ${month} ${year}`;
}

// ====================
// DD MMM YYYY
// ====================
export function DDMMMYYY(date: string | Date) {
  const d = dayjs(date);
  const day = d.format("DD");
  let monthKey = d.format("MMM").toLowerCase();
  if (monthKey === "may") monthKey = "may_full";
  const month = t(`calendar.months.${monthKey}`);
  const year = d.format("YYYY");
  return `${day} ${month} ${year}`;
}

// ====================
// Show Date
// ====================
export function showDate(
  date: string | Date,
  dateFormat: DATE_FORMAT,
  splitWith?: string,
) {
  const d = dayjs(date);

  return `${d
    .format(dateFormat)
    .split("/")
    .join(splitWith ?? "-")}`;
}

// ====================
// Show Date with Hour
// ====================
export function showDateWithHour(
  date: string | Date,
  dateFormat: DATE_FORMAT,
  timeFormat: TIME_FORMAT,
  splitWith?: string,
) {
  const d = dayjs(date);

  const timePattern = timeFormat === TIME_FORMAT.H24 ? "HH:mm" : "hh:mm A";

  return `${d
    .format(dateFormat)
    .split("/")
    .join(splitWith ?? "-")} ${d.format(timePattern)}`;
}

export function formatTimeToSeconds(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// ====================
// Format Phone Number
// ====================
export function formatPhoneNumber(
  value: string,
  mask: string,
  countryCode?: string,
) {
  if (!value) return "";

  let formatted = "";
  let valueIndex = 0;

  for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
    if (mask[i] === "0") {
      formatted += value[valueIndex];
      valueIndex++;
    } else {
      formatted += mask[i];
    }
  }

  if (countryCode) return `${countryCode} ${formatted}`;
  return formatted;
}
