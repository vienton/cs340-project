// Delete row from table by passing in recordID to be deleted
function deleteBusinessService(id) {
    let request = new XMLHttpRequest();
    let query = '';

    query = 'businessServiceID=' + id;

    request.open('DELETE', '/business-services/?' + query, true);
    request.addEventListener('load', function() {
        if(request.status >= 200 && request.status < 400) {
            location.reload();
        }
    });
    request.send(null);
}

// Update row from table by passing data to be updated
function updateBusinessService(currentElement) {
    let row = currentElement.parentNode.parentNode;
    let request = new XMLHttpRequest();
    let query = '';

    let businessServiceID = row.children[0].textContent;
    let businessID = row.children[1].textContent;
    let serviceID = row.children[2].textContent;

    query = 'businessServiceID=' + businessServiceID + '&' +
            'businessID=' + businessID + '&' +
            'serviceID=' + serviceID;

    request.open('PUT', '/business-services/?' + query, true);
    request.addEventListener('load', function() {
        if(request.status >= 200 && request.status < 400) {
            location.reload();
        }
    });
    request.send(null);
}