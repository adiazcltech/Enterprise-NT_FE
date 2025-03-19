/* jshint -W117, -W030 */
describe('samplingSitesController', function () {

  var controller;
  //var people = mockData.getMockPeople();

  beforeEach(function () {
    bard.appModule('app.samplingSites');
    bard.inject('$controller', '$log', '$q', '$rootScope', 'localStorageService', 'authService');
  });

  beforeEach(function () {
    sinon.stub(authService, 'login').returns($q.when(
      localStorageService.set('Enterprise_NT.authorizationData', {
        authToken: 'eyJhbG',
        userName: 'DEV'
      })
    ));
    controller = $controller('samplingSitesController');
  });

  describe('samplingSites controller', function () {
    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    describe('after activate', function () {
      it('should have title of samplingSites', function () {
        expect(controller.title).to.equal('samplingSites');
      });

    });
  });

});
