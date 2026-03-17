import { FC } from "react";
import Modal from "..";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/CustomButton/Button/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
      <div className="bg-(--card-bg) rounded-xl p-5 w-full max-w-[360px] mx-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <Button
            className={`bg-transparent border-none text-2xl cursor-pointer py-2 px-3 rounded-lg transition-all text-(--text-color) font-light hover:bg-(--active-bg-2) hover:text-(--primary-color) ${
              isPrevDisabled() ? "opacity-30 cursor-not-allowed" : ""
            }`}
            onClick={() => !isPrevDisabled() && navigateMonth("prev")}
            disabled={isPrevDisabled()}
            type="button"
            icon={<ArrowLeft size={18} />}
          />
          <div
            className="font-semibold text-base text-(--text-color) cursor-pointer py-2 px-4 rounded-lg transition-all hover:bg-(--active-bg-2) hover:text-(--primary-color)"
            onClick={handleHeaderClick}
          >
            {renderHeader()}
          </div>
          <Button
            className={`bg-transparent border-none text-2xl cursor-pointer py-2 px-3 rounded-lg transition-all text-(--text-color) font-light hover:bg-(--active-bg-2) hover:text-(--primary-color) ${
              isNextDisabled() ? "opacity-30 cursor-not-allowed" : ""
            }`}
            onClick={() => !isNextDisabled() && navigateMonth("next")}
            disabled={isNextDisabled()}
            type="button"
            icon={<ArrowRight size={18} />}
          />
        </div>

        {/* Days View */}
        {viewMode === "days" && (
          <>
            <div className="grid grid-cols-7 gap-1 mb-3">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-[13px] font-semibold text-(--muted-color) py-2 px-1"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-4">
              {days.map((date, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center h-11 rounded-lg cursor-pointer text-[15px] font-medium transition-all text-(--text-color)
                    ${!date ? "cursor-default" : ""}
                    ${date && !isDateDisabled(date) ? "hover:bg-(--active-bg-2) hover:text-(--primary-color)" : ""}
                    ${date && selectedDate && date.toDateString() === selectedDate.toDateString() ? "bg-(--primary-color) text-white!" : ""}
                    ${date && date.toDateString() === today.toDateString() ? "border-2 border-(--primary-color) text-(--primary-color) font-bold" : ""}
                    ${date && date.getMonth() !== currentMonth.getMonth() ? "text-(--muted-color) opacity-40" : ""}
                    ${date && isDateDisabled(date) ? "opacity-30 cursor-not-allowed" : ""}
                  `}
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

        {/* Months View */}
        {viewMode === "months" && (
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {months.map((month) => (
              <div
                key={month}
                className={`flex items-center justify-center h-12 rounded-xl cursor-pointer text-[15px] font-medium transition-all text-(--text-color)
                  ${month === currentMonth.getMonth() ? "bg-(--primary-color) text-white" : "hover:bg-(--active-bg-2) hover:text-(--primary-color)"}
                  ${isMonthDisabled(month) ? "opacity-30 cursor-not-allowed" : ""}
                `}
                onClick={() =>
                  !isMonthDisabled(month) && handleMonthSelect(month)
                }
              >
                {t(`calendar.months.${monthShortNames[month]}`)}
              </div>
            ))}
          </div>
        )}

        {/* Years View */}
        {viewMode === "years" && (
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {years.map((year) => (
              <div
                key={year}
                className={`flex items-center justify-center h-12 rounded-xl cursor-pointer text-[15px] font-medium transition-all text-(--text-color)
                  ${year === currentMonth.getFullYear() ? "bg-(--primary-color) text-white" : "hover:bg-(--active-bg-2) hover:text-(--primary-color)"}
                  ${isYearDisabled(year) ? "opacity-30 cursor-not-allowed" : ""}
                `}
                onClick={() => !isYearDisabled(year) && handleYearSelect(year)}
              >
                {year}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between gap-3 mt-5 pt-4 border-t border-(--input-border)">
          <Button
            className="flex-1 bg-transparent border border-(--input-border) py-3 px-5 rounded-xl cursor-pointer text-[15px] font-semibold transition-all text-(--text-color) hover:bg-(--active-bg-2) hover:text-(--primary-color) hover:border-(--primary-color)"
            onClick={handleClearClick}
            type="button"
            title={t("common.clear")}
          />
          <Button
            className="flex-1 bg-(--primary-color) border border-(--primary-color) py-3 px-5 rounded-xl cursor-pointer text-[15px] font-semibold transition-all text-white hover:bg-(--hover-bg) hover:border-(--hover-bg)"
            onClick={handleToday}
            type="button"
            title={t("common.today")}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DatePickerModal;
