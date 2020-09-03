function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for(var i in uiBathrooms) {
    if(uiBathrooms[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1;
}

function getBedValue() {
  var uiBedroom = document.getElementsByName("uiBathrooms");
  for(var i in uiBedroom) {
    if(uiBedroom[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1;
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  var sqft = document.getElementById("uiSqft");
  var bedrooms = getBedValue();
  var baths = getBathValue();
  var location = document.getElementById("uiLocations");
  var area = document.getElementById("uiAreaType");
  var estPrice = document.getElementById("uiEstimatedPrice");

  console.log(sqft.value, location.value,baths,area.value, bedrooms)

  var entry = {
      total_sqft: parseFloat(sqft.value),
      location: location.value,
      baths: baths,
      area_type: area.value,
      bedrooms: bedrooms
  }

  fetch('/predict_home_price', {
        method: 'POST',
        body : JSON.stringify(entry),
        headers: {
          "content-type": "application/json"
        }
      }).then(function(response){
        if (response.status !==200){
          console.log('There was a problem. Status code : ',response.status);
        }
        return response.json();
      }).then(function(data){
        console.log('POST response: ', data);
        estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
      console.log(status);
      })
    }

function onPageLoad() {
  console.log( "url document loaded ok" );

  fetch ('/locations')
      .then(function(response) {
           return response.json();
      }).then(function(data){
      console.log("successfuly got response for get_location_names request");
      if(data) {
          console.log('text locations are: ', data)
          var locations = data.locations;
          var uiLocations = document.getElementById("uiLocations");
          console.log(locations);
          $('#uiLocations').empty();
          for(var i in locations) {
              var opt = new Option(locations[i]);
              $('#uiLocations').append(opt);
          }
      }
  });
  
      fetch('/areas') 
          .then(function(response){
                return response.json();
          }).then(function(data){            
          console.log("successfully got response for get_areas_names request");
          if(data){
            var areas = data.areas;
            var uiAreaType = document.getElementById("uiAreaType");
            console.log(areas);
            $('#uiAreaType').empty();
            for (var i in areas){
              var opt = new Option(areas[i]);
              $('#uiAreaType').append(opt);
             }
          }
      });
    }

window.onload = onPageLoad;