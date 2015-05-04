var app = angular.module('myApp', ['ui.bootstrap']);
app.controller('fhhController', ['$rootScope','$scope','$window','$timeout','$modal', function ($rootScope,$scope,$window,$timeout,$modal) {
	$scope.openDiagramTable = function() {
		var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'diagram_template.html',
			controller: 'tableController',
			size: 'lg',
			resolve: {
				personal_information: function () {

				return $window.personal_information;
				}
			}
		});
		modalInstance.opened.then(function() {
			$scope.$watch($(".modal-body"), function() {
				$timeout(function() {
					load_diagram();
				});  
	    		}) 
		});
	    modalInstance.result.then(function () {
	    }, 
	    function () {
	          $("#optionsPanelMain").dialog('destroy').remove()
	    });
	};

}]);

app.controller('tableController', ['$rootScope','$scope','$window','$modalInstance','$timeout', function ($rootScope,$scope,$window,$modalInstance,$timeout, personal_information) {
	$scope.personal_information = personal_information;
	$scope.translatedVariables = {'title':$.t("fhh_family_pedigree.title"),'zoom_in': $.t("fhh_family_pedigree.zoom_in"),'zoom_out':$.t("fhh_family_pedigree.zoom_out"),'close':$.t("fhh_family_pedigree.close"),'print':$.t("fhh_family_pedigree.print"),'desc_1':$.t("fhh_family_pedigree.desc_line1"),'desc_2':$.t("fhh_family_pedigree.desc_line2"),'diagram_table_options':$.t("fhh_family_pedigree.diagram_options")}

	$scope.ok = function () {
		$modalInstance.close();
		$("#optionsPanelMain").dialog('destroy').remove()
	};
}]);