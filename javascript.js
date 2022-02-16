var map = L.map('map').setView([47.55970409980519, -122.30477741762331], 15);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWZvb3RlIiwiYSI6ImNrNzJwbDNnMzA0dDEzbW9ua3V0dHVxajAifQ.FlxlFZJiRJyfh5eEwStItQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: '{Your Access Token Goes Here}'
}).addTo(map);

var drawnItems = L.featureGroup().addTo(map);

new L.Control.Draw({
    draw : {
        polygon : false,
        polyline : false,
        rectangle : false,     // Rectangles disabled
        circle : false,        // Circles disabled
        circlemarker : false,  // Circle markers disabled
        marker: true
    },
    edit : {
        featureGroup: drawnItems
    }
}).addTo(map);

function createFormPopup() {
    var popup =
        '<form>' +
        'Name:<br><input type="text" id="input_name"><br>' +
        'Content:<br><input type="text" id="input_content"><br>' +
        'Stock:<br><input type="text" id="input_stock"><br>' +
        'Craftsmanship:<br><input type="text" id="input_craft"><br>' +
        'ADA:<br><input type="text" id="input_ada"><br>' +
        '<input type="button" value="Submit" id="submit">' +
        '</form>'
    drawnItems.bindPopup(popup).openPopup();
}

map.addEventListener("draw:created", function(e) {
    e.layer.addTo(drawnItems);
    createFormPopup();
});

function setData(e) {
    if(e.target && e.target.id == "submit") {
        // Get user name and description
        var enteredName = document.getElementById("input_name").value;
        var enteredContent = document.getElementById("input_content").value;
        var enteredStock = document.getElementById("input_stock").value;
        var enteredCraft = document.getElementById("input_craft").value;
        var enteredAda = document.getElementById("input_ada").value;
        // Print user name and description
        console.log(enteredName);
        console.log(enteredContent);
        console.log(enteredStock);
        console.log(enteredCraft);
        console.log(enteredAda);
        // Get and print GeoJSON for each drawn layer
        drawnItems.eachLayer(function(layer) {
            var drawing = JSON.stringify(layer.toGeoJSON().geometry);
            console.log(drawing);
        });
        // Clear drawn items layer
        drawnItems.closePopup();
        drawnItems.clearLayers();
    }
}

document.addEventListener("click", setData);

map.addEventListener("draw:editstart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:deletestart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:editstop", function(e) {
    drawnItems.openPopup();
});
map.addEventListener("draw:deletestop", function(e) {
    if(drawnItems.getLayers().length > 0) {
        drawnItems.openPopup();
    }
});
