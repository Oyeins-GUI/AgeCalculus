let isValid = true;
let interval = 1000;
let startValueYear = -1;
let startValueMonth = -1;
let startValueDay = -1;
let dateHistories = [];

const today = new Date();
const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");
const allInputs = document.querySelectorAll(".date-input");
const errorDay = document.querySelector(".error-day");
const errorMonth = document.querySelector(".error-month");
const errorYear = document.querySelector(".error-year");
const showResult = document.querySelector(".display-result");
const yearResult = document.querySelector(".year-result");
const monthResult = document.querySelector(".month-result");
const dayResult = document.querySelector(".day-result");
const yearOutput = document.querySelector(".year-output");
const monthOutput = document.querySelector(".month-output");
const dayOutput = document.querySelector(".day-output");
const dayText = document.querySelector(".day-text");
const monthText = document.querySelector(".month-text");
const yearText = document.querySelector(".year-text");
const historyMenu = document.querySelector(".history");
const hamburgerIcon = document.querySelector(".toggle-icon");
const closeIcon = document.querySelector(".close-history");
const historyContainer = document.querySelector(".history-content");
yearInput.dataset.max = today.getFullYear();
yearInput.max = today.getFullYear();





hamburgerIcon.addEventListener("click", () => {
  historyMenu.classList.add("show");
});
closeIcon.addEventListener("click", () => {
  historyMenu.classList.remove("show");
});
showResult.addEventListener("click", displayAge);
document.addEventListener("keyup", function (e) { 
  if (e.keyCode == 13) {
    displayAge();
  }
});


if(localStorage.length > 0) {
    
    let retrievedDate = JSON.parse(localStorage.getItem("dates"));
    historyContainer.innerHTML = ""; // Clear history container
  
    retrievedDate.forEach((date, index) => {
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
    });
  }


function getUserInput() {
  const valueOfDay = Number(dayInput.value);
  const valueOfMonth = Number(monthInput.value);
  const valueOfYear = Number(yearInput.value);

  if (valueOfDay == "" || valueOfMonth == "" || valueOfYear == "") return;

  return { valueOfDay, valueOfMonth, valueOfYear };
}

function calculateAge() {
  const { valueOfDay, valueOfMonth, valueOfYear } = getUserInput();
  let birthDate = new Date(`${valueOfYear}, ${valueOfMonth}, ${valueOfDay}`);
  let dateHistory = [];
  let years;
  let months;
  let days;

  if (
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() == birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate())
  ) {
    years = today.getFullYear() - birthDate.getFullYear();
  } else {
    years = today.getFullYear() - birthDate.getFullYear() - 1;
  }

  if (today.getDate() >= birthDate.getDate()) {
    months = today.getMonth() - birthDate.getMonth();
  } else if (today.getDate() < birthDate.getDate()) {
    months = today.getMonth() - birthDate.getMonth() - 1;
  }
  months = months < 0 ? months + 12 : months;

  let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (today.getDate() >= birthDate.getDate()) {
    days = today.getDate() - birthDate.getDate();
  } else {
    days =
      today.getDate() - birthDate.getDate() + monthDays[birthDate.getMonth()];
  }

  dateHistory.push(`${valueOfYear}, ${valueOfMonth}, ${valueOfDay}`);
  dateHistory.push(`${years}, ${months}, ${days}`);
  dateHistories.push(dateHistory);
  console.log("History");
  console.log(dateHistory);
  console.log("Histories");
  console.log(dateHistories);

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

    yearResult.dataset.valYear = years;
    monthResult.dataset.valMonth = months;
    dayResult.dataset.valDay = days;

    let endValueYear = yearResult.dataset.valYear;
    let endValueMonth = monthResult.dataset.valMonth;
    let endValueDay = dayResult.dataset.valDay;

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

    let counterYear = setInterval(() => {
      startValueYear += 1;
      yearResult.textContent = startValueYear;
      if (startValueYear == endValueYear) {
        clearInterval(counterYear);
        startValueYear = -1;
      }
    }, durationYear);
    let counterMonth = setInterval(() => {
      startValueMonth += 1;
      monthResult.textContent = startValueMonth;
      if (startValueMonth == endValueMonth) {
        clearInterval(counterMonth);
        startValueMonth = -1;
      }
    }, durationMonth);
    let counterDay = setInterval(() => {
      startValueDay += 1;
      dayResult.textContent = startValueDay;
      if (startValueDay == endValueDay) {
        clearInterval(counterDay);
        startValueDay = -1;
      }
    }, durationDay);
    getDateAndAddToHistory();
  }
}

// ...

function getDateAndAddToHistory() {
  let retrievedDate = JSON.parse(localStorage.getItem("dates"));
  historyContainer.innerHTML = ""; // Clear history container

  retrievedDate.forEach((date, index) => {
    const prevDate = date[0].split(", ");
    const currentDate = date[1].split(", ");
    historyContainer.innerHTML += `
      <div class="histories">
        <p>${prevDate[2]}/${prevDate[1]}/${prevDate[0]}</p>
        <p>${currentDate[0]}y, ${currentDate[1]}m, ${currentDate[2]}d</p>
        <i class="fa-solid fa-trash fa-lg" data-index="${index}"></i>
      </div>
    `;
  });

  // Add event listeners to delete buttons
  const deleteButtons = document.querySelectorAll(".fa-trash");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", deleteHistory);
  });
}

function deleteHistory(event) {
  const index = event.target.dataset.index;

  // Remove the element from the UI
  const historyItem = event.target.parentElement;
  historyItem.remove();

  // Remove the element from local storage
  let retrievedDate = JSON.parse(localStorage.getItem("dates"));
  retrievedDate.splice(index, 1);
  localStorage.setItem("dates", JSON.stringify(retrievedDate));
}

// ...




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
