/* jshint -W117, -W030 */
describe('commentRoutes', function() {
  describe('state', function() {
    var view = 'app/modules/configuration/test/comment/comment.html';

    beforeEach(function() {
      module('app.comment', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache','$translate');
    });

    it('should map state comment to url /comment ', function() {
      expect($state.href('comment', {})).to.equal('/comment');
    });
    it('should map /comment route to area View template', function() {
      expect($state.get('comment').templateUrl).to.equal(view);
    });
     
  });
});
