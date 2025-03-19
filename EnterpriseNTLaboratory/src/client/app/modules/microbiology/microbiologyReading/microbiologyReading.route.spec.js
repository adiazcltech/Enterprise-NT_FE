/* jshint -W117, -W030 */
describe('growtmicrobiologyRoutes', function () {
    describe('state', function () {
        var view = 'app/modules/microbiology/microbiologyReading/microbiologyReading.html';

        beforeEach(function () {
            module('app.microbiologyReading', bard.fakeToastr);
            bard.inject('$state');
        });

        it('should map state hematologicalcounter to url /microbiologyReading ', function () {
            expect($state.href('microbiologyReading', {})).to.equal('/microbiologyReading');
        });
        it('should map /microbiologyReading route to hematologicalcounter View template', function () {
            expect($state.get('microbiologyReading').templateUrl).to.equal(view);
        });
    });
}); 