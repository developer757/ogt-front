import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import { addLocale } from "primereact/api";

import App from "./App.jsx";
import { TitleArea } from "./context/TitleContext.jsx";
import { SidebarArea } from "./context/SidebarContext.jsx";
import { UserArea } from "./context/UserContext.jsx";
const value = {
  ripple: true,
  unstyled: false,
};

addLocale("ru", {
  firstDayOfWeek: 1,
  dayNames: [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ],
  dayNamesShort: ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"],
  dayNamesMin: ["В", "П", "В", "С", "Ч", "П", "С"],
  monthNames: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
  monthNamesShort: [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ],
  today: "Сегодня",
  clear: "Очистить",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PrimeReactProvider value={value}>
      <UserArea >
        <TitleArea>
          <SidebarArea>
            <App />
          </SidebarArea>
        </TitleArea>
      </UserArea>
    </PrimeReactProvider>
  </BrowserRouter>
);
