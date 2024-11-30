// Array om de ingevoerde gegevens op te slaan
let studieGegevens = [];

// Verwijzingen naar de elementen in de DOM
const form = document.getElementById('studieForm');
const planningLijst = document.getElementById('planningLijst');
const resetButton = document.getElementById('resetButton'); // Verwijzing naar resetknop

// Event listener: Formulier verwerken bij indiening
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Voorkomt herladen van de pagina

    // Haal de waarden uit de invoervelden
    const datum = document.getElementById('datum').value;
    const vak = document.getElementById('vak').value;
    const starttijd = document.getElementById('starttijd').value;
    const eindtijd = document.getElementById('eindtijd').value;
    const opmerking = document.getElementById('opmerking').value;

    // Validatie: Controleer of verplichte velden ingevuld zijn
    if (!datum || !vak || !starttijd || !eindtijd) {
        alert('Vul alle verplichte velden in!');
        return;
    }

    // Maak een object voor het studie-item
    const studieItem = {
        datum,
        vak,
        starttijd,
        eindtijd,
        opmerking: opmerking || 'Geen opmerking' // Default tekst als opmerking leeg is
    };

    // Voeg het nieuwe item toe aan de array
    studieGegevens.push(studieItem);

    // Sorteer de array op datum en tijd
    sorteerStudieGegevens();

    // Werk de lijst bij in de UI
    updatePlanningLijst();

    // Reset het formulier
    form.reset();
});

// Functie om de studiegegevens te sorteren op datum en starttijd
function sorteerStudieGegevens() {
    studieGegevens.sort((a, b) => {
        const tijdstipA = new Date(`${a.datum}T${a.starttijd}`);
        const tijdstipB = new Date(`${b.datum}T${b.starttijd}`);
        return tijdstipA - tijdstipB; // Sorteer oplopend (vroeg naar laat)
    });
}

// Functie om de gegevens weer te geven in een lijst
function updatePlanningLijst() {
    // Leeg de huidige lijst in de UI
    planningLijst.innerHTML = '';

    let vorigeDatum = null; // Houd de vorige datum bij om te bepalen of een scheidingslijn nodig is

    // Loop door de gesorteerde array
    studieGegevens.forEach((item, index) => {
        // Voeg een scheidingslijn toe als de datum verandert
        if (item.datum !== vorigeDatum) {
            const scheiding = document.createElement('li');
            scheiding.classList.add('datum-scheiding'); // Voeg een speciale klasse toe
            scheiding.textContent = formatDatum(item.datum); // Format de datum leesbaar
            planningLijst.appendChild(scheiding);
            vorigeDatum = item.datum; // Update de vorige datum
        }

        // Maak een lijstitem (li) voor het studie-item
        const li = document.createElement('li');
        li.classList.add('planning-item'); // Specifieke klasse voor styling
        li.innerHTML = `
            <strong>Datum:</strong> ${item.datum} | 
            <strong>Vak:</strong> ${item.vak} | 
            <strong>Tijd:</strong> ${item.starttijd} - ${item.eindtijd} | 
            <strong>Opmerking:</strong> ${item.opmerking}
        `;

        // Voeg een verwijderknop toe aan het item
        const verwijderKnop = document.createElement('button');
        verwijderKnop.textContent = 'Verwijderen';
        verwijderKnop.classList.add('verwijder-knop');
        verwijderKnop.addEventListener('click', function() {
            verwijderStudieItem(index);
        });

        li.appendChild(verwijderKnop); // Voeg de knop toe aan het lijstitem
        planningLijst.appendChild(li); // Voeg het lijstitem toe aan de lijst
    });
}

// Functie om een studie-item te verwijderen
function verwijderStudieItem(index) {
    studieGegevens.splice(index, 1); // Verwijder het item uit de array
    updatePlanningLijst(); // Werk de lijst bij
}

// Event listener: Resetknop om de lijst te wissen
resetButton.addEventListener('click', function() {
    if (confirm('Weet u zeker dat u de hele lijst wilt verwijderen?')) {
        studieGegevens = []; // Maak de array leeg
        updatePlanningLijst(); // Werk de lijst bij
    }
});

// Functie om de datum leesbaar te formatteren (YYYY-MM-DD naar DD-MM-YYYY)
function formatDatum(datum) {
    const [jaar, maand, dag] = datum.split('-');
    return `${dag}-${maand}-${jaar}`;
}
