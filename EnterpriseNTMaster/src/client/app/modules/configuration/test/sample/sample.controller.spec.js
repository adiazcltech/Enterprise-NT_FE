/* jshint -W117, -W030 */
describe('SampleController', function() {
  var controller;
  //var people = mockData.getMockPeople();

  beforeEach(function() {
    bard.appModule('app.sample');
    bard.inject('$controller',  '$q', '$rootScope','localStorageService','authService');
  });

  beforeEach(function() {

     sinon.stub(authService,'login').returns($q.when(
     localStorageService.set('Enterprise_NT.authorizationData', {
           authToken: 'eyJhbG',
           userName: 'DEV'
        })
     )); 
    controller = $controller('SampleController');

  });

  describe('sample controller', function() {
    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

  describe('after activate', function() {
     it('should have title of sample', function() {
       expect(controller.title).to.equal('Sample');
      });

    });
  });
});

