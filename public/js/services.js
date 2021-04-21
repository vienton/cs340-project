// Delete row from table by passing in recordID to be deleted
function deleteService(id) {
    let request = new XMLHttpRequest();
    let query = '';

    query = 'serviceID=' + id;

    request.open('DELETE', '/services/?' + query, true);
    request.addEventListener('load', function() {
        if(request.status >= 200 && request.status < 400) {
            location.reload();
        }
    });
    request.send(null);
}

// Update row from table by passing data to be updated
function updateService(currentElement) {
    let row = currentElement.parentNode.parentNode;
    let request = new XMLHttpRequest();
    let query = '';

    let serviceID = row.children[0].textContent;
    let description = row.children[1].textContent;

    query = 'serviceID=' + serviceID + '&' +
            'description=' + description;

    request.open('PUT', '/services/?' + query, true);
    request.addEventListener('load', function() {
        if(request.status >= 200 && request.status < 400) {
            location.reload();
        }
    });
    request.send(null);
}