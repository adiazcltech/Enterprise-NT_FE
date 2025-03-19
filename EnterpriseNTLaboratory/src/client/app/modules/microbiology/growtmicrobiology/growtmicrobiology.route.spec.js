/* jshint -W117, -W030 */
describe('growtmicrobiologyRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/microbiology/growtmicrobiology/growtmicrobiology.html';

        beforeEach(function () {
            module('app.growtmicrobiology', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /growtmicrobiology ', function () {
            expect($state.href('growtmicrobiology', {})).to.equal('/growtmicrobiology');
        });
        it('should map /growtmicrobiology route to hematologicalcounter View template', function () {
            expect($state.get('growtmicrobiology').templateUrl).to.equal(view);
        });
    });
});