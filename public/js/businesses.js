// Delete row from table by passing in recordID to be deleted
function deleteBusiness(id) {
    let request = new XMLHttpRequest();
    let query = '';

    query = 'businessID=' + id;

    request.open('DELETE', '/businesses/?' + query, true);
    request.addEventListener('load', function() {
        if(request.status >= 200 && request.status < 400) {
            location.reload();
        }
    });
    request.send(null);
}

// Update row from table by passing data to be updated
function updateBusiness(currentElement) {
    let row = currentElement.parentNode.parentNode;
    let request = new XMLHttpRequest();
    let query = '';

    let businessID = row.children[0].textContent;
    let parkID = row.children[1].textContent;
    let businessName = row.children[2].textContent;
    let telephone = row.children[3].textContent;
    let streetAddress = row.children[4].textContent;
    let city = row.children[5].textContent;
    let state = row.children[6].textContent;
    let zipCode = row.children[7].textContent;

    query = 'businessID=' + businessID + '&' +
            'parkID=' + parkID + '&' +
            'businessName=' + businessName + '&' +
            'telephone=' + telephone + '&' +
            'streetAddress=' + streetAddress + '&' +
            'city=' + city + '&' +
            'state=' + state + '&' +
            'zipCode=' + zipCode;

    request.open('PUT', '/businesses/?' + query, true);
    request.addEventListener('load', function() {
        if(request.status >= 200 && request.status < 400) {
            location.reload();
        }
    });
    request.send(null);
}