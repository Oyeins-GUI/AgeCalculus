let isValid = true;
let interval = 1000;
let startValueYear = -1;
let startValueMonth = -1;
let startValueDay = -1;
let dateHistories;

const today = new Date();
const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");
const allInputs = document.querySelectorAll(".date-input");
const errorDay = document.querySelector(".error-day");
const errorMonth = document.querySelector(".error-month");
const errorYear = document.querySelector(".error-year");
const yearResult = document.querySelector(".year-result");
const monthResult = document.querySelector(".month-result");
const dayResult = document.querySelector(".day-result");
const yearOutput = document.querySelector(".year-output");
const monthOutput = document.querySelector(".month-output");
const dayOutput = document.querySelector(".day-output");
const showResult = document.querySelector(".display-result");
const dayText = document.querySelector(".day-text");
const monthText = document.querySelector(".month-text");
const yearText = document.querySelector(".year-text");
const historyMenu = document.querySelector(".history");
const hamburgerIcon = document.querySelector(".toggle-icon");
const closeIcon = document.querySelector(".close-history");
const historyContainer = document.querySelector(".history-content");

yearInput.max = today.getFullYear();

if (localStorage.getItem("dates") === null) {
   dateHistories = [];
} else {
   dateHistories = JSON.parse(localStorage.getItem("dates"));
}

function eventListeners() {
   hamburgerIcon.addEventListener("click", () => {
      historyMenu.classList.add("show");
   });
   closeIcon.addEventListener("click", () => {
      historyMenu.classList.remove("show");
   });
   showResult.addEventListener("click", displayAge);
   document.addEventListener("keyup", function (e) {
      if (e.keyCode === 13) {
         displayAge();
      }
   });
}
eventListeners();

function getUserInput() {
   const valueOfDay = Number(dayInput.value);
   const valueOfMonth = Number(monthInput.value);
   const valueOfYear = Number(yearInput.value);

   return { valueOfDay, valueOfMonth, valueOfYear };
}

function calculateAge() {
   const { valueOfDay, valueOfMonth, valueOfYear } = getUserInput();
   let birthDate = Date.parse(`${valueOfYear}-${valueOfMonth}-${valueOfDay}`);
   let birthDateObj = new Date(birthDate);
   let years, months, days;
   let dateHistory = [];

   if (
      today.getMonth() > birthDateObj.getMonth() ||
      (today.getMonth() === birthDateObj.getMonth() &&
         today.getDate() >= birthDateObj.getDate())
   ) {
      years = today.getFullYear() - birthDateObj.getFullYear();
   } else {
      years = today.getFullYear() - birthDateObj.getFullYear() - 1;
   }

   if (today.getDate() >= birthDateObj.getDate()) {
      months = today.getMonth() - birthDateObj.getMonth();
   } else if (today.getDate() < birthDateObj.getDate()) {
      months = today.getMonth() - birthDateObj.getMonth() - 1;
   }
   months = months < 0 ? months + 12 : months;

   let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
   if (today.getDate() >= birthDateObj.getDate()) {
      days = today.getDate() - birthDateObj.getDate();
   } else {
      days =
         today.getDate() -
         birthDateObj.getDate() +
         monthDays[birthDateObj.getMonth()];
   }

   dateHistory.push(`${valueOfYear}, ${valueOfMonth}, ${valueOfDay}`);
   dateHistory.push(`${years}, ${months}, ${days}`);
   dateHistories.push(dateHistory);

   if (storageAvailable("localStorage")) {
      localStorage.setItem("dates", JSON.stringify(dateHistories));
      dateHistory = [];
   } else {
      alert("Couldn't add data to history");
   }

   return { years, months, days };
}

function displayAge() {
   if (isValid) {
      const { days, months, years } = calculateAge();
      let endValueYear = years;
      let endValueMonth = months;
      let endValueDay = days;

      let durationYear = Math.floor(interval / endValueYear);
      let durationMonth = Math.floor(interval / endValueMonth);
      let durationDay = Math.floor(interval / endValueDay);

      if (days > 1) {
         dayText.textContent = "days";
      } else {
         dayText.textContent = "day";
      }
      if (months > 1) {
         monthText.textContent = "months";
      } else {
         monthText.textContent = "month";
      }
      if (years > 1) {
         yearText.textContent = "years";
      } else {
         yearText.textContent = "year";
      }

      let counterYear = setInterval(function () {
         startValueYear += 1;
         yearResult.textContent = years;
         if (startValueYear === endValueYear) {
            clearInterval(counterYear);
            startValueYear = -1;
         }
      }, durationYear);

      let counterMonth = setInterval(function () {
         startValueMonth += 1;
         monthResult.textContent = months;
         console.log(startValueMonth === endValueMonth);
         if (startValueMonth === endValueMonth) {
            clearInterval(counterMonth);
            startValueMonth = -1;
         }
      }, durationMonth);

      let counterDay = setInterval(function () {
         startValueDay += 1;
         dayResult.textContent = days;
         if (startValueDay === endValueDay) {
            clearInterval(counterDay);
            startValueDay = -1;
         }
      }, durationDay);

      getDateAndAddToHistory(dateHistories);
   }
}

function createAndSetHistoryElements(date, index) {
   const prevDate = date[0].split(", ");
   const currentDate = date[1].split(", ");

   const li = document.createElement("li");
   li.classList.add("histories");

   const dateParagraph = document.createElement("p");
   dateParagraph.textContent = `${prevDate[2]}/${prevDate[1]}/${prevDate[0]}`;
   li.appendChild(dateParagraph);

   const ageParagraph = document.createElement("p");
   ageParagraph.textContent = `${currentDate[0]}y, ${currentDate[1]}m, ${currentDate[2]}d`;
   li.appendChild(ageParagraph);

   const deleteButton = document.createElement("i");
   deleteButton.classList.add("fa-solid", "fa-trash", "fa-lg");
   deleteButton.dataset.index = index;
   deleteButton.addEventListener("click", deleteHistory);
   li.appendChild(deleteButton);

   historyContainer.appendChild(li);
}

function getDateAndAddToHistory(histories) {
   historyContainer.innerHTML = "";

   histories.forEach((date, index) => {
      createAndSetHistoryElements(date, index);
   });
}
getDateAndAddToHistory(dateHistories);

function deleteHistory(event) {
   const index = event.target.dataset.index;

   const historyItem = event.target.parentElement;
   historyItem.remove();

   dateHistories.splice(index, 1);
   localStorage.setItem("dates", JSON.stringify(dateHistories));
}

function storageAvailable(type) {
   let storage;
   try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
   } catch (e) {
      return (
         e instanceof DOMException &&
         (e.code === 22 ||
            e.code === 1014 ||
            e.name === "QuotaExceededError" ||
            e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
         storage &&
         storage.length !== 0
      );
   }
}
