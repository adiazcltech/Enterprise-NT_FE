/* jshint -W117, -W030 */
describe('requirementRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/configuration/test/requirement/requirement.html';

        beforeEach(function () {
            module('app.requirement', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state requirement to url /requirement ', function () {
            expect($state.href('requirement', {})).to.equal('/requirement');
        });
        it('should map /requirement route to requirement View template', function () {
            expect($state.get('requirement').templateUrl).to.equal(view);
        });
    });
});