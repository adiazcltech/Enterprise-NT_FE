(function() {
  'use strict';

angular.module('app.widgets')
	   .directive('draggablebox', draggablebox)
  	   .directive('droppablebox', droppablebox);

function draggablebox() {
	var directive = {
		// templateUrl: 'app/widgets/drag.html',
	    link: drag
	};
	function drag(scope, element) {
	    // this gives us the native JS object
	    var el = element[0];
      scope.disabled = true;
	    el.draggable = true;
	    
	    el.addEventListener(
	      'dragstart',
	      function(e) {
	        e.dataTransfer.effectAllowed = 'move';
	        e.dataTransfer.setData('Text', this.id);
	        this.classList.add('drag');
	        this.classList.remove('animationItem');
	        this.classList.remove('itemSelected');
	        return false;
	    }, false);
	    
	    el.addEventListener(
	      'dragend',
	      function(e) {
	        this.classList.remove('drag');
	        this.classList.remove('animationItem');
	        this.classList.remove('itemSelected');
	        return false;
	    }, false);
	}	
    return directive;
};


function droppablebox() {
  var directive = {
    templateUrl: 'app/widgets/dragdrop-box.html',
    restrict: 'EA',
    scope: {
      drop: '&',
      bin: '=',
      disabled: '=?disabled',
      arraytest: '=arraytest'
     },
    link: drop
  };
  function drop(scope, element) {
      // again we need the native object
      var el = element[0];
        
        el.addEventListener(
        'dragover',
        function(e) { 
          e.dataTransfer.dropEffect = 'move';
          scope.arraytest = [{'codename': '', 'printOrder': 0}, {'codename': '', 'printOrder': 0}];  
          // allows us to drop this.children[1].children[0].id
          if (e.preventDefault) e.preventDefault();
          this.children[1].classList.add('over'); 
          var idItem = this.children[1].children[0].id;
          e.dataTransfer.setData('Text', idItem);
          return false;
        }, false);
      
      el.addEventListener(
        'dragenter',
        function(e) {
          this.children[1].classList.add('over');
          return false;
        });
      
      el.addEventListener(
        'dragleave',
        function(e) {
          this.children[1].classList.remove('over');
          return false;
        }, false);
      
      el.addEventListener(
        'drop',
        function(e) {
          // Stops some browsers from redirecting.
          if (e.stopPropagation) e.stopPropagation();
          scope.disabled = false;
          this.children[1].classList.remove('over');

          var binDestin = this.children[1] //El bin destino
          var itemDestin = document.getElementById(binDestin.id).lastChild;// El item destino

          var itemOrigin = document.getElementById(e.dataTransfer.getData('Text')); //El item origen
          var binOrigin = document.getElementById(itemOrigin.id).parentNode; //El bin origen
          
         // binOrigin.appendChild(itemDestin);
          //binDestin.appendChild(itemOrigin);
          document.getElementById("bin0").appendChild(itemOrigin);

          var orderDestin = parseInt(binDestin.id.replace('bin',''));
          var orderOrigin = parseInt(binOrigin.id.replace('bin',''));

         itemOrigin.classList.remove('itemSelected');
         itemDestin.classList.remove('itemSelected');

				 if (orderOrigin > orderDestin){
	 	        for(var i = orderOrigin ; i > orderDestin; i--){
		        	  var binOriginInx =  document.getElementById('bin' + (i - 1).toString());
		        	  var binDestinInx =  document.getElementById('bin' + i.toString());
                var itemOriginInx = document.getElementById(binOriginInx.id).lastChild;
                //var itemDestinInx = document.getElementById(binDestinInx.id).lastChild;
                binDestinInx.appendChild(itemOriginInx);
                itemOriginInx.classList.add('animationItem');
                itemOriginInx.classList.remove('itemSelected');
			      };	
				 }
				 else{
		 	        for(var i = orderOrigin ; i < orderDestin ; i++){
		        	  var binOriginInx =  document.getElementById('bin' + (i + 1).toString());
		        	  var binDestinInx =  document.getElementById('bin' + i.toString());
                var itemOriginInx = document.getElementById(binOriginInx.id).lastChild;
                //var itemDestinInx = document.getElementById(binDestinInx.id).lastChild;
                binDestinInx.appendChild(itemOriginInx);
                itemOriginInx.classList.add('animationItem');
                itemOriginInx.classList.remove('itemSelected');
			      };				 	
				 }
				binDestin.appendChild(itemOrigin);

      //     var binDestin = e.path[1];
      //     var item = document.getElementById(e.dataTransfer.getData('Text')); // 
      //     var binOrigin = document.getElementById(item.id).parentNode;
      //     var itemDestin = e.target; //  document.getElementById(binId).lastChild;
  		  // binOrigin.appendChild(itemDestin);        
           
      //     binDestin.appendChild(item);  

          //this.appendChild(item);
          //vm.bin.appendChild(itemDestin);

          //alert(' El objeto bin de origen es ' + e.dataTransfer.getData('Bin'));
          // call the passed drop function
          scope.$apply(function(scope) {
            var fn = scope.drop();
            if ('undefined' !== typeof fn) {            
              fn(itemOrigin.id, binDestin.id);
            }
          });
          return false;
        }, false);    	
  }  
  return directive;
};
})();
// app.controller('DragDropCtrl', function($scope) {
//   $scope.handleDrop = function(item, bin) {
//     //alert('Item ' + item + ' has been dropped into ' + bin);
//   }
// });