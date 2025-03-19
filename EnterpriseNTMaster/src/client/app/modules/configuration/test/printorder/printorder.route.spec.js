/* jshint -W117, -W030 */
describe('laboratorytestRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/test/printorder/printorder.html';

        beforeEach(function () {
            module('app.printorder', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state printorder to url /printorder ', function () {
            expect($state.href('printorder', {})).to.equal('/printorder');
        });
        it('should map /printorder route to printorder View template', function () {
            expect($state.get('printorder').templateUrl).to.equal(view);
        });
    });
});