/* jshint -W117, -W030 */
describe('excludetestsbydemographicsRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/test/excludetestsbydemographics/excludetestsbydemographics.html';

        beforeEach(function () {
            module('app.excludetestsbydemographics', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state excludetestsbydemographics to url /excludetestsbydemographics ', function () {
            expect($state.href('excludetestsbydemographics', {})).to.equal('/excludetestsbydemographics');
        });
        it('should map /excludetestsbydemographics route to excludetestsbydemographics View template', function () {
            expect($state.get('excludetestsbydemographics').templateUrl).to.equal(view);
        });
    });
});