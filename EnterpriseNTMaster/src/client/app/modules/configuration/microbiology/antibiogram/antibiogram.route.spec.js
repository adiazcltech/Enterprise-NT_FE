/* jshint -W117, -W030 */
describe('antibiogramRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/microbiology/antibiogram/antibiogram.html';

        beforeEach(function () {
            module('app.antibiogram', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state antibiogram to url /antibiogram ', function () {
            expect($state.href('antibiogram', {})).to.equal('/antibiogram');
        });
        it('should map /antibiogram route to antibiogram View template', function () {
            expect($state.get('antibiogram').templateUrl).to.equal(view);
        });
    });
});