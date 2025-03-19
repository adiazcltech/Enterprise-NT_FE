/* jshint -W117, -W030 */
describe('BankController', function() {
  var controller;
  //var people = mockData.getMockPeople();

  beforeEach(function() {
    bard.appModule('app.bank');
    bard.inject('$controller', '$log', '$q', '$rootScope','localStorageService','authService');
  });

  beforeEach(function() {

     sinon.stub(authService,'login').returns($q.when(
     localStorageService.set('Enterprise_NT.authorizationData', {
          authToken: 'eyJhbG',
          userName: 'DEV'
        })
     )); 
    controller = $controller('BankController');

  });

  describe('bank controller', function() {
    it('should be created successfully', function() {
      expect(controller).to.be.defined;
    });

  describe('after activate', function() {
     it('should have title of bank', function() {
       expect(controller.title).to.equal('Bank');
      });

    });
  });
});
