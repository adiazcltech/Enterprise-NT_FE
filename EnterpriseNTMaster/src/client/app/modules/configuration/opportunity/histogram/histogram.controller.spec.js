/* jshint -W117, -W030 */
describe('histogramController', function() {
  var controller;
  //var people = mockData.getMockPeople();

  beforeEach(function() {
    bard.appModule('app.histogram');
    bard.inject('$controller', '$log', '$q', '$rootScope', 'containerDS','localStorageService','authService');
  });

  beforeEach(function() {

     sinon.stub(authService,'login').returns($q.when(
     localStorageService.set('Enterprise_NT.authorizationData', {
          authToken: 'eyJhbG',       
          userName: 'DEV'
        })
     )); 

    controller = $controller('histogramController');

  });

  describe('Container controller', function() {
    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

  describe('after activate', function() {
     it('should have title of histogram', function() {
       expect(controller.title).to.equal('histogram');
      });

    });
  });
});