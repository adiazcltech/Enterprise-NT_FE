/* jshint -W117, -W030 */
describe('standarizationRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/integration/standarization/standarization.html';

        beforeEach(function () {
            module('app.standarization', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state standarization to url /standarization ', function () {
            expect($state.href('standarization', {})).to.equal('/standarization');
        });
        it('should map /standarization route to standarization View template', function () {
            expect($state.get('standarization').templateUrl).to.equal(view);
        });
    });
});