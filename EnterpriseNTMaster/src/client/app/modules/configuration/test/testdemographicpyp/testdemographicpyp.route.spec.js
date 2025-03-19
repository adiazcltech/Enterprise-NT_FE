/* jshint -W117, -W030 */
describe('testdemographicpypRoutes', function () {
    describe('state', function () {
        var view ='app/modules/configuration/test/testdemographicpyp/testdemographicpyp.html';

        beforeEach(function () {
            module('app.testdemographicpyp', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache', '$translate');
        });

        it('should map state testdemographicpyp to url /testdemographicpyp ', function () {
            expect($state.href('testdemographicpyp', {})).to.equal('/testdemographicpyp');
        });
        it('should map /testdemographicpyp route to testdemographicpyp View template', function () {
            expect($state.get('testdemographicpyp').templateUrl).to.equal(view);
        });
    });
});