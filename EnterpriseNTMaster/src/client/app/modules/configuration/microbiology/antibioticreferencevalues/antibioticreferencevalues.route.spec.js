/* jshint -W117, -W030 */
describe('antibiotic', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/microbiology/antibiotic/antibiotic.html';

        beforeEach(function () {
            module('app.antibiotic', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state antibiotic to url /antibiotic ', function () {
            expect($state.href('antibiotic', {})).to.equal('/antibiotic');
        });
        it('should map /antibiotic route to antibiotic View template', function () {
            expect($state.get('antibiotic').templateUrl).to.equal(view);
        });

    });
});
