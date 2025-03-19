// module.exports = {
//   people: getPeople()
// };

// function getPeople() {
//   return [
//     { id: 1, firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida' },
//     { id: 2, firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California' },
//     { id: 3, firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York' },
//     { id: 4, firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota' },
//     { id: 5, firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota' },
//     { id: 6, firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina' },
//     { id: 7, firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming' },
//     { id: 8, firstName: 'Aaron', lastName: 'Jinglehiemer', age: 22, location: 'Utah' }
//   ];
// }

var request = require('request');

var data = {
   
  /**
     * Impresion de talon 
     * @param {*} Token
     * @param {*} URL del servicio
    */
  getTicket : function(token, url){
    console.log("Otra url: " + url);
    return new Promise(function (fulfill, reject){
          setTimeout(function() {
          request.get({
          url : url,
          headers : {"Authorization" : token},
        strictSSL: false,
        }, function(error, response, body) {
          var reportData = {};
              reportData.data = [];
              reportData.error = null;

            if (body !== null && body !== '') {
              try {
                JSON.parse(body).forEach(function (test, index) {
                      reportData.data.push({
                        "id": test.id,
                        "code": test.code,
                        "abbr": test.abbr,
                        "name": test.name,
                        "delivery": test.deliveryDays
                      });
                    });
            } 
            catch(e) {
              reportData.error = {
                'code': 3,
                'message': body
              } 
            }
            }
            else if(error !== null)
            {
              reportData.error = {
              'code': 4,
              'message': 'errorService'
            } 
            }

            fulfill(reportData);
            
      });}, 100);
      });
  },
  
  /**
    * Cambio de estado a impreso para informes y consultas.
    * @param {*} Token
    * @param json
  **/
  updatePrinter : function(token, url, json){
  console.log(JSON.stringify(json));
    return new Promise(function (fulfill, reject){
          setTimeout(function() {
          request.put({
            url : url,
            headers: { 'Authorization' : token, 'Content-Type' : 'application/json'},
      strictSSL: false,
            body: JSON.stringify(json)
          }, function(error, response, body) {
                var reportData = {};
                reportData.ok = null;
                reportData.error = null;
                try{
                    if (response.statusText == 'OK') {
                       reportData.ok = {
                                          'code': 200,
                                          'message': response.statusText
                                       }  
                    }else{
                       reportData.error = {
                                            'code': 4,
                                            'message': response
                                          }  
                    }                    
                  }catch(e){
                     reportData.error = {
                                          'code': 3,
                                          'message': e
                                        }    
                  }

                fulfill(reportData);
        });}, 100);
      });  
  }
}


module.exports = data;