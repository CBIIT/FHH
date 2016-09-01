var app = angular.module('myApp', ['ui.bootstrap']);
app.controller('fhhController', ['$rootScope', '$scope', '$window', '$timeout', '$modal', function($rootScope, $scope, $window, $timeout, $modal) {
    $scope.personal_information = personal_information;
    var WindowObject = null;
    window.scope = $scope;
    $rootScope.isPedigree;

    // opens popup when user clicks view diagram and table //
    $scope.openDiagramTable = function(isPedigree) {
        $rootScope.isPedigree = isPedigree;
        console.log($rootScope.isPedigree);
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

        // when popup is opened, wait, then open the diagram //
        modalInstance.opened.then(function() {
            $scope.$watch($(".modal-body"), function() {
                $timeout(function() {
                    load_diagram();
                });
            })
        });

        // when popup is closed, destroy the existing diagram and table options popup if open //
        modalInstance.result.then(function() {},
            function() {
                $("#optionsPanelMain").dialog('destroy').remove();
            });
    };

}]);

app.controller('tableController', ['$scope', '$modalInstance', '$timeout', '$rootScope', function($scope, $modalInstance, $timeout, $rootScope) {
    // set disease lists to create disease lists with translated names //
    $timeout(function() {
        if (tableOptions.personal_info=='') {
            $("#personal_info_table").hide();
        }
        if (tableOptions.showNames=='') {
            $(".health_table_name").hide();
        }                       
    });

    if (!$rootScope.isPedigree) {
            var interval = setInterval(function() {
                var href = $("#tableAnchor").attr('href');
                window.location.href = href;
                stopinterval();
            },1);

            function stopinterval() {
                clearInterval(interval);
            };
    };

    $scope.calculateBMI = function(height, height_unit, weight, weight_unit) {
        if (height&&height_unit&&weight&&weight_unit) {
            height_in_meters = height*.01; //default height to height parameter, change below if inches //
            weight_in_kg = weight; //default weight in kg, change below if pounds

            if (height_unit=='inches') {
                height_in_meters = height*.0254;
            }
            if (height_unit=='centimeters') {
                height_in_meters = height*.010;
            }    
            if (weight_unit=='pound') {
                weight_in_kg = weight*.453592;
            }  

            return (weight_in_kg/(height_in_meters*height_in_meters)).toFixed(2);
        }
        
        else {
            return "0.0";
        }
    }


    var initialDiseases = ['SNOMED_CT-56265001', 'SNOMED_CT-116288000', 'SNOMED_CT-73211009', 'SNOMED_CT-363406005', 'SNOMED_CT-254837009', 'SNOMED_CT-363443007'];
    var STATICDISEASES = ['SNOMED_CT-56265001', 'SNOMED_CT-116288000', 'SNOMED_CT-73211009', 'SNOMED_CT-363406005', 'SNOMED_CT-254837009', 'SNOMED_CT-363443007'];
    var additionalDiseaseCounter = 10;
    // funtion to translate items //
    $scope.translate = function(prefix, t_string) {
        if (prefix == "diseases") {
            return $.t(prefix + ":" + t_string);
        } else {
            return $.t(prefix + "." + t_string);
        }
    };

    // function to export data to csv //
    $scope.exportToExcel = function() {
        var dl = $scope.disease_list2.length;
        var pl = $scope.filteredItems.length;

        var excelString = '"' + $scope.translate("fhh_js","name_relationship") + '","' + $scope.translate("fhh_js","still_living") + '",';
        for (key in $scope.disease_list2) {
            var k = parseInt(key) + 1;
            excelString += '"' + $scope.disease_list2[key]['translatedDiseaseName'] + '"'
            if (k < dl) excelString += ",";
            if (k == dl) excelString += "\n";
        }

        for (record in $scope.filteredItems) {
            var r = $scope.filteredItems[record];
            var pr = parseInt(record) + 1;
            if (r['name']!=''&&r['name']!=undefined) {
	            excelString += '"' + r['name'] + '\n' + '('+r['relationship']+')' + '",'
            }
            else {
            	excelString += '"' + r['relationship'] + '",'
            }
            var is_alive = r['is_alive'];
            if (is_alive=='No') {
                is_alive+=',\n' + r['cause_of_death'] + '\n(' + r['estimated_death_age'] + ')'
            }
            excelString += '"' + is_alive + '",'
            for (col in $scope.disease_list2) {
                var k = parseInt(col) + 1;
                excelString += '"' + $scope.lookupDisease(r, $scope.disease_list2[col]['code'], true) + '"'
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

    // determines if table is expanded or collapsed and sets the correct text for display //
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
        for (key in STATICDISEASES) {
            if ($scope.collapse_status.isCollapsed) { // table has been collapsed
                if (initialDiseases.indexOf(STATICDISEASES[key]) > -1) { // create normal disease column
                    d = STATICDISEASES[key];


                   dl.push({
                        'code': d,
                        'translatedDiseaseName': $scope.translate("diseases", d).replace("diseases:",""),
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
                var re = /SNOMED_CT-/;
                d = STATICDISEASES[key];
                if (!re.exec(d)) {
                    dl.push({
                        'code': d,
                        'translatedDiseaseName':  d,
                        'show': true
                    })                
                }  
                else {
                    dl.push({
                        'code': d,
                        'translatedDiseaseName': $scope.translate("diseases", d).replace("diseases:",""),
                        'show': true
                    })                    
                }              

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
        for (var k=0; k<personal_information.length;k++) {
        }
        for (x in personal_information) {
            var o = personal_information[x];
            if (o != undefined) {
                if (o.gender != undefined) {
                    var person_dict = {};
                    var health_history = [];
                    var health_code_lookup = [];
                    person_dict["is_alive"] = $scope.translate("fhh_family_pedigree", o.is_alive);
                    person_dict["name"] = o.name;
                    window.cur = o;
                    var reg = /([a-z]*)(_[0-9])/;
                    match = reg.exec(o.relationship);
                    if (match) {
                        person_dict["relationship"] = $scope.translate("fhh_js", match[1]);
                    }
                    else {
                        person_dict["relationship"] = $scope.translate("fhh_js", o.relationship);                        
                    }
                    // person_dict["relationship"] = $scope.translate("fhh_js", o.relationship);
                    if (o.cause_of_death_code) {
                        person_dict['cause_of_death'] = $scope.translate("diseases", o.cause_of_death_code).replace("diseases:","")
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
            health_history_entry["Age At Diagnosis"] = $scope.translate("fhh_js", history[x]['Age At Diagnosis']);
            if (history[x]['Disease Code']=='other-undefined'||history[x]['Disease Code']=='other') {
                health_history_entry["Disease Code"] = history[x]['Detailed Disease Name'];
                if (STATICDISEASES.indexOf(history[x]['Detailed Disease Name']) == -1) {
                    STATICDISEASES.push(history[x]['Detailed Disease Name'])

                }
                health_history_entry["translatedDiseaseName"] = history[x]['Detailed Disease Name'];
                health_code_lookup.push(history[x]['Detailed Disease Name']);
                health_history_entry["isOther"] = true;


            }
            else {
                if (STATICDISEASES.indexOf(history[x]['Disease Code']) == -1) {
                    health_history_entry["translatedDiseaseName"] = $scope.translate("diseases", history[x]['Disease Code']).replace("diseases:","");
                    STATICDISEASES.push(history[x]['Disease Code'])
                    health_history_entry["isOther"] = true;
                    health_code_lookup.push(history[x]['Disease Code']);                    
                }  
                else {
                    health_history_entry["translatedDiseaseName"] = $scope.translate("diseases", history[x]['Disease Code']).replace("diseases:","");
                    health_code_lookup.push(history[x]['Disease Code']);                    
                }                                
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
    $scope.disease_list2 = getDiseases();

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
        if (WindowObject) {
            WindowObject.close();            
        }

        $scope.diagram_show = true;
        // if (!$scope.diagram) {
            $timeout(function() {
                $scope.displayHiddenDiagram();
            });
        // };
        $timeout(function() {
            var i = $scope.diagram.makeImageData({
  scale: 1,
  background: "white"});
            $("#diagram_container").empty();
            $("#diagram_container").html('<div ng-show="diagram_show" id="print_diagram" style="width:auto; height:{{getTableHeight()}}px; background-color: #fff;"></div>');
            $scope.diagram_show = false;

            // if (!!window.chrome) {
	           //  var WindowObject = window.open(i, "Table",
	           //      "width=" + $("table.health_table").width() + ",height=" + parseInt($("table.health_table").height())+5 + ",top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");

            // }
            // else {
            // var WindowObject = window.open("", "Table",
            //     "width=" + $("table.health_table").width() + ",height=" + parseInt($("table.health_table").height())+5 + ",top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
            // WindowObject.document.writeln('<html><head></head><body><div style="padding-left:10px;font-weight:bold;">' + $("div#personal_info").html() + '</div><img src="' + i + '"></body></html>');

            // }
            var save_image_instructions = $scope.translate("fhh_family_pedigree","save_image_instructions_2")
            var header = '<head>'
            header+='<meta http-equiv="X-UA-Compatible" content="IE=edge">'
            header+='<noscript>&lt;meta http-equiv="refresh" content="0; URL=./unsupported_browser.html"&gt; &lt;/meta&gt; </noscript>'
            header+='<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">'
            header+='<meta http-equiv="cache-control" content="max-age=0">'
            header+='<meta http-equiv="cache-control" content="no-cache">'
            header+='<meta http-equiv="expires" content="0">'
            header+='<meta http-equiv="pragma" content="no-cache">'
            header+='<title>My Family Health Portrait</title>'
            header+='</head>'

            if (tableOptions.personal_info) {
                var personal_info = '<div style="padding-left:10px;font-weight:bold;"><div style="text-align:center"><h2>'  + $.t("fhh_family_pedigree.print_title_table") + '</h2></div>' + $("div#personal_info").html() + '</div>'                
            }
            else {
                var personal_info = ''                
            }            
    if (print) {
            WindowObject = window.open("", "Table",
                "width=" + $("table.health_table").width() + ",height=" + parseInt($("table.health_table").height())+5 + ",top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
            WindowObject.document.writeln('<html>' + header + '<body>' + personal_info + '<img style="display:block" src="' + i + '"></body></html>');

        $timeout(function() {
            WindowObject.focus();
            WindowObject.print();
            // WindowObject.close(); 
        });               
    }
    else {
            if (window.chrome) {
            WindowObject = window.open(i, "Table",
                "width=" + $("table.health_table").width() + ",height=" + parseInt($("table.health_table").height())+5 + ",top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");

            }
            else {
            WindowObject = window.open("", "Table",
                "width=" + $("table.health_table").width() + ",height=" + parseInt($("table.health_table").height())+5 + ",top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
            WindowObject.document.writeln('<html>' + header + '<body>' + personal_info + '<div><br /><B>' + save_image_instructions + '</B></div><br /><img src="' + i + '"></body></html>');

            }

    }


        });

    };

    // prints hidden table //
    // will be used to print image //
    $scope.displayHiddenDiagram = function() {
        var $ = go.GraphObject.make;
        $scope.diagram = $(go.Diagram, "print_diagram");
        window.scope = $scope;
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
            for (key in $scope.filteredItems) {
                row = $(go.Panel, "TableRow", {
                    row: parseInt(key) + 3
                });
                if ($scope.filteredItems[key].name!=''&&$scope.filteredItems[key].name!=undefined) {
                    if (tableOptions.showNames=='checked') {
                        var name = $scope.filteredItems[key].name + "\n(" + $scope.filteredItems[key].relationship + ")"
                    }
                    else {
                        var name = $scope.filteredItems[key].relationship                
                    }
                }
                else {
				var name = $scope.filteredItems[key].relationship
                }
                row.add($(go.TextBlock, name, {
                    width: 100,
                    column: 0,
                    font: "bold 10pt sans-serif",
                    margin: 6,
                    textAlign: "left"
                }));
                var is_alive = $scope.filteredItems[key].is_alive;
                if ($scope.filteredItems[key].is_alive=='No') {
                    is_alive += ',\n'+$scope.filteredItems[key]['cause_of_death']+'\n('+$scope.filteredItems[key]['estimated_death_age']+')';
                }
                row.add($(go.TextBlock, is_alive, {
                    width: 100,
                    column: 1,
                    font: "bold 10pt sans-serif",
                    margin: 6,
                    textAlign: "left"
                }));

                for (col in $scope.disease_list) {
                    if ($scope.disease_list[col].code=='1') {
                        var dl_string = "";
                        for (d in $scope.filteredItems[key]['Health History']) {
                                // this is where the other collapsed diseases are //
                                // dl_string+='\n'+$scope.filteredItems[key]['Health History'][d]['Disease Code']
                                if ($scope.filteredItems[key]['Health History'][d]['isOther']) {
                                dl_string+='\n'+$scope.filteredItems[key]['Health History'][d]['translatedDiseaseName']
                                dl_string+='\n'+$scope.filteredItems[key]['Health History'][d]['Age At Diagnosis']+'\n';                                    
                                }

                        }
                    row.add($(go.TextBlock, dl_string, {
                        width: 180,
                        column: parseInt(col) + 2,
                        font: "bold 10pt sans-serif",
                        margin: 4,
                        textAlign: "left"
                    }));                        
                    }
                    else {
                    row.add($(go.TextBlock, $scope.lookupDisease($scope.filteredItems[key], $scope.disease_list[col].code, true), {
                        width: 100,
                        column: parseInt(col) + 2,
                        font: "bold 10pt sans-serif",
                        margin: 4,
                        textAlign: "left"
                    }));
                    }
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

    $scope.getTableHeight = function() {
    	height = 0;
    	height+=parseInt($("table.health_table").height());
    	height+=parseInt($("#personal_info").height());
    	return height;
    }

    // closes the modal window //
    $scope.close = function() {
        $modalInstance.close();
        $("#optionsPanelMain").dialog('destroy').remove();
    };
}]);