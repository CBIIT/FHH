var app = angular.module('myApp', ['ui.bootstrap']);
app.controller('fhhController', ['$rootScope', '$scope', '$window', '$timeout', '$modal', function($rootScope, $scope, $window, $timeout, $modal) {
    $scope.personal_information = personal_information;
    $scope.openDiagramTable = function() {
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'diagram_template.html',
            controller: 'tableController',
            size: 'lg',
            resolve: {
                pi: function() {

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
        modalInstance.result.then(function() {},
            function() {
                $("#optionsPanelMain").dialog('destroy').remove()
            });
    };

}]);

app.controller('tableController', ['$scope', '$modalInstance', '$timeout', function($scope, $modalInstance, $timeout) {
    var initialDiseases = ['SNOMED_CT-56265001', 'SNOMED_CT-116288000', 'SNOMED_CT-73211009', 'SNOMED_CT-363406005', 'SNOMED_CT-254837009', 'SNOMED_CT-363443007'];
    var STATICDISEASES = ['SNOMED_CT-56265001', 'SNOMED_CT-116288000', 'SNOMED_CT-73211009', 'SNOMED_CT-363406005', 'SNOMED_CT-254837009', 'SNOMED_CT-363443007'];
    // funtion to translate items //
    $scope.translate = function(prefix, t_string) {
        if (prefix == "diseases") {
            return $.t(prefix + ":" + t_string);
        } else {
            return $.t(prefix + "." + t_string);
        }
    };
    $scope.exportToExcel = function() {
        var dl = $scope.disease_list.length;
        var pl = $scope.pi.length;

        var excelString = '"' + $scope.translate("fhh_js","name_relationship") + '","' + $scope.translate("fhh_js","still_living") + '",';
        for (key in $scope.disease_list) {
            var k = parseInt(key) + 1;
            excelString += '"' + $scope.disease_list[key]['translatedDiseaseName'] + '"'
            if (k < dl) excelString += ",";
            if (k == dl) excelString += "\n";
        }

        for (record in $scope.pi) {
            var r = $scope.pi[record];
            var pr = parseInt(record) + 1;
            if (r['name']!='') {
	            excelString += '"' + r['name'] + '\n' + '('+r['relationship']+')' + '",'
            }
            else {
            	excelString += '"' + r['relationship'] + '",'
            }
            excelString += '"' + r['is_alive'] + '",'
            for (col in $scope.disease_list) {
                var k = parseInt(col) + 1;
                excelString += '"' + $scope.lookupDisease(r, $scope.disease_list[col]['code'], true) + '"'
                col = "";

                if (k < dl) excelString += ',';
            }
            if (pr != pl) {
                excelString += "\n";
            }
        };
        var WindowObject = window.open("", "CSV Export",
        "width=800,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
        var directions ='<ol><li>' + $scope.translate("fhh_family_pedigree","csv_line1") + '</li>';
        directions+='<li>' + $scope.translate("fhh_family_pedigree","csv_line2") + '</li>';
        directions+='<li>' + $scope.translate("fhh_family_pedigree","csv_line3") + '</li>';
        directions+='<li>' + $scope.translate("fhh_family_pedigree","csv_line4") + '</li>';
        directions+='<li>' + $scope.translate("fhh_family_pedigree","csv_line5") + '</li>';
        directions+='<li>' + $scope.translate("fhh_family_pedigree","csv_line6") + '</li>';
        directions+='<li>' + $scope.translate("fhh_family_pedigree","csv_line7") + '</li></ol>';

        WindowObject.document.writeln('<html><head></head><body><div style="padding-left:10px;"><B>' + directions + '</B><pre>' + excelString + '</pre></body></html>');

    }

    $scope.collapse_status = {
        'isCollapsed': false,
        'collapse_text': $scope.translate("fhh_family_pedigree", "collapse_table")
    };

    // get language for legend key //
    $scope.lng = window.i18n.lng();
    if ($scope.lng == 'en-US') {
        $scope.lng = 'en';
    };

    // collapse dynamic diseases into one column //
    $scope.collapseTable = function() {
        if ($scope.collapse_status.isCollapsed) {
            $scope.collapse_status.isCollapsed = false;
            $scope.collapse_status.collapse_text = $scope.translate("fhh_family_pedigree", "collapse_table");
        } else {
            $scope.collapse_status.isCollapsed = true;
            $scope.collapse_status.collapse_text = $scope.translate("fhh_family_pedigree", "expand_table");
        }
        $scope.disease_list = getDiseases();
    };



    // calculates age based on date of birth //
    $scope.calculateAge = function calculateAge(birthday) { // birthday is a date
        var birthday = new Date(birthday);
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    // this needs fixed //
    $scope.calculate_bmi = function(w, h) {
        var finalBmi = 0;
        var weight = w;
        var height = h;
        if (weight > 0 && height > 0) {
            var height2 = height / 100
            var BMI = weight / (height2 * height2)
            finalBmi = (Math.round(BMI * Math.pow(10, 2))) / Math.pow(10, 2)
        }
        return finalBmi.toFixed(2);
    }

    // calculates report date in the correct language //
    $scope.calculcate_report_date = function() {
        var options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: "true"
        };
        var today = $.t("fhh_family_pedigree.date_of_report") + ": " + new Date().toLocaleString($scope.lng, options);
        return today
    };

    // creates javascript object of static diseases, including their translated names // 
    var getDiseases = function() {
        var dl = [];
        var otherDiseases = false;
        console.log($scope.collapse_status)
        for (key in STATICDISEASES) {
            if ($scope.collapse_status.isCollapsed) { // table has been collapsed
                if (initialDiseases.indexOf(STATICDISEASES[key]) > -1) { // create normal disease column
                    d = STATICDISEASES[key];
                    dl.push({
                        'code': d,
                        'translatedDiseaseName': $scope.translate("diseases", d),
                        'show': true
                    })
                } else {
                    if (!otherDiseases) {
                        dl.push({
                            'code': '1',
                            'translatedDiseaseName': $scope.translate("fhh_family_pedigree", "other_disease"),
                            'show': true
                        });
                        otherDiseases = true;
                    }
                }
            } else {
                d = STATICDISEASES[key];
                dl.push({
                    'code': d,
                    'translatedDiseaseName': $scope.translate("diseases", d),
                    'show': true
                })
            }
        }
        return dl;
    };

    // loop through personal information //
    // create list containing personal information records and retrieving other diseases not in static list //
    $scope.personal_information = function() {
        var new_personal_information = [];
        var pi = personal_information;
        var self_health_history = $scope.createHealthHistory([], [], pi['Health History'])
        new_personal_information.push({
            'name': pi.name,
            'gender': pi.gender,
            'relationship': $scope.translate("fhh_js", "self"),
            'is_alive': $scope.translate("fhh_family_pedigree", "alive"),
            'Health History': self_health_history.health_history,
            'health_code_lookup': self_health_history.health_code_lookup
        })
        for (x in personal_information) {
            var o = personal_information[x];
            if (o != undefined) {
                if (o.gender != undefined) {
                    var person_dict = {};
                    var health_history = [];
                    var health_code_lookup = [];
                    person_dict["is_alive"] = $scope.translate("fhh_family_pedigree", o.is_alive);
                    person_dict["name"] = o.name;
                    person_dict["relationship"] = $scope.translate("fhh_family_pedigree", o.relationship);
                    if (o.cause_of_death_code) {
                        person_dict['cause_of_death'] = $scope.translate("diseases", o.cause_of_death_code)
                        person_dict['estimated_death_age'] = $scope.translate("fhh_js", o.estimated_death_age)
                    }
                    var hh = $scope.createHealthHistory(health_history, health_code_lookup, o['Health History'])
                    person_dict['Health History'] = hh.health_history;
                    person_dict['health_code_lookup'] = hh.health_code_lookup;
                    new_personal_information.push(person_dict)
                }
            }
        }
        return new_personal_information;
    };

    // creates health history for individuals. Also adds diseases to STATIC list that dont already exist //
    $scope.createHealthHistory = function(health_history, health_code_lookup, history) {
        for (x in history) {
            var health_history_entry = {};
            health_history_entry["Disease Code"] = history[x]['Disease Code'];
            health_code_lookup.push(history[x]['Disease Code']);
            health_history_entry["Age At Diagnosis"] = $scope.translate("fhh_js", history[x]['Age At Diagnosis']);
            health_history_entry["translatedDiseaseName"] = $scope.translate("diseases", history[x]['Disease Code']);
            if (STATICDISEASES.indexOf(history[x]['Disease Code']) == -1) {
                STATICDISEASES.push(history[x]['Disease Code'])
                health_history_entry["isOther"] = true;
            }
            health_history.push(health_history_entry)
        }
        return {
            'health_history': health_history,
            'health_code_lookup': health_code_lookup
        }
    };

    // looks up if health record(hr) has particular disease code(dc) for table column //
    $scope.lookupDisease = function(hr, dc, diagram) {
        disease_is_true = hr.health_code_lookup.indexOf(dc)
        if (disease_is_true > -1) {
            if (diagram) {
                return hr['Health History'][disease_is_true]['Age At Diagnosis']
            } else {
                return hr['Health History'][disease_is_true]
            }
        }
        return "";
    };

    // define personal information, self and disease list variables //
    $scope.pi = $scope.personal_information(); // set pi to personal information function //
    $scope.self_history = personal_information;
    $scope.disease_list = getDiseases();

    // hide disease in table when clicking the X icon //
    $scope.removeDisease = function(d) {
        d.show = false;
    };

    // show disease in table when clicking the + icon //
    $scope.showDisease = function(d) {
        d.show = true;
    };

    // print table using gojs and converting to an image //
    $scope.print = function(print) {
        $scope.diagram_show = true;
        if (!$scope.diagram) {
            $timeout(function() {
                $scope.displayHiddenDiagram();
            });
        };
        $timeout(function() {
            var i = $scope.diagram.makeImageData();
            $scope.diagram_show = false;

            var WindowObject = window.open("", "Table",
                "width=" + $("table.health_table").width() + ",height=" + parseInt($("table.health_table").height())+5 + ",top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
            WindowObject.document.writeln('<html><head></head><body><div style="padding-left:10px;font-weight:bold;">' + $("div#personal_info").html() + '</div><img src="' + i + '"></body></html>');
            if (print) {
                WindowObject.document.close();
                WindowObject.focus();
                WindowObject.print();
                WindowObject.close();
            }

        });

    };

    // prints hidden table //
    // will be used to print image //
    $scope.displayHiddenDiagram = function() {
        var $ = go.GraphObject.make;
        $scope.diagram = $(go.Diagram, "print_diagram");
        var createTableHeaders = function() {
            // create initial table
            var table = $(go.Panel, "Table", {
                defaultRowSeparatorStroke: "gray",
                defaultColumnSeparatorStroke: "gray"
            })
            var row = $(go.Panel, "TableRow", {
                background: '#00008B',
                row: 0
            });
            row.add($(go.TextBlock, $scope.translate("fhh_js","name_relationship"), {
                stroke: "white",
                width: 100,
                column: 0,
                font: "bold 10pt sans-serif",
                margin: 6,
                textAlign: "left"
            }));
            row.add($(go.TextBlock, $scope.translate("fhh_js","still_living"), {
                stroke: "white",
                width: 100,
                column: 1,
                font: "bold 10pt sans-serif",
                margin: 6,
                textAlign: "left"
            }));
            for (key in $scope.disease_list) {
                row.add($(go.TextBlock, $scope.disease_list[key].translatedDiseaseName, {
                    stroke: "white",
                    width: 90,
                    column: parseInt(key) + 2,
                    font: "bold 10pt sans-serif",
                    margin: 6,
                    textAlign: "left"
                }));
            }
            table.add(row);

            for (key in $scope.pi) {
                row = $(go.Panel, "TableRow", {
                    row: parseInt(key) + 3
                });
                if ($scope.pi[key].name!='') {
                	var name = $scope.pi[key].name + "\n(" + $scope.pi[key].relationship + ")"
                }
                else {
				var name = $scope.pi[key].relationship
                }
                row.add($(go.TextBlock, name, {
                    width: 100,
                    column: 0,
                    font: "bold 10pt sans-serif",
                    margin: 6,
                    textAlign: "left"
                }));
                row.add($(go.TextBlock, $scope.pi[key].is_alive, {
                    width: 100,
                    column: 1,
                    font: "bold 10pt sans-serif",
                    margin: 6,
                    textAlign: "left"
                }));

                for (col in $scope.disease_list) {
                    row.add($(go.TextBlock, $scope.lookupDisease($scope.pi[key], $scope.disease_list[col].code, true), {
                        width: 90,
                        column: parseInt(col) + 2,
                        font: "bold 10pt sans-serif",
                        margin: 6,
                        textAlign: "left"
                    }));
                }
                table.add(row)
            }

            return table
        }

        g = $(go.Part, "Auto",
            $(go.Shape, {
                fill: "white",
                stroke: "gray",
                strokeWidth: 3
            }),
            createTableHeaders()
        )
        $scope.diagram.add(g);
    };

    // closes the modal window //
    $scope.close = function() {
        $modalInstance.close();
        $("#optionsPanelMain").dialog('destroy').remove()
    };
}]);