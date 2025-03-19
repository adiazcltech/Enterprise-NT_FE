/* jshint -W117, -W030 */
describe('menuMasterController', function() {
  var controller;
  beforeEach(function() {
    bard.appModule('app.menuMaster');
    bard.inject('$controller', '$log', '$q', '$rootScope','localStorageService','authService');
  });

  beforeEach(function() {

     sinon.stub(authService,'login').returns($q.when(
     localStorageService.set('Enterprise_NT.authorizationData', {
         authToken: 'eyJhbG',
         userName: 'DEV'
        })
     )); 
    controller = $controller('menuMasterController');

  });


});
