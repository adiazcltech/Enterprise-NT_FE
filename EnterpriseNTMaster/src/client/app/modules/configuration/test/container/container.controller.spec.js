/* jshint -W117, -W030 */
describe('ContainerController', function() {
  var controller;
  //var people = mockData.getMockPeople();

  beforeEach(function() {
    bard.appModule('app.container');
    bard.inject('$controller', '$log', '$q', '$rootScope', 'containerDS','localStorageService','authService');
  });

  beforeEach(function() {

     sinon.stub(authService,'login').returns($q.when(
     localStorageService.set('Enterprise_NT.authorizationData', {
           authToken: 'eyJhbG',
           userName: 'DEV'
        })
     )); 

    controller = $controller('ContainerController');

  });

  describe('Container controller', function() {
    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

  describe('after activate', function() {
     it('should have title of Area', function() {
       expect(controller.title).to.equal('Container');
      });

    });
  });
});
