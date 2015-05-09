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
	var STATICDISEASES = ['SNOMED_CT-56265001','SNOMED_CT-116288000','SNOMED_CT-73211009','SNOMED_CT-363406005','SNOMED_CT-254837009','SNOMED_CT-363443007']; 	

	// funtion to translate items //
	$scope.translate = function(prefix,t_string) {
		if (prefix=="diseases") {
			return $.t(prefix+":"+t_string);
		}
		else {
			return $.t(prefix+"."+t_string);			
		}
	}	

	// calculates age based on date of birth //
	$scope.calculateAge = function calculateAge(birthday) { // birthday is a date
		var birthday = new Date(birthday);
		var ageDifMs = Date.now() - birthday.getTime();
		var ageDate = new Date(ageDifMs); // miliseconds from epoch
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	};	

	$scope.calculate_bmi = function(w,h) {
	    var finalBmi=0;
	    var weight = w;
	    var height = h;
	    if(weight > 0 && height > 0) {
	        var height2 = height / 100
	        var BMI = weight / (height2 * height2)
	        finalBmi = (Math.round(BMI*Math.pow(10,2)))/Math.pow(10,2)
	    }
	    return finalBmi.toFixed(2);
	}

	$scope.calculcate_report_date = function() {

		var lng = window.i18n.lng();
		if (lng=='en-US') {
		   lng = 'en';
		};  		
		var options = {weekday: "long", year: "numeric", month: "long", day: "numeric", hour:"numeric",minute:"numeric",hour12:"true"};             
		var today = $.t("fhh_family_pedigree.date_of_report") + ": " + new Date().toLocaleString(lng, options);		
		return today
	};

	// creates javascript object of static diseases, including their translated names // 
	var getDiseases = function() {
		var dl = []
		for (key in STATICDISEASES) {
			d = STATICDISEASES[key];
			dl.push({'code':d,'translatedDiseaseName':$scope.translate("diseases",d)})
		}
		return dl;
	};

	// loop through personal information //
	// create list containing personal information records and retrieving other diseases not in static list //
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
	};

	$scope.pi = $scope.personal_information(); // set pi to personal information function //
	$scope.self_history = personal_information;
	$scope.disease_list = getDiseases();
	// $scope.translatedVariables = {'title':$scope.translate("fhh_family_pedigree","title"),'zoom_in': $scope.translate("fhh_family_pedigree","zoom_in"),'zoom_out':$scope.translate("fhh_family_pedigree","zoom_out"),'close':$scope.translate("fhh_family_pedigree","close"),'print':$scope.translate("fhh_family_pedigree","print"),'desc_1':$scope.translate("fhh_family_pedigree","desc_line1"),'desc_2':$scope.translate("fhh_family_pedigree","desc_line2"),'diagram_table_options':$scope.translate("fhh_family_pedigree","diagram_options"),'save_image':$scope.translate("fhh_family_pedigree","save_image"),'my_personal_information':}
	$scope.ok = function () {
		$modalInstance.close();
		console.log($scope.personal_information);
		$("#optionsPanelMain").dialog('destroy').remove()
	};
}]);