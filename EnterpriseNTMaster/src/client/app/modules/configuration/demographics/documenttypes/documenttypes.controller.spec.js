/* jshint -W117, -W030 */
describe('RaceController', function() {
  var controller;
  //var people = mockData.getMockPeople();

  beforeEach(function() {
    bard.appModule('app.race');
    bard.inject('$controller',  '$q', '$rootScope','localStorageService','authService');
  });

  beforeEach(function() {

     sinon.stub(authService,'login').returns($q.when(
     localStorageService.set('Enterprise_NT.authorizationData', {
           authToken: 'eyJhbG',
           userName: 'DEV'
        })
     )); 
    controller = $controller('RaceController');

  });

  describe('race controller', function() {
    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

  describe('after activate', function() {
     it('should have title of race', function() {
       expect(controller.title).to.equal('Race');
      });

    });
  });
});

