/* jshint -W117, -W030 */
describe('LaboratoryController', function() {
  var controller;
  //var people = mockData.getMockPeople();

  beforeEach(function() {
    bard.appModule('app.laboratory');
    bard.inject('$controller',  '$q', '$rootScope','localStorageService','authService');
  });

  beforeEach(function() {

     sinon.stub(authService,'login').returns($q.when(
     localStorageService.set('Enterprise_NT.authorizationData', {
           authToken: 'eyJhbG',
           userName: 'DEV'
        })
     )); 
    controller = $controller('LaboratoryController');

  });

  describe('laboratory controller', function() {
    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

  describe('after activate', function() {
     it('should have title of laboratory', function() {
       expect(controller.title).to.equal('Laboratory');
      });

    });
  });
});
