/* jshint -W117, -W030 */
describe('AnatomicalsiteController', function() {
  var controller;
  //var people = mockData.getMockPeople();

  beforeEach(function() {
    bard.appModule('app.anatomicalsite');
    bard.inject('$controller', '$log', '$q', '$rootScope','localStorageService','authService');
  });

  beforeEach(function() {

     sinon.stub(authService,'login').returns($q.when(
     localStorageService.set('Enterprise_NT.authorizationData', {
          authToken: 'eyJhbG',
          userName: 'DEV'
        })
     )); 
    controller = $controller('AnatomicalsiteController');

  });

  describe('anatomicalsite controller', function() {
    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

  describe('after activate', function() {
     it('should have title of anatomicalsite', function() {
       expect(controller.title).to.equal('Anatomicalsite');
      });

    });
  });
});
