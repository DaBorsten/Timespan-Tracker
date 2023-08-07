let currentlyEditingIndex

const addTitle = document.getElementById('eventTitle')
const addDate = document.getElementById('eventDate')
const addButton = document.getElementById('add')


const close_button = document.getElementById('close-button')
const popup = document.getElementById('popup')

const alertPopup = document.getElementById('alertPopup')
const alertPopupTitlebar = document.getElementById('alertPopupTitlebar')
const alertPopupText = document.getElementById('alertPopupText')
const alertPopupApply = document.getElementById('alertPopupApply')
const closeAlertPopupButton = document.getElementById('closeAlertPopupButton')

const confirmPopup = document.getElementById('confirmPopup')
const confirmPopupTitlebar = document.getElementById('confirmPopupTitlebar')
const confirmPopupText = document.getElementById('connfirmPopupText')
const confirmPopupDenie = document.getElementById('confirmPopupDenie')
const confirmPopupConfirm = document.getElementById('confirmPopupConfirm')
const closeConfirmPopupButton = document.getElementById('closeConfirmPopupButton')

const popupTitle = document.getElementById('popupTitle')
const popupDate = document.getElementById('popupDate')

const popupCancel = document.getElementById('popupCancel')
const popupApply = document.getElementById('popupApply')

const settingsButton = document.getElementById('settings')
const settingsPopup = document.querySelector('.settings')


addButton.addEventListener('click', () => {
    addEvent()
})

addTitle.addEventListener("keypress", (event) => {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {

        event.preventDefault()

        addButton.click()
    }
})

addDate.addEventListener("keypress", (event) => {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {

        event.preventDefault()

        addButton.click()
    }
})


// Funktion zum Hinzufügen eines Termins
function addEvent() {

    const eventTitle = document.getElementById("eventTitle").value;
    const eventDate = new Date(document.getElementById("eventDate").value);

    if (!eventTitle) {
        openAlertPopup('Gib einen Titel ein.')
        return;
    }

    if (!eventDate || isNaN(eventDate)) {
        openAlertPopup('Gib einen gültiges Datum ein.')
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
    openConfirmPopup("Wollen sie den Eintrag wirklich löschen?")
        .then((confirmed) => {
            if (!confirmed) return;
            const events = getEventsFromLocalStorage();
            events.splice(index, 1);
            localStorage.setItem("events", JSON.stringify(events));
            displayEvents();
        })
        .catch((error) => {
            console.error(error);
        });
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
        openAlertPopup('Gib einen Titel ein.')
        return
    }

    if (!popupDate.value) {
        openAlertPopup('Gib einen gültiges Datum ein.')
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
        editButton.classList.add("edit-button", "textOnlyButton")
        editButton.addEventListener("click", () => editEvent(index));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Löschen";
        deleteButton.classList.add("delete-button", "textOnlyButton")
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

    popupTitle.focus()

    popupTitle.value = popupSavedTitle
    popupDate.valueAsDate = popupSavedDate

    centerPopup()
}

popupTitle.addEventListener("keypress", (event) => {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {

        event.preventDefault()

        popupApply.click()
    }
})

popupDate.addEventListener("keypress", (event) => {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {

        event.preventDefault()

        popupApply.click()
    }
})


close_button.addEventListener('click', () => {
    closePopup()
})

popupCancel.addEventListener('click', () => {
    closePopup()
})

function centerPopup() {
    popup.style.top = "50%"
    popup.style.left = "50%"
}



function openAlertPopup(alertText) {
    if (!alertText) return
    if (alertPopup.style.display !== 'flex') {
        alertPopup.style.display = 'flex'
    }
    alertPopupText.innerText = alertText

    centerAlertPopup()

    alertPopupApply.focus()
}


function closeAlertPopup() {
    if (alertPopup.style.display !== 'none') {
        alertPopup.style.display = 'none'
    }
}

alertPopupApply.addEventListener('click', () => {
    closeAlertPopup()
})

closeAlertPopupButton.addEventListener('click', () => {
    closeAlertPopup()
})

function centerAlertPopup() {
    alertPopup.style.top = "50%"
    alertPopup.style.left = "50%"
}



function closeConfirmPopup() {
    if (confirmPopup.style.display !== 'none') {
        confirmPopup.style.display = 'none'
    }
}



function centerConfirmPopup() {
    confirmPopup.style.top = "50%"
    confirmPopup.style.left = "50%"
}



function openConfirmPopup(confirmText) {
    if(!confirmText) return
    return new Promise((resolve, reject) => {
        if (confirmPopup.style.display !== "flex") {
            confirmPopup.style.display = "flex";
        }
        confirmPopupText.innerText = confirmText;

        centerConfirmPopup();

        const onDenyClick = () => {
            closeConfirmPopup();
            resolve(false); // Benutzer hat "Nein" geklickt (false).
        };
        const onConfirmClick = () => {
            closeConfirmPopup();
            resolve(true); // Benutzer hat "Ja" geklickt (true).
        };
        const onCloseClick = () => {
            closeConfirmPopup();
            resolve(undefined); // Benutzer hat das Popup geschlossen (undefined).
        };

        confirmPopupDenie.addEventListener("click", onDenyClick, false);
        confirmPopupConfirm.addEventListener("click", onConfirmClick, false);
        closeConfirmPopupButton.addEventListener("click", onCloseClick, false);

        confirmPopupConfirm.focus()
    });
}








// Beim Laden der Seite die gespeicherten Termine anzeigen
displayEvents();















// Make the DIV element draggable:
dragPopup(document.getElementById("popup"));

function dragPopup(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById('popupTitlebar')) {
        // if present, the header is where you move the DIV from:
        document.getElementById('popupTitlebar').onmousedown = dragMouseDown;
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










// Make the DIV element draggable:
dragAlertPopup(alertPopup);

function dragAlertPopup(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById('alertPopupTitlebar')) {
        // if present, the header is where you move the DIV from:
        document.getElementById('alertPopupTitlebar').onmousedown = dragMouseDown;
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




// Make the DIV element draggable:
dragConfirmPopup(confirmPopup);

function dragConfirmPopup(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById('confirmPopupTitlebar')) {
        // if present, the header is where you move the DIV from:
        document.getElementById('confirmPopupTitlebar').onmousedown = dragMouseDown;
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













settingsButton.addEventListener('click', () => {
    openSettingsPopup()
})

document.addEventListener("click", (e) => {
    // Check if the filter list parent element exist
    const isClosest = e.target.closest('.settings');
    const settingsButtonIsClosest = e.target.closest('#settings');

    if (!settingsButtonIsClosest && !isClosest && settingsPopup.style.display !== 'none') {
        closeSettingsPopup()
    }
});


function openSettingsPopup() {
    if (settingsPopup.getAttribute('data-settings-open') === "false") {
        settingsPopup.setAttribute('data-settings-open', "true")
    }

    setSettingsDefaultTab()
}

function closeSettingsPopup() {
    if (settingsPopup.getAttribute('data-settings-open') === "true") {
        settingsPopup.setAttribute('data-settings-open', "false")
    }
}




















let settingsTabs = document.querySelectorAll('[data-settings-tab-target]')
let settingsContent = document.querySelectorAll('[data-settings-tab-content]')


settingsTabs.forEach(tab => {
    tab.addEventListener('click', () => {

        const target = document.querySelector(tab.dataset.settingsTabTarget)

        settingsTabs.forEach(tab => {
            tab.classList.remove('activeSetting')
        })
        tab.classList.add('activeSetting')


        settingsContent.forEach(settingsPage => {
            settingsPage.classList.remove('activeSetting')
        })

        target.classList.add('activeSetting')

    })
})

function setSettingsDefaultTab() {
    settingsTabs.forEach(tab => {
        tab.classList.remove('activeSetting')
    })
    document.querySelector('[data-settings-tab-target="#generalSettingsContent"]').classList.add('activeSetting')


    settingsContent.forEach(settingsPage => {
        settingsPage.classList.remove('activeSetting')
    })

    document.getElementById('generalSettingsContent').classList.add('activeSetting')
}




let appPageTabs = document.querySelectorAll('[data-app-page-target]')
let appPageContent = document.querySelectorAll('[data-app-page-content]')


appPageTabs.forEach(tab => {
    tab.addEventListener('click', () => {

        const target = document.querySelector(tab.dataset.appPageTarget)

        appPageTabs.forEach(tab => {
            tab.classList.remove('activePage')
        })
        tab.classList.add('activePage')


        appPageContent.forEach(appPage => {
            appPage.classList.remove('activePage')
        })

        target.classList.add('activePage')

    })
})










// Überprüfe, ob der Code in Electron ausgeführt wird
if (typeof require !== 'undefined' && typeof process !== 'undefined' && process.versions && process.versions.electron) {
    // Code, der nur in Electron ausgeführt werden soll
    const { ipcRenderer } = require('electron');

    // Sende eine Nachricht an den Hauptprozess, um die App-Version abzurufen
    ipcRenderer.send('app_version');

    // Empfange die Antwort vom Hauptprozess und gib die Version in der Konsole aus
    ipcRenderer.on('app_version', (event, data) => {
        let appVersion = document.getElementById('appVersion')
        appVersion.innerText = data.version
    });

}


let sortableList = document.getElementById('eventList');
const sortable = new Sortable(sortableList, {
    handle: '.dragElement',
    animation: 200,
    //TOTO: Funktion zum speichern der neuen Ordnung onEnd: saveSortableOrder
})