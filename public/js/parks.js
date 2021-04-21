// Delete row from table by passing in recordID to be deleted
function deletePark(id) {
    let request = new XMLHttpRequest();
    let query = '';

    query = 'parkID=' + id;

    request.open('DELETE', '/parks/?' + query, true);
    request.addEventListener('load', function() {
        if(request.status >= 200 && request.status < 400) {
            location.reload();
        }
    });
    request.send(null);
}

// Update row from table by passing data to be updated
function updatePark(currentElement) {
    let row = currentElement.parentNode.parentNode;
    let request = new XMLHttpRequest();
    let query = '';

    let parkID = row.children[0].textContent;
    let name = row.children[1].textContent;
    let state = row.children[2].textContent;
    let acreage = row.children[3].textContent;
    let capacity = row.children[4].textContent;

    query = 'parkID=' + parkID + '&' +
            'name=' + name + '&' +
            'state=' + state + '&' +
            'acreage=' + acreage + '&' +
            'capacity=' + capacity;

    request.open('PUT', '/parks/?' + query, true);
    request.addEventListener('load', function() {
        if(request.status >= 200 && request.status < 400) {
            location.reload();
        }
    });
    request.send(null);
}