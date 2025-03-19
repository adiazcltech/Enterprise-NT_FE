/* jshint -W117, -W030 */
describe('serviceController', function () {
    var controller;

    beforeEach(function () {
        bard.appModule('app.service');
        bard.inject('$controller', '$log', '$q', '$rootScope', 'localStorageService', 'authService');
    });

    beforeEach(function () {

        sinon.stub(authService, 'login').returns($q.when(
        localStorageService.set('Enterprise_NT.authorizationData', {
            authToken: 'eyJhbG',
            userName: 'DEV'
        })
        ));
        controller = $controller('serviceController');

    });

    describe(' service controller', function () {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });
        describe('after activate', function () {
            it('should have title of service', function () {
                expect(controller.title).to.equal('Service');
            });
        });
    });
});
