var app = angular.module('myApp', ['ui.bootstrap']);
app.controller('fhhController', ['$rootScope','$scope','$window','$timeout','$modal', function ($rootScope,$scope,$window,$timeout,$modal) {
	$scope.personal_information = personal_information;
	$scope.openDiagramTable = function() {
		var modalInstance = $modal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'diagram_template.html',
			controller: 'tableController',
			size: 'lg',
			resolve: {
				pi: function () {

				return $scope.personal_information;
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

app.controller('tableController', ['$scope','$modalInstance', function ($scope,$modalInstance) {
	var STATICDISEASES = [
	    'SNOMED_CT-56265001',
	    'SNOMED_CT-116288000',
	    'SNOMED_CT-73211009',
	    'SNOMED_CT-363406005',
	    'SNOMED_CT-254837009',
	    'SNOMED_CT-363443007'
	]; 	

	$scope.translate = function(prefix,t_string) {
		if (prefix=="diseases") {
			return $.t(prefix+":"+t_string);
		}
		else {
			return $.t(prefix+"."+t_string);			
		}
	}	

	var getDiseases = function() {
		var dl = []
		for (key in STATICDISEASES) {
			d = STATICDISEASES[key];
			dl.push({'code':d,'translatedDiseaseName':$scope.translate("diseases",d)})
		}

		// for (key in disease_list) {
		// 	d = disease_list[key];
		// 	dl.push({'code':d.code,'translatedDiseaseName':$.t("diseases:"+d.system+"-"+d.code)})
		// }
		return dl;
	};

	$scope.personal_information = function() {
		var new_personal_information = [];
		for (x in personal_information) {
			var o = personal_information[x];
			if (o!=undefined) {
				if (o.gender!=undefined)
				{
					for (x in o['Health History']) {
					  console.log(o['Health History'][x])
					  if (STATICDISEASES.indexOf(o['Health History'][x]['Disease Code'])==-1) {
						  STATICDISEASES.push(o['Health History'][x]['Disease Code'])
					  }
					} 	
					new_personal_information.push(o);
				}
			}
		}

		return new_personal_information;
	}

	$scope.pi = $scope.personal_information();
	$scope.disease_list = getDiseases();
	$scope.translatedVariables = {'title':$scope.translate("fhh_family_pedigree","title"),'zoom_in': $scope.translate("fhh_family_pedigree","zoom_in"),'zoom_out':$scope.translate("fhh_family_pedigree","zoom_out"),'close':$scope.translate("fhh_family_pedigree","close"),'print':$scope.translate("fhh_family_pedigree","print"),'desc_1':$scope.translate("fhh_family_pedigree","desc_line1"),'desc_2':$scope.translate("fhh_family_pedigree","desc_line2"),'diagram_table_options':$scope.translate("fhh_family_pedigree","diagram_options"),'save_image':$scope.translate("fhh_family_pedigree","save_image")}
	$scope.table = $scope.personal_information;
	$scope.ok = function () {
		$modalInstance.close();
		console.log($scope.personal_information);
		$("#optionsPanelMain").dialog('destroy').remove()
	};
}]);