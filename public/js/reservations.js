// Delete row from table by passing in recordID to be deleted
function deleteReservation(id) {
    let request = new XMLHttpRequest();
    let query = '';

    query = 'reservationID=' + id;

    request.open('DELETE', '/reservations/?' + query, true);
    request.addEventListener('load', function() {
        if(request.status >= 200 && request.status < 400) {
            location.reload();
        }
    });
    request.send(null);
}

// Update row from table by passing data to be updated
function updateReservation(currentElement) {
    let row = currentElement.parentNode.parentNode;
    let request = new XMLHttpRequest();
    let query = '';

    let reservationID = row.children[0].textContent;
    let visitorID = row.children[1].textContent;
    let reservationDate = row.children[2].textContent;

    query = 'reservationID=' + reservationID + '&' +
            'visitorID=' + visitorID + '&' +
            'reservationDate=' + reservationDate;

    // Send request
    request.open('PUT', '/reservations/?' + query, true);
    request.addEventListener('load', function() {
        if(request.status >= 200 && request.status < 400) {
            location.reload();
        }
    });
    request.send(null);
}
