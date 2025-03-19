/* jshint -W117, -W030 */
describe('completeverifyRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/samplesmanagement/completeverify/completeverify.html';

        beforeEach(function () {
            module('app.completeverify', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state completeverify to url /completeverify ', function () {
            expect($state.href('completeverify', {})).to.equal('/completeverify');
        });
        it('should map /completeverify route to alarm View template', function () {
            expect($state.get('completeverify').templateUrl).to.equal(view);
        });
    });
});