// TODO: Execute the search query with the Enter key
// let searchBox = document.getElementById('parkSearchString');
// searchBox.addEventListener('keypress', function(event) {
//     if(event.key === 'Enter') {
//         let parkSearchString = document.getElementById('parkSearchString').value;
//         if(!parkSearchString) {
//             alert("Please enter a search value");
//         } else {
//             window.location = '/reserve/s/' + encodeURI(parkSearchString);
//         }
//     }
// });

// Search park by name
function searchPark() {
    let parkSearchString = document.getElementById('parkSearchString').value;
    if(!parkSearchString) {
        alert("Please enter a search value");
    } else {
        window.location = '/reserve/s/' + encodeURI(parkSearchString);
    }
}

// Filter parks by location
function filterParkByState() {
    let parkFilterString = document.getElementById('stateFilterString').value;
    if(parkFilterString == 'Select') {
        alert("Please select a state");
    } else {
        window.location = '/reserve/f/' + encodeURI(parkFilterString);
    }
}

// Make reservation
function makeReservation() {
    let req = new XMLHttpRequest();
    let query = {};
    let reservations = [];
    let contactInfo = {};
    let readyToSend = false;

    // Get each row that is selected from table
    let table = document.getElementById('parksTable');
    for(let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i];
        // Make sure at least one row is selected
        if(row.children[8].firstChild.checked) {
            readyToSend = true;
        }
        if(row.children[8].firstChild.checked) {
            let reservation = {};
            // Get park ID
            reservation.parkID = row.children[0].innerText;
            // Get reserve date
            reservation.reservationDate = row.children[5].firstChild.value;
            // Get group size
            reservation.groupSize = row.children[6].firstChild.value;
            // Check for reservationDate
            if(!reservation.reservationDate) {
                readyToSend = false;
            }
            // If overnight is selected
            if(row.children[7].firstChild.checked) {
                reservation.overnight = true;
            } else {
                reservation.overnight = false;
            }
            // Add to parks
            reservations.push(reservation);
        }
    }
    query.reservations = reservations;

    // Get contact information
    let contactForm = document.getElementById('contactInformation').elements;
    contactInfo.firstName = contactForm[0].value;
    contactInfo.lastName = contactForm[1].value;
    contactInfo.email = contactForm[2].value;
    contactInfo.telephone = contactForm[3].value;
    contactInfo.streetAddress = contactForm[4].value;
    contactInfo.city = contactForm[5].value;
    contactInfo.state = contactForm[6].value;
    contactInfo.zipCode = contactForm[7].value;
    query.contactInfo = contactInfo;

    // Check for required fields in contactForm
    for(const element in contactInfo) {
        if(contactInfo.hasOwnProperty(element) && !contactInfo[element]) {
            readyToSend = false;
        }
    }

    if(!readyToSend) {
        alert("Please provide all required information");
    } else {
        // Send request
        req.open('POST', '/reserve', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function() {
            if(req.status >= 200 && req.status < 400) {
                let res = JSON.parse(req.responseText);
                console.log(res);
                alert("Reservation successfully made");
                // Reset input fields and reload page
                document.getElementById('contactInformation').reset();
                window.location.reload();
            } else {
                alert("Error in network request. Reservation not made.");
                console.log('Error in network request: ' + req.statusText);
            }
        });
        req.send(JSON.stringify(query));
    }
}