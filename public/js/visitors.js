// Delete row from table by passing in recordID to be deleted
function deleteVisitor(id) {
    let request = new XMLHttpRequest();
    let query = '';

    query = 'visitorID=' + id;

    request.open('DELETE', '/visitors/?' + query, true);
    request.addEventListener('load', function() {
        if(request.status >= 200 && request.status < 400) {
            location.reload();
        }
    });
    request.send(null);
}

// Update row from table by passing data to be updated
function updateVisitor(currentElement) {
    let row = currentElement.parentNode.parentNode;
    let request = new XMLHttpRequest();
    let query = '';

    let visitorID = row.children[0].textContent;
    let firstName = row.children[1].textContent;
    let lastName = row.children[2].textContent;
    let email = row.children[3].textContent;
    let telephone = row.children[4].textContent;
    let streetAddress = row.children[5].textContent;
    let city = row.children[6].textContent;
    let state = row.children[7].textContent;
    let zipCode = row.children[8].textContent;

    query = 'visitorID=' + visitorID + '&' +
            'firstName=' + firstName + '&' +
            'lastName=' + lastName + '&' +
            'email=' + email + '&' +
            'telephone=' + telephone + '&' +
            'streetAddress=' + streetAddress + '&' +
            'city=' + city + '&' +
            'state=' + state + '&' +
            'zipCode=' + zipCode;

    request.open('PUT', '/visitors/?' + query, true);
    request.addEventListener('load', function() {
        if(request.status >= 200 && request.status < 400) {
            location.reload();
        }
    });
    request.send(null);
}