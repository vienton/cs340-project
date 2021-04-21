// Delete row from table by passing in recordID to be deleted
function deleteParkReservation(id) {
    let request = new XMLHttpRequest();
    let query = '';

    query = 'parkReservationID=' + id;

    request.open('DELETE', '/park-reservations/?' + query, true);
    request.addEventListener('load', function() {
        if(request.status >= 200 && request.status < 400) {
            location.reload();
        }
    });
    request.send(null);
}

// Update row from table by passing data to be updated
function updateParkReservation(currentElement) {
    let row = currentElement.parentNode.parentNode;
    let request = new XMLHttpRequest();
    let query = '';

    let parkReservationID = row.children[0].textContent;
    let parkID = row.children[1].textContent;
    let reservationID = row.children[2].textContent;
    let groupSize = row.children[3].textContent;
    let date = row.children[4].textContent;
    let overnight = row.children[5].textContent;

    query = 'parkReservationID=' + parkReservationID + '&' +
            'parkID=' + parkID + '&' +
            'reservationID=' + reservationID + '&' +
            'groupSize=' + groupSize + '&' +
            'date=' + date + '&' +
            'overnight=' + overnight;

    request.open('PUT', '/park-reservations/?' + query, true);
    request.addEventListener('load', function() {
        if(request.status >= 200 && request.status < 400) {
            location.reload();
        }
    });
    request.send(null);
}