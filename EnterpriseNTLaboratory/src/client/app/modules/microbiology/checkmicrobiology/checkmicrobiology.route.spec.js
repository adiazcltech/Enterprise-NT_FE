/* jshint -W117, -W030 */
describe('checkmicrobiology', function () {
    describe('state', function () {
        var view = 'app/modules/microbiology/checkmicrobiology/checkmicrobiology.html';

        beforeEach(function () {
            module('app.checkmicrobiology', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state alarm to url /checkmicrobiology ', function () {
            expect($state.href('checkmicrobiology', {})).to.equal('/checkmicrobiology');
        });
        it('should map /alarm route to alarm View template', function () {
            expect($state.get('checkmicrobiology').templateUrl).to.equal(view);
        });
    });
});
