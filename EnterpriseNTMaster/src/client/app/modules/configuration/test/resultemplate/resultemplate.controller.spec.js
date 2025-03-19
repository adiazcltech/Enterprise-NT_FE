/* jshint -W117, -W030 */
describe('ResultTemplateController', function () {
    var controller;

    beforeEach(function () {
        bard.appModule('app.resultemplate');
        bard.inject('$controller', '$log', '$q', '$rootScope', 'localStorageService', 'authService');
    });

    beforeEach(function () {

        sinon.stub(authService, 'login').returns($q.when(
        localStorageService.set('Enterprise_NT.authorizationData', {
            authToken: 'eyJhbG',
            userName: 'DEV'
        })
        ));
        controller = $controller('ResultTemplateController');

    });

    describe(' resultemplate controller', function () {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });
        describe('after activate', function () {
            it('should have title of resultemplate', function () {
                expect(controller.title).to.equal('ResultTemplate');
            });
        });
    });
});

