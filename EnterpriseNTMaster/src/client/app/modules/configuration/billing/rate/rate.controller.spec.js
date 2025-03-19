/* jshint -W117, -W030 */
describe('RateController', function() {
  var controller;
  //var people = mockData.getMockPeople();

  beforeEach(function() {
    bard.appModule('app.rate');
    bard.inject('$controller',  '$q', '$rootScope','localStorageService','authService');
  });

  beforeEach(function() {

     sinon.stub(authService,'login').returns($q.when(
     localStorageService.set('Enterprise_NT.authorizationData', {
           authToken: 'eyJhbG',
            userName: 'DEV'
        })
     )); 
    controller = $controller('RateController');

  });

  describe('rate controller', function() {
    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

  describe('after activate', function() {
     it('should have title of rate', function() {
       expect(controller.title).to.equal('Rate');
      });

    });
  });
});
