import { FC } from "react";
import "./datePickerModal.style.css";
import Modal from "..";
import { useTranslation } from "react-i18next";

interface IProps {
  open: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  onClear: () => void;
  selectedDate: Date | null;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  viewMode: "days" | "months" | "years";
  setViewMode: (mode: "days" | "months" | "years") => void;
  minDate: Date;
  maxDate: Date;
}

const DatePickerModal: FC<IProps> = ({
  open,
  onClose,
  onSelectDate,
  onClear,
  selectedDate,
  currentMonth,
  setCurrentMonth,
  viewMode,
  setViewMode,
  minDate,
  maxDate,
}) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const handleDateSelect = (date: Date) => {
    if (date >= minDate && date <= maxDate) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      onSelectDate(`${year}-${month}-${day}`);
      onClose();
      setViewMode("days");
    }
  };

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(month);
    setCurrentMonth(newDate);
    setViewMode("days");
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);

    if (year >= minDate.getFullYear() && year <= maxDate.getFullYear()) {
      setCurrentMonth(newDate);
      setViewMode("months");
    }
  };

  const handleToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    onSelectDate(`${year}-${month}-${day}`);
    setCurrentMonth(today);
    onClose();
    setViewMode("days");
  };

  const handleClearClick = () => {
    onClear();
    onClose();
    setViewMode("days");
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentMonth);
    if (direction === "prev") {
      if (viewMode === "years") {
        const newYear = currentMonth.getFullYear() - 12;
        if (newYear >= minDate.getFullYear()) {
          newDate.setFullYear(newYear);
        }
      } else {
        newDate.setMonth(currentMonth.getMonth() - 1);
      }
    } else {
      if (viewMode === "years") {
        const newYear = currentMonth.getFullYear() + 12;
        if (newYear <= currentYear) {
          newDate.setFullYear(newYear);
        }
      } else {
        newDate.setMonth(currentMonth.getMonth() + 1);
      }
    }
    setCurrentMonth(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getMonths = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(i);
    }
    return months;
  };

  const getYears = () => {
    const currentYear = currentMonth.getFullYear();
    const startYear = Math.floor(currentYear / 12) * 12;
    const years = [];

    for (let i = startYear - 1; i < startYear + 14; i++) {
      years.push(i);
    }
    return years;
  };

  const isDateDisabled = (date: Date | null): boolean => {
    if (!date) return false;
    return date < minDate || date > maxDate;
  };

  const isMonthDisabled = (month: number): boolean => {
    const testDate = new Date(currentMonth.getFullYear(), month, 15);
    return testDate < minDate || testDate > maxDate;
  };

  const isYearDisabled = (year: number): boolean => {
    return year < minDate.getFullYear() || year > maxDate.getFullYear();
  };

  const days = getDaysInMonth(currentMonth);
  const months = getMonths();
  const years = getYears();
  const today = new Date();

  const weekDays = [
    t("calendar.days.sun"),
    t("calendar.days.mon"),
    t("calendar.days.tue"),
    t("calendar.days.wed"),
    t("calendar.days.thu"),
    t("calendar.days.fri"),
    t("calendar.days.sat"),
  ];

  const monthShortNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const monthFullNames = [
    "january",
    "february",
    "march",
    "april",
    "may_full",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const renderHeader = () => {
    if (viewMode === "years") {
      const startYear = years[0];
      const endYear = years[years.length - 1];
      return `${startYear} - ${endYear}`;
    }

    if (viewMode === "months") {
      return currentMonth.getFullYear().toString();
    }

    const monthIndex = currentMonth.getMonth();
    const monthKey = monthFullNames[monthIndex];
    const monthName = t(`calendar.months.${monthKey}`);
    const year = currentMonth.getFullYear();

    return `${monthName} ${year}`;
  };

  const handleHeaderClick = () => {
    if (viewMode === "days") {
      setViewMode("months");
    } else if (viewMode === "months") {
      setViewMode("years");
    }
  };

  const isPrevDisabled = () => {
    if (viewMode === "years") {
      return years[0] <= minDate.getFullYear();
    }
    if (viewMode === "months") {
      return currentMonth.getFullYear() <= minDate.getFullYear();
    }
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(currentMonth.getMonth() - 1);
    return prevMonth < minDate;
  };

  const isNextDisabled = () => {
    if (viewMode === "years") {
      return years[years.length - 1] >= maxDate.getFullYear();
    }
    if (viewMode === "months") {
      return currentMonth.getFullYear() >= maxDate.getFullYear();
    }
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    return nextMonth > maxDate;
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="date_picker_modal_content">
        <div className="calendar_header">
          <button
            className={`nav_button ${isPrevDisabled() ? "disabled" : ""}`}
            onClick={() => !isPrevDisabled() && navigateMonth("prev")}
            disabled={isPrevDisabled()}
            type="button"
          >
            ‹
          </button>
          <div className="current_period" onClick={handleHeaderClick}>
            {renderHeader()}
          </div>
          <button
            className={`nav_button ${isNextDisabled() ? "disabled" : ""}`}
            onClick={() => !isNextDisabled() && navigateMonth("next")}
            disabled={isNextDisabled()}
            type="button"
          >
            ›
          </button>
        </div>

        {viewMode === "days" && (
          <>
            <div className="week_days">
              {weekDays.map((day) => (
                <div key={day} className="week_day">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar_grid">
              {days.map((date, index) => (
                <div
                  key={index}
                  className={`calendar_day ${date ? "" : "empty"} ${
                    date &&
                    selectedDate &&
                    date.toDateString() === selectedDate.toDateString()
                      ? "selected"
                      : ""
                  } ${
                    date && date.toDateString() === today.toDateString()
                      ? "today"
                      : ""
                  } ${
                    date && date.getMonth() !== currentMonth.getMonth()
                      ? "other_month"
                      : ""
                  } ${date && isDateDisabled(date) ? "disabled" : ""}`}
                  onClick={() =>
                    date && !isDateDisabled(date) && handleDateSelect(date)
                  }
                >
                  {date ? date.getDate() : ""}
                </div>
              ))}
            </div>
          </>
        )}

        {viewMode === "months" && (
          <div className="months_grid">
            {months.map((month) => (
              <div
                key={month}
                className={`calendar_month ${
                  month === currentMonth.getMonth() ? "selected" : ""
                } ${isMonthDisabled(month) ? "disabled" : ""}`}
                onClick={() =>
                  !isMonthDisabled(month) && handleMonthSelect(month)
                }
              >
                {t(`calendar.months.${monthShortNames[month]}`)}
              </div>
            ))}
          </div>
        )}

        {viewMode === "years" && (
          <div className="years_grid">
            {years.map((year) => (
              <div
                key={year}
                className={`calendar_year ${
                  year === currentMonth.getFullYear() ? "selected" : ""
                } ${isYearDisabled(year) ? "disabled" : ""}`}
                onClick={() => !isYearDisabled(year) && handleYearSelect(year)}
              >
                {year}
              </div>
            ))}
          </div>
        )}

        <div className="calendar_footer">
          <button
            className="footer_button"
            onClick={handleClearClick}
            type="button"
          >
            {t("common.clear")}
          </button>
          <button
            className="footer_button today_button"
            onClick={handleToday}
            type="button"
          >
            {t("common.today")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DatePickerModal;
