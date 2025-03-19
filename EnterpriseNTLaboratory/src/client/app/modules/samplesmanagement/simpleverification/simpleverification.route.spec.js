/* jshint -W117, -W030 */
describe('simpleverificationRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/samplesmanagement/simpleverification/simpleverification.html';

        beforeEach(function () {
            module('app.simpleverification', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state simpleverification to url /simpleverification ', function () {
            expect($state.href('simpleverification', {})).to.equal('/simpleverification');
        });
        it('should map /simpleverification route to alarm View template', function () {
            expect($state.get('simpleverification').templateUrl).to.equal(view);
        });
    });
});  