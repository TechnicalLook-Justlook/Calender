const monthYear = document.getElementById("monthYear");
const daysContainer = document.getElementById("days");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const todayBtn = document.getElementById("today");

const modal = document.getElementById("eventModal");
const closeModal = document.getElementById("closeModal");
const selectedDate = document.getElementById("selectedDate");

const eventInput = document.getElementById("eventInput");
const addEventBtn = document.getElementById("addEvent");
const eventList = document.getElementById("eventList");

let currentDate = new Date();
let selectedDateKey = null;

let events = JSON.parse(localStorage.getItem("calendarEvents")) || {};

function saveEvents() {
  localStorage.setItem("calendarEvents", JSON.stringify(events));
}

function formatDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long"
  });

  monthYear.textContent = `${monthName} ${year}`;

  daysContainer.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // Empty days before first day
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.classList.add("day", "empty");
    daysContainer.appendChild(emptyDay);
  }

  // Calendar days
  for (let day = 1; day <= lastDate; day++) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("day");

    const dateNumber = document.createElement("div");
    dateNumber.classList.add("date-number");
    dateNumber.textContent = day;

    dayElement.appendChild(dateNumber);

    const dateKey = formatDateKey(year, month, day);

    // Highlight today
    const today = new Date();

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayElement.classList.add("current-day");
    }

    // Display events
    if (events[dateKey]) {
      events[dateKey].forEach(event => {
        const eventElement = document.createElement("div");
        eventElement.classList.add("event");
        eventElement.textContent = event;

        dayElement.appendChild(eventElement);
      });
    }

    // Open modal
    dayElement.addEventListener("click", () => {
      openEventModal(dateKey);
    });

    daysContainer.appendChild(dayElement);
  }
}

function openEventModal(dateKey) {
  selectedDateKey = dateKey;

  const date = new Date(dateKey + "T00:00:00");

  selectedDate.textContent = date.toLocaleDateString("default", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  eventInput.value = "";

  renderEvents();

  modal.style.display = "flex";

  eventInput.focus();
}

function renderEvents() {
  eventList.innerHTML = "";

  if (!events[selectedDateKey]) {
    return;
  }

  events[selectedDateKey].forEach((event, index) => {
    const eventItem = document.createElement("div");
    eventItem.classList.add("event-item");

    const eventText = document.createElement("span");
    eventText.textContent = event;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-event");

    deleteButton.addEventListener("click", () => {
      events[selectedDateKey].splice(index, 1);

      if (events[selectedDateKey].length === 0) {
        delete events[selectedDateKey];
      }

      saveEvents();
      renderEvents();
      renderCalendar();
    });

    eventItem.appendChild(eventText);
    eventItem.appendChild(deleteButton);

    eventList.appendChild(eventItem);
  });
}

addEventBtn.addEventListener("click", () => {
  const eventText = eventInput.value.trim();

  if (!eventText) {
    return;
  }

  if (!events[selectedDateKey]) {
    events[selectedDateKey] = [];
  }

  events[selectedDateKey].push(eventText);

  saveEvents();

  eventInput.value = "";

  renderEvents();
  renderCalendar();
});

eventInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addEventBtn.click();
  }
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

todayBtn.addEventListener("click", () => {
  currentDate = new Date();
  renderCalendar();
});

renderCalendar();