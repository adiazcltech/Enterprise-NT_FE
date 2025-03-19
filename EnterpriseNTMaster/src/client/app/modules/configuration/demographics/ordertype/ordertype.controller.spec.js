/* jshint -W117, -W030 */
describe('OrdertypeController', function() {
  var controller;
  //var people = mockData.getMockPeople();

  beforeEach(function() {
    bard.appModule('app.ordertype');
    bard.inject('$controller', '$log', '$q', '$rootScope', 'unitDS','localStorageService','authService');
  });

  beforeEach(function() {

     sinon.stub(authService,'login').returns($q.when(
     localStorageService.set('Enterprise_NT.authorizationData', {
           authToken: 'eyJhbG',
           userName: 'DEV'
        })
     )); 
    controller = $controller('OrdertypeController');

  });

  describe('ordertype controller', function() {
    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

  describe('after activate', function() {
     it('should have title of ordertype', function() {
       expect(controller.title).to.equal('Ordertype');
      });

    });
  });
});
