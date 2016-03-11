angular.module('myBeatApp', [])

.controller('mainCtrl', function($scope) {
    $scope.a = 1;
    $scope.b = 2;
    $scope.parts = ['Drum', 'Bass', 'Lead'];


})

.directive('header', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/templates/header.html',
    };
})

.directive('sequencer', function(){
	 return {
        restrict: 'E',
        templateUrl: '/js/templates/sequencer.html',
        scope: {
        	part: "="
        },
        link: function(scope) {
        	var matId = 'matrix' + scope.part;
        	scope.noteOptions = ['A','B','C','D','E','F','G'];

        	scope.notesInputs = [];

        	setTimeout(numberOfRows, 500);

        	scope.selectedANote = function (idx, note) {
        		selectedLeadNotes[idx] = note;
        	}

        	scope.selectedAnOption = function (idx, opt) {
        		selectedLeadOptions[idx] = opt;
        	}

     		function numberOfRows () {
     			for (var i = 0; i < window[matId].row; i++) {
     				addSelector();
     			}
     			scope.$digest();
     		}

     		function addSelector() {
     			scope.notesInputs.push('A1');
     		}

     		function removeSelector() {
     			scope.notesInputs.pop('A1');
     		}

	        scope.addRow = function () {
	        	console.log(selectedDrumSamples);
		        window[matId].row++;
		        window[matId].draw();
		        addSelector();
		    }

		    scope.removeRow = function () {
		        window[matId].row--;
		        window[matId].draw();
		        removeSelector();
		    }


        }
    };

})
