
let close_button = document.getElementById('close-button')
let popup = document.getElementById('popup')

let popupTitle = document.getElementById('popupTitle')
let popupDate = document.getElementById('popupDate')

let popupCancel = document.getElementById('popupCancel')
let popupApply = document.getElementById('popupApply')



// Funktion zum Hinzufügen eines Termins
function addEvent() {
    const eventTitle = document.getElementById("eventTitle").value;
    const eventDate = new Date(document.getElementById("eventDate").value);

    if (!eventTitle || !eventDate || isNaN(eventDate)) {
        alert("Bitte geben Sie einen gültigen Titel und ein gültiges Datum ein.");
        return;
    }

    const events = getEventsFromLocalStorage();
    events.push({ title: eventTitle, date: eventDate.getTime() });
    localStorage.setItem("events", JSON.stringify(events));

    document.getElementById("eventTitle").value = "";
    document.getElementById("eventDate").value = "";
    displayEvents();
}

// Funktion zum Löschen eines Termins
function deleteEvent(index) {
    if (confirm("Wollen sie das Datum wirklich löschen?") === false) return

    const events = getEventsFromLocalStorage();
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    displayEvents();
}

// Funktion zur Bearbeitung eines Events
function editEvent(index) {
    const events = getEventsFromLocalStorage();
    const event = events[index];

    // Setze die globale Variable currentlyEditingIndex auf den aktuellen Index
    currentlyEditingIndex = index;

    const updatedTitle = event.title;

    openPopup(event.title, new Date(event.date));
}


popupApply.addEventListener('click', () => {

    if (!popupTitle.value) {
        alert('Gib einen Titel ein.')
        return
    }

    if (!popupDate.value) {
        alert('Gib einen gültiges Datum ein.')
        return
    }

    // Lese die im Popup bearbeiteten Daten aus
    const updatedTitle = popupTitle.value;
    const updatedDate = new Date(popupDate.value);

    // Führe die Bearbeitung des Events durch
    const events = getEventsFromLocalStorage();
    const event = events[currentlyEditingIndex];
    event.title = updatedTitle;
    event.date = updatedDate.getTime();
    localStorage.setItem("events", JSON.stringify(events));

    // Schließe das Popup
    closePopup();

    // Zeige die aktualisierten Events
    displayEvents();
});


// Funktion zur Anzeige des Datums im Format "Tag, Monat Jahr"
function formatDate(date) {
    return date.toLocaleDateString("de-DE");
}























// Funktion zum Anzeigen der Termine
function displayEvents() {
    const events = getEventsFromLocalStorage();
    const eventList = document.getElementById("eventList");
    const templateListItem = document.getElementById('templateListItem')

    eventList.innerHTML = "";

    events.forEach((event, index) => {
        const listItem = templateListItem.content.cloneNode(true)
        const listItemTitle = listItem.querySelector('[data-list-item-title]')
        const listItemDate = listItem.querySelector('[data-list-item-date]')
        const listItemTimePast = listItem.querySelector('[data-list-item-time-past]')

        const listActions = listItem.querySelector('[data-list-actions]')

        const eventDate = new Date(event.date);
        listItemTitle.textContent = event.title
        listItemDate.textContent = formatDate(eventDate)
        listItemTimePast.textContent = calculateDays(eventDate)

        const editButton = document.createElement("button");
        editButton.textContent = "Bearbeiten";
        editButton.className = "edit-button";
        editButton.addEventListener("click", () => editEvent(index));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Löschen";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", () => deleteEvent(index));

        listActions.appendChild(editButton);
        listActions.appendChild(deleteButton);

        eventList.appendChild(listItem);
    });
}





















// Hilfsfunktion zum Abrufen der Termine aus dem LocalStorage
function getEventsFromLocalStorage() {
    const events = JSON.parse(localStorage.getItem("events")) || [];
    return events;
}

// Funktion zur Berechnung der Tage zwischen dem ausgewählten Datum und dem heutigen Datum
function calculateDays(selectedDate) {
    const today = new Date();
    const timeDifference = selectedDate.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (daysDifference > 2) {
        return `In ${daysDifference} Tagen`;
    } else if (daysDifference === 2) {
        return "Übermorgen";
    } else if (daysDifference === 1) {
        return "Morgen";
    } else if (daysDifference === 0) {
        return "Heute";
    } else if (daysDifference === -1) {
        return "Gestern";
    } else if (daysDifference === -2) {
        return "Vorgestern";
    } else {
        return `Vor ${-daysDifference} Tagen`;
    }
}


function closePopup() {
    if (popup.style.display !== 'none') {
        popup.style.display = 'none'
    }
}

function openPopup(popupSavedTitle, popupSavedDate) {
    if (popup.style.display !== 'flex') {
        popup.style.display = 'flex'
    }

    popupTitle.value = popupSavedTitle
    popupDate.valueAsDate = popupSavedDate

}

close_button.addEventListener('click', () => {
    closePopup()
})

popupCancel.addEventListener('click', () => {
    closePopup()
})


// Beim Laden der Seite die gespeicherten Termine anzeigen
displayEvents();















// Make the DIV element draggable:
dragElement(document.getElementById("popup"));

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById('titlebar')) {
        // if present, the header is where you move the DIV from:
        document.getElementById('titlebar').onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}