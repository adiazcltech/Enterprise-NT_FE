/* jshint ignore:start */
(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('fileimg', fileimg);
   

  fileimg.$inject = ['$q'];


  /* @ngInject */
  function fileimg($q) {
    var directive = {
      templateUrl: 'app/widgets/fileimg.html',
      restrict: 'EA',
      scope: {
        disable:'=?disable',
        model: '=ngModel',
        width: '=width',
        height: '=height'
      },
      controller: ['$scope', function($scope) {
        var vm = this;
        vm.typeIncorrect = false;
        vm.disabled = $scope.disable;
        vm.width = $scope.width + 'px';
        vm.height = $scope.height + 'px';
        vm.files = {
            'filetype': 'image/jpeg',
            'base64': 'iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAMFBMVEX////a2tr7+/vc3Nzm5ubi4uLt7e3p6enf39/39/fb29vj4+PX19f09PTv7+/5+fkmqaC1AAADZklEQVR4nO3a7XqiMBCGYQIIEUI8/7Ndhg9NIlqFVpbxuf/stt3uRV5hmAlkGQAAAAAAAAAAAAAAAAAAAAAAAADFyuqy9yHszjhjS5/vfRh76ozoc6i7r82hNjPXnKrz3oezi8KEXNH6rysPuay8apsgBvdt5cH3qy76P8/VyUQ51N3eh/YxZb/idvp7VxfOBTl8S3mQxfrbl3lXNmEOptV/WVxkvckqc9+a8HRoSt13TSkHduH7Uh5uOfQlQ3F5aPv1lQ9+1tXWhTloLQ/9Gt2TTzj3ZZCDM3338Llj+5CzZPDDxX7xbRGcDuo6KG+tfXQphPry0Iw5LBWPr5F3w2RR730cG1WnO23v/ruz5Coxz4vHIZRhlX9BUilkyi6O3imU70WQZiDXQvvgvz6MjRnIlF3tdOi/RjI4+eo1dxnkch89fJckGbxc1+86B+/GKfvYtmUQTtnHtS0DE0/ZB7Upg8sLbfUBbMpAyoGCRnlTBu07v/z/CjOoi+b5sJRmYBQ0ylmUQS1t8yn9B+GakwzOC5tuR3TLIB+frCR7AV14ZiQZVEuZHdBdBknXV7jgiyQDq6MchNdCK6d20vXVLrz/JxmoaJSzKIP81N/p4jWd45tfnEEnmX3iGP9adG+8pJ+qnO3BRx1noGJuFov9QTmNw8OdIthnjzOwKhrlbDmDs3NDCN20x3T9QZTBMDer2FFeyqC/QQwh2Gnb5LpJEmXgtZSDpQwqNy68nrcar1UxyqA0jx9HHUuUwbikcemuve2fzf1wlEGhpRxEGXgnn3j43sVk/rjDDF55HHUQYQZWTvu5EEamtYbLru4bqqMKMhiKnC0WIpirYpiBkrlZBBnYhdXHVTHIIJc3thTMzeKWgX/yxGmqimMG9uQv49y854H/olsGSxfBNYOxJx4zKOQNVmtUbKMNrhl09pnxUeucweTwD5gmK/YTrxlomJvFhgyavzyuT9qQgYq5WbyVgYky0NEoZ2MGxdNyGIgz0FIO1rx/MGWgpFHOtmSgY24WqzNQMjeL1Rk0OuZmsSKDcbbS0ihnGzJQMjeLNdfCMGAqmZvFigy62hqnqBysfD8x94ouha3vaKpABmQgyCDL6qZ4i4b3jwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+EX/AAuLG/hEM34LAAAAAElFTkSuQmCC'
        };
        
        vm.styleButton = { 'width': $scope.width - 7 + 'px' };



        $scope.$watch('disable', function() {
          vm.disabled = $scope.disable;
          vm.typeIncorrect = false;
        });

        $scope.$watch('model', function() {
          if ($scope.model === undefined || $scope.model === '' ) {
              vm.files = {
                'filetype': 'image/jpeg',
                'base64': 'iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAMFBMVEX////a2tr7+/vc3Nzm5ubi4uLt7e3p6enf39/39/fb29vj4+PX19f09PTv7+/5+fkmqaC1AAADZklEQVR4nO3a7XqiMBCGYQIIEUI8/7Ndhg9NIlqFVpbxuf/stt3uRV5hmAlkGQAAAAAAAAAAAAAAAAAAAAAAAADFyuqy9yHszjhjS5/vfRh76ozoc6i7r82hNjPXnKrz3oezi8KEXNH6rysPuay8apsgBvdt5cH3qy76P8/VyUQ51N3eh/YxZb/idvp7VxfOBTl8S3mQxfrbl3lXNmEOptV/WVxkvckqc9+a8HRoSt13TSkHduH7Uh5uOfQlQ3F5aPv1lQ9+1tXWhTloLQ/9Gt2TTzj3ZZCDM3338Llj+5CzZPDDxX7xbRGcDuo6KG+tfXQphPry0Iw5LBWPr5F3w2RR730cG1WnO23v/ruz5Coxz4vHIZRhlX9BUilkyi6O3imU70WQZiDXQvvgvz6MjRnIlF3tdOi/RjI4+eo1dxnkch89fJckGbxc1+86B+/GKfvYtmUQTtnHtS0DE0/ZB7Upg8sLbfUBbMpAyoGCRnlTBu07v/z/CjOoi+b5sJRmYBQ0ylmUQS1t8yn9B+GakwzOC5tuR3TLIB+frCR7AV14ZiQZVEuZHdBdBknXV7jgiyQDq6MchNdCK6d20vXVLrz/JxmoaJSzKIP81N/p4jWd45tfnEEnmX3iGP9adG+8pJ+qnO3BRx1noGJuFov9QTmNw8OdIthnjzOwKhrlbDmDs3NDCN20x3T9QZTBMDer2FFeyqC/QQwh2Gnb5LpJEmXgtZSDpQwqNy68nrcar1UxyqA0jx9HHUuUwbikcemuve2fzf1wlEGhpRxEGXgnn3j43sVk/rjDDF55HHUQYQZWTvu5EEamtYbLru4bqqMKMhiKnC0WIpirYpiBkrlZBBnYhdXHVTHIIJc3thTMzeKWgX/yxGmqimMG9uQv49y854H/olsGSxfBNYOxJx4zKOQNVmtUbKMNrhl09pnxUeucweTwD5gmK/YTrxlomJvFhgyavzyuT9qQgYq5WbyVgYky0NEoZ2MGxdNyGIgz0FIO1rx/MGWgpFHOtmSgY24WqzNQMjeL1Rk0OuZmsSKDcbbS0ihnGzJQMjeLNdfCMGAqmZvFigy62hqnqBysfD8x94ouha3vaKpABmQgyCDL6qZ4i4b3jwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+EX/AAuLG/hEM34LAAAAAElFTkSuQmCC'
              };
          }
          else{
            vm.files = {
              'filetype': 'image/jpeg',
              'base64': $scope.model
            };
          }

          if ($scope.model === undefined &&  vm.typeIncorrect) {
            vm.typeIncorrect = false;
          }
        });


       
        vm.resizeImage = function( file, base64 ) {
            var type = file.type.split('/');
            vm.typeIncorrect = false;
            if (type[0] === 'image' ) {
              if (type[1] === 'jpeg' || type[1] === 'png') {
                  var deferred = $q.defer();
                  var img = document.createElement('img');
                  var maxW=100;
                  var maxH=100;

                 img.onload = function() {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    
                    var iw=img.width;
                    var ih=img.height;
                    var scale=Math.min((maxW/iw),(maxH/ih));
                    var iwScaled=iw*scale;
                    var ihScaled=ih*scale;
                    canvas.width=iwScaled;
                    canvas.height=ihScaled;
                    ctx.drawImage(this,0,0,iwScaled,ihScaled);
                    var URL = canvas.toDataURL().split(',');
                    base64.base64 = URL[1];
                    deferred.resolve(base64);            
                  };
                  img.src = 'data:'+base64.filetype+';base64,'+base64.base64;
                  $scope.model = base64.base64;
                  return deferred.promise; 
                  }
              else {
                $scope.model = '';
                vm.typeIncorrect = true;
              }    
            }
            else {
                  $scope.model = '';
                  vm.typeIncorrect = true;
                } 
        };

      }],
      controllerAs: 'fileImage'
    };


    return directive;

   
  }
})();
/* jshint ignore:end */