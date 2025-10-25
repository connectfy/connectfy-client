import React, { useState, useRef, useEffect } from "react";
import "./index.style.css";
import { CalendarMonth } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  hasError?: boolean;
  inputSize?: "small" | "medium" | "large" | "xlarge";
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
}

type ViewMode = "days" | "months" | "years";

export default function CustomDatePicker({
  value,
  onChange,
  hasError = false,
  inputSize = "medium",
  placeholder = "MM/DD/YYYY",
  onKeyDown
}: CustomDatePickerProps) {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("days");

  const calendarRef = useRef<HTMLDivElement>(null);

  const minDate = new Date(1960, 0, 1);
  const maxDate = new Date();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setViewMode("days");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const displayDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
    : "";

  const handleDateSelect = (date: Date) => {
    if (date >= minDate && date <= maxDate) {
      setSelectedDate(date);
      onChange(formatDate(date));
      setIsOpen(false);
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
    setSelectedDate(today);
    setCurrentMonth(today);
    onChange(formatDate(today));
    setIsOpen(false);
    setViewMode("days");
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange("");
    setIsOpen(false);
    setViewMode("days");
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        if (viewMode === "years") {
          const newYear = prev.getFullYear() - 12;
          if (newYear >= minDate.getFullYear()) {
            newDate.setFullYear(newYear);
          }
        } else {
          newDate.setMonth(prev.getMonth() - 1);
        }
      } else {
        if (viewMode === "years") {
          const newYear = prev.getFullYear() + 12;
          if (newYear <= currentYear) {
            newDate.setFullYear(newYear);
          }
        } else {
          newDate.setMonth(prev.getMonth() + 1);
        }
      }
      return newDate;
    });
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

    // Days view üçün tam ay adını göstər
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
    <div
      className={`custom_date_picker ${inputSize} ${hasError ? "error" : ""}`}
      ref={calendarRef}
    >
      <div className="date_input" onClick={() => setIsOpen(!isOpen)}>
        <input
          type="text"
          readOnly
          value={displayDate}
          placeholder={placeholder}
          className="date_display"
          onKeyDown={(e) => onKeyDown ? onKeyDown(e) : undefined}
        />
        <div className="calendar_icon">
          <CalendarMonth />
        </div>
      </div>

      {isOpen && (
        <div className="calendar_popup">
          <div className="calendar_header">
            <button
              className={`nav_button ${isPrevDisabled() ? "disabled" : ""}`}
              onClick={() => !isPrevDisabled() && navigateMonth("prev")}
              disabled={isPrevDisabled()}
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
                  onClick={() =>
                    !isYearDisabled(year) && handleYearSelect(year)
                  }
                >
                  {year}
                </div>
              ))}
            </div>
          )}

          <div className="calendar_footer">
            <button className="footer_button" onClick={handleClear}>
              {t("common.clear")}
            </button>
            <button
              className="footer_button today_button"
              onClick={handleToday}
            >
              {t("common.today")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
