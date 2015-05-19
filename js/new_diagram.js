// function setup_new_diagram_dialog() {
// 	console.log("setting up diagram");
// 	$("#new_diagram_dialog").load ("new_diagram_dialog.html", function () {
// 	});

// 	$("#new_diagram_dialog").dialog({
// 		title:"New Diagram Dialog",
// 		position:['middle',0],
// 		autoOpen: false,
// 		height:'auto',
// 		width:['95%'],
// 		close: function(event, ui) {
// 			$("#new_diagram_dialog").empty();
// 			setup_new_diagram_dialog();
// 		}
// 	});	
// }

// function open_new_diagram_dialog() {

// 	$("#new_diagram_dialog").dialog("open");
// 	load_diagram();	
// }

// set initial zoom scale
var zoom_scale = 2;
var tableOptions = {'selectedDisease':'','personal_info':'checked','showNames':'checked','showDiagram':'checked','showTable':'checked'};
function setup_new_diagram_dialog() {
	// $("#nd").load ("new_diagram_dialog.html", function () {
	// });
	
	
}

function open_new_diagram_dialog() {

	load_diagram();	
}

function load_diagram() {	
	zoom_scale=1;
	var diagram_data = load_data() ;
	init(diagram_data);	
	if (tableOptions.showNames=='') {
		hideNamesForDiagram('hide');
	}
	if (tableOptions.showTable=='') {
		$("#bottom_table").hide();
	}
	if (tableOptions.showDiagram=='') {
		$("#pedigree").hide();
	}	
}



function load_data() {
	var diagram_data = [];
	var pi = personal_information;
	var mom_key = pi.mother.id.hashCode();
	var dad_key = pi.father.id.hashCode();
	var proband = add_relative("self", pi);
	if (pi['son_0'] != null || pi['daughter_0'] != null) {
		var spouse = add_non_blood_spouse(pi, proband);
		diagram_data.push(spouse);	
	}
	diagram_data.push(proband);

	// Maternal Aunts/Uncles HAVE to be added BEFORE the mother or they will be placed in the wrong place
	push_all_relatives_of_type(diagram_data, "maternal_aunt");
	push_all_relatives_of_type(diagram_data, "maternal_uncle");

	
	var father = add_relative("father", pi.father); 
	var father_has_spouse = false;
	if (pi['paternal_halfbrother_0'] != null || pi['paternal_halfsister_0'] != null) {
		var spouse = add_non_blood_spouse(pi.father, father, 2);
		father_has_spouse = true;
		diagram_data.push(spouse);	
	}
	diagram_data.push(father);


	var mother = add_relative("mother", pi.mother);
	if (pi['maternal_halfbrother_0'] != null || pi['maternal_halfsister_0'] != null) {
		var spouse = add_non_blood_spouse(pi.mother, mother, 2);
		if (father_has_spouse) {
			diagram_data.push(spouse);	
			diagram_data.push(mother);			
		}
		else {
			console.log(diagram_data[1].r)
			if (diagram_data[1].r=='self') {
				diagram_data.push(spouse);					
				diagram_data.push(mother);
			}
			else {
				diagram_data.push(mother);
				diagram_data.push(spouse);
			}
	

		}
	}	 
	else {
		diagram_data.push(mother);

	}

// gets the side of diagram the current spouse is on to determine if it should be added before or after spouse's partner //
function getSideOfDiagram(spouse,mother) {
  for (key in diagram_data) {
    if (diagram_data[key].key==mother.m) {
      re = /paternal/;
      match = re.exec(diagram_data[parseInt(key)-1]['r']);
      if (match) {
        console.log("I am on left")
      }

      else {
       console.log("I am on right") 
      }
      console.log(re.exec(diagram_data[parseInt(key)-1]['r']))
    }
  }	
}

	// Paternal Aunts/Uncles HAVE to be added AFTER the Father or they will be placed in the wrong place
	push_all_relatives_of_type(diagram_data, "paternal_aunt");
	push_all_relatives_of_type(diagram_data, "paternal_uncle");


	diagram_data.push(add_relative("maternal_grandmother", pi.maternal_grandmother));
	diagram_data.push(add_relative("maternal_grandfather", pi.maternal_grandfather));
	diagram_data.push(add_relative("paternal_grandmother", pi.paternal_grandmother));
	diagram_data.push(add_relative("paternal_grandfather", pi.paternal_grandfather));
	
	push_all_relatives_of_type(diagram_data, "brother");
	push_all_relatives_of_type(diagram_data, "sister");

	
	push_all_relatives_of_type(diagram_data, "maternal_cousin");
	push_all_relatives_of_type(diagram_data, "paternal_cousin");
	push_all_relatives_of_type(diagram_data, "nephew");
	push_all_relatives_of_type(diagram_data, "niece");


	push_all_relatives_of_type(diagram_data, "son");
	push_all_relatives_of_type(diagram_data, "daughter");
	push_all_relatives_of_type(diagram_data, "grandson");
	push_all_relatives_of_type(diagram_data, "granddaughter");

	push_all_relatives_of_type(diagram_data, "paternal_halfbrother");
	push_all_relatives_of_type(diagram_data, "paternal_halfsister");
	push_all_relatives_of_type(diagram_data, "maternal_halfbrother");
	push_all_relatives_of_type(diagram_data, "maternal_halfsister");
	

	return diagram_data;
}


// add characteristics to the attributes array. Determines geometry and colors //
function add_characteristics(relationship_type, relative, person) {
	// check health history. if diseases exist set diseases to health history //
	// if diseases do not exist set dieases key to "" to ensure tooltip is not shown //
	person.diseases = "";
	if (relative['Health History'].length>0) {
		person.diseases = addTranslatedDiseaseName(relative['Health History']);
	}
	if (relative.adopted==true) person.a.push("A");
	if (relative.is_alive=="dead") person.a.push("D");
	if (relationship_type=="self") person.a.push("SELF");
}

// translate all diseases in the person's health history and add to existing disease object //
function addTranslatedDiseaseName(diseases) {
	for (key in diseases) {
		if (diseases[key]['Disease Code']=='SNOMED_CT-OTHER') {
			diseases[key]['translatedDiseaseName']=diseases[key]['Detailed Disease Name'];			
		}
		
		else{
			diseases[key]['translatedDiseaseName']=$.t("diseases:"+diseases[key]['Disease Code']);
		}
   	}
   	return diseases;
}

function add_relative(relationship_type, relative) {
	var person = {};
	person.a = [];
	person.key = relative.id.hashCode();
	person['r'] = relationship_type;
	if (relative.name!="") {
		person.n = relative.name;
		person.t_n = "["+$.t("fhh_js." + relationship_type)+"]";
	}
	else {
		person.n = $.t("fhh_js." + relationship_type);
	}
	// add characteristics like adopted, deceased, related, etc //
	add_characteristics(relationship_type, relative, person);
	// end characteristics //

	var p = get_parents(relationship_type, relative);
	if (p && p.m != null) person.m = p.m;
	if (p && p.f != null) person.f = p.f;

	var h = get_husband(relationship_type, relative);
	if (h != null) person.vir = h;

	var w = get_wife(relationship_type, relative);
	if (w != null) person.ux = w;
	
	if (relative.gender == "MALE") person.s = "M"; else person.s = "F";
	
	var is_blood_parent = have_any_children(relationship_type, relative);
	
	if (is_blood_parent == true) person.children = true;
	// console.log(JSON.stringify(relative));
	return person;
}

function push_all_relatives_of_type(diagram_data, relationship_type) {
	var pi = personal_information;
	var i = 0;
	var relative = pi[relationship_type + "_" + i];
	while (relative != null) {
		// If this is a maternal halfsibling the spouse may need to be added before the mother
		var new_diagram_relative = add_relative(relationship_type, relative);
		if (new_diagram_relative.children == true) {
			var spouse = add_non_blood_spouse(relative, new_diagram_relative);
			diagram_data.push(spouse);	

		}
		diagram_data.push(new_diagram_relative);	
	
		i++;
		relative = pi[relationship_type + "_" + i];
	}
}


function add_non_blood_spouse(relative, new_diagram_relative, num) {
	var spouse = {};
	spouse.a = [];
	var num = typeof num !== 'undefined' ? num : 1;	
	spouse.key = relative.id.hashCode() + num;
	spouse.n = $.t("fhh_js." + relative.relationship) + "'s Spouse"
	if (relative.name!=""&&relative.name!=undefined) {
		spouse.n = relative.name + "'s Spouse";
	} 
	spouse.a.push("S");
	spouse.diseases = "";
	if (relative.gender == "MALE") {
		if (new_diagram_relative.ux && new_diagram_relative.ux != "") {
			new_diagram_relative.ux = [spouse.key, new_diagram_relative.ux]; 
		} else {
			new_diagram_relative.ux = spouse.key;
		}
		spouse.s = "F";
		spouse.vir = new_diagram_relative.key;
	} else {
		if (new_diagram_relative.vir && new_diagram_relative.vir != "") {
			new_diagram_relative.vir = [spouse.key, new_diagram_relative.vir];
		} else {
			new_diagram_relative.vir = spouse.key;
		}
		spouse.s = "M";
		spouse.ux = new_diagram_relative.key;
	}
	return spouse;
}

function get_parents (relationship_type, relative) {
	var pi = personal_information;
	var p = {};
	switch (relationship_type) {
		case "self": 
		case "brother":
		case "sister": 
			p.f = pi.father.id.hashCode(); p.m = pi.mother.id.hashCode(); return p;
		
		case "father": 
		case "paternal_aunt": 
		case "paternal_uncle": 	
			p.f = pi.paternal_grandfather.id.hashCode(); p.m = pi.paternal_grandmother.id.hashCode(); return p;	

		case "mother": 
		case "maternal_aunt": 
		case "maternal_uncle": 
			p.f = pi.maternal_grandfather.id.hashCode(); p.m = pi.maternal_grandmother.id.hashCode(); return p;	

		case "son": 
		case "daughter":
			p.f = pi.id.hashCode(); p.m = pi.id.hashCode() + 1; return p;
						
		case "maternal_cousin": 
		case "paternal_cousin": 
		case "nephew": 
		case "niece":
		case "grandson":
		case "granddaughter":
			p.f = relative.parent_id.hashCode(); p.m = relative.parent_id.hashCode() +1 ; return p;

		case "paternal_halfbrother": 
		case "paternal_halfsister": 
//			p.f = pi.father.id.hashCode(); p.m = pi.mother.id.hashCode(); return p;
			p.f = pi.father.id.hashCode(); p.m = pi.father.id.hashCode()+2; return p;

		case "maternal_halfbrother": 
		case "maternal_halfsister": 
//			p.f = pi.father.id.hashCode(); p.m = pi.mother.id.hashCode(); return p;
			p.f = pi.mother.id.hashCode()+2; p.m = pi.mother.id.hashCode(); return p;

		case "maternal_grandfather": 
		case "maternal_grandmother": 
		case "paternal_grandfather": 
		case "paternal_grandmother": 
		default:
			p.f = null; p.m = null; return p;	

	}	
}

function get_husband(relationship_type, relative) {
	var pi = personal_information;
	switch (relationship_type) {
		case "mother": return pi.father.id.hashCode();	
		case "maternal_grandmother": return pi.maternal_grandfather.id.hashCode();	
		case "paternal_grandmother": return pi.paternal_grandfather.id.hashCode();	
		default: return null;	
	}
}

function get_wife(relationship_type, relative) {
	var pi = personal_information;
	switch (relationship_type) {
		case "father": return pi.mother.id.hashCode();	
		case "maternal_grandfather": return pi.maternal_grandmother.id.hashCode();	
		case "paternal_grandfather": return pi.paternal_grandmother.id.hashCode();	
		default: return null;	
	}
}

// Moms, Dads, Grandparents do not count as both parent are related
function have_any_children(relationship_type, relative) {
	if (relationship_type == 'father' || relationship_type == 'mother' || 
			relationship_type == 'maternal_grandfather' || relationship_type == 'maternal_grandmother' || 
			relationship_type == 'paternal_grandfather' || relationship_type == 'paternal_grandmother') return false;
			
	var parent_status = false;
	$.each(personal_information, function (key, item) {
		if (item != null && item.parent_id != null && item.parent_id.hashCode() == relative.id.hashCode()) {
			parent_status = true;
		}
	});
	return parent_status;
}



function createDiagramDialog() {
    var allnames = new Array();
    if($("#optionsPanelMain").dialog( "isOpen" ) == true) {
        $("#optionsPanelMain").dialog( "open" );
    }
    else {
        var array = new Array();
        array.push("<option value='0'></option>")

        /**
         * Me values
         */
        $.each(personal_information['Health History'], function (k, data) {

            //var health = new Array();
            //health = data['Health History'];

            var thename, temp;
            var disname = data['Disease Name'];
            var detdisname = $.t("diseases:" + data['Disease Code']);
            if(detdisname=='diseases:null') detdisname = null;
            if (detdisname == null) thename = disname;
            else thename = detdisname;
//                      console.log("P->DN:[" + disname +  "]DDN[" + detdisname + "]DC[" + data['Disease Code'] + "]--> [" + thename + "]");
            if ($.inArray(thename, allnames) == -1) {
                allnames.push(thename);
                if (tableOptions.selectedDisease==data['Disease Code']) {
	                array.push("<option id=" + disname + " value='" + data['Disease Code'] + "' selected>" + thename + "</option>")
                }
                else {
	                array.push("<option id=" + disname + " value='" + data['Disease Code'] + "'>" + thename + "</option>")                	
                }
            }
        });

        /**
         * family Values
         */
        $.each(personal_information, function (key, item) {
            if(item) {
                if (typeof item.id != 'undefined') {
                    if (item['Health History']) {
                        var health = new Array();
                        health = item['Health History'];
                        $.each(health, function (k, data) {
                            var thename, temp;
                            var disname = data['Disease Name'];
                            var detdisname = $.t("diseases:" + data['Disease Code']);
                            if(detdisname=='diseases:null') detdisname = null;
                            if (detdisname == null) thename = disname;
                            else thename = detdisname;
//                                                      console.log("R->DN:[" + disname +  "]DDN[" + detdisname + "]DC[" + data['Disease Code'] + "]--> [" + thename + "]");
                            if ($.inArray(thename, allnames) == -1) {
                                allnames.push(thename);
			                if (tableOptions.selectedDisease==data['Disease Code']) {
				                array.push("<option id=" + disname + " value='" + data['Disease Code'] + "' selected>" + thename + "</option>")
			                }
			                else {
				                array.push("<option id=" + disname + " value='" + data['Disease Code'] + "'>" + thename + "</option>")                	
			                }                                
                            }
                        });
                    }
                }
            }
        });



		
        var $optdialog = $("<div id='optionsPanelMain' width='800px' class='instructions option_dialog' style='width:800px;'><p>"
        + $.t("fhh_family_pedigree.diagram_options_desc")
        + "<table>"
        + "<tr>"
        + "<td>"
        + "<label for='diseaseopts'>" + $.t("fhh_family_pedigree.diagram_options_disease") + "  </label>"
        + "<select id='diseaseopts' onchange='DiseaseDna()'>"
        + array.toString()
        + "<option value='one'></option>"
        + "</select>"
        + "</td>"
        + "</tr>"
        + "<tr>"
        + "<td>"
	   + "<input id='bmi' type='checkbox' name='bmi' value='bmi' onclick='HidePersonalInfo()'"  + tableOptions.personal_info + " />" + $.t("fhh_family_pedigree.diagram_options_checkbox1") + "<br />"
        + "<input id='names' type=	'checkbox' name='names' value='names' onclick='HideNames()' " + tableOptions.showNames + " />" + $.t("fhh_family_pedigree.diagram_options_checkbox2") + "<br />"
        + "<input id='diagram' type='checkbox' name='diagram' value='diagram' onclick='HideDiagram()' " + tableOptions.showDiagram + " />" + $.t("fhh_family_pedigree.diagram_options_checkbox3") + "<br />"
        + "<input id='table' type='checkbox' name='table' value='table' onclick='HideTable()' " + tableOptions.showTable + " />" + $.t("fhh_family_pedigree.diagram_options_checkbox4") + "<br />"
        // + "<input id='diagram' type='checkbox' name='diagram' value='diagram' onclick='[/.]        // + "<input id='table' type='checkbox' name='chk_group' value='table' onclick='HideInfoMain()' checked/>" + $.t("fhh_family_pedigree.diagram_options_checkbox4") + "<br />"
        // + "<input type='button' onclick='CloseInfoMain()' value='" + $.t("fhh_family_pedigree.close") + "'></button>"
        + "<br /><button onclick='CloseInfoMain()'>" + $.t("fhh_family_pedigree.close") + "</button>"
        + "</td>"
        + "</tr></table>"
        + "</p></div>").dialog({
            width: 900,
            position: ['top',100],
            title: $.t("fhh_family_pedigree.diagram_options"),
            open: function(ev,ui) {
			$(".ui-front").zIndex(5000)
            },
            close: function (ev, ui) {
            	console.log("closed");
                $(this).empty();
                $(this).dialog('destroy').remove();

            }
        });

        //Reset All to Original
        // ResetInfo();

        return $optdialog
    }

}

function HidePersonalInfo() {
    var selectPersonalInfo = document.getElementById("bmi").checked;
    if (selectPersonalInfo) {
    		$("#personal_info_table").show();
    		tableOptions.personal_info = 'checked'
    }
    else {
    		tableOptions.personal_info = '';
    		$("#personal_info_table").hide();
    }
}

function HideDiagram() {
    var selectDiagram = document.getElementById("diagram").checked;
    if (selectDiagram) {
    		$("#pedigree").show();
    		tableOptions.showDiagram = 'checked'
    }
    else {
    		tableOptions.showDiagram = '';
    		$("#pedigree").hide();
    }
}

function HideTable() {
    var selectTable = document.getElementById("table").checked;
    if (selectTable) {
    		$("#bottom_table").show();
    		tableOptions.showTable = 'checked'
    }
    else {
    		tableOptions.showTable = '';
    		$("#bottom_table").hide();
    }

}


function HideNames() {
    var selectNames = document.getElementById("names").checked;
    if (selectNames) {
    		tableOptions.showNames = 'checked';
    		$(".health_table_name").show();
    		hideNamesForDiagram();
    }
    else {
    		tableOptions.showNames = '';
    		$(".health_table_name").hide();
		hideNamesForDiagram('hide');
    }
}

function hideNamesForDiagram(showHide) {
    diagram = myDiagram.model;
    array = diagram.nodeDataArray;
    diagram.startTransaction("hideNames");
    for (key in array) {
        if (array[key]['s'] != 'LinkLabel') {
            node = array[key];
          if (showHide) {
            if (node['t_n']) {
              diagram.setDataProperty(node, "h_n", node['n']);
              diagram.setDataProperty(node, "h_t_n", node['t_n']);
              diagram.setDataProperty(node, "n", node['t_n'].replace('[','').replace("]",""));
              diagram.setDataProperty(node, "t_n", "");
            }
          }
          else {
            if (node['h_t_n']) {
              diagram.setDataProperty(node, "n", node['h_n']);
              diagram.setDataProperty(node, "t_n", node['h_t_n']);
            }            
          }

        }
    }
    diagram.commitTransaction("hideNames")
}

function ClearDna(){

    $.each(personal_information, function (key, item) {
        if (typeof item != 'undefined'){
            var ID = item.id;
            if (typeof ID != 'undefined') {
                $('#' + ID).attr({fill: 'silver', stroke: 'red'});
            }
        }
    });
}

function DiseaseDna(){

    ClearDna();

    var selectBox = document.getElementById("diseaseopts");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    tableOptions.selectedDisease = selectBox.options[selectBox.selectedIndex].value;
    var found = false;
        console.log( "<<<" + selectedValue + ">>>");
        capture_specific_disease(selectedValue);
    /**
     * Me values
     */
    // Fixed below code to fix yellow and blue combinations
    var ID = 'me';
    $.each(personal_information['Health History'], function (k, data) {
        if(typeof data !='undefined') {
                        console.log("Testing: " + data["Disease Code"] + "==" + selectedValue);
                        if (selectedValue == data["Disease Code"]) {
              $('#' + ID).attr({fill: 'yellow', stroke: 'black'});
              found = true;
            }
        }
    });

    if (found != true) {
            $('#' + ID).attr({fill: 'slateblue', stroke: 'black'});
    }

        found = false;
    $.each(personal_information, function (key, item) {
        if(item != null && typeof item != 'undefined' && typeof item.id !='undefined') {
            var ID = item.id;
            if (typeof ID != 'undefined') {
                                var hh = item['Health History'];
                                $.each(hh, function (health_key, disease) {
//                                  console.log("Testing["+item.name+"]: " + disease["Disease Code"] + "==" + selectedValue);
                                    
                                    if (selectedValue == disease["Disease Code"]) {
//                                      console.log("HIT: " + ID);
                                        found = true;
                                        $('#' + ID).attr({fill: 'yellow', stroke: 'black'});            
                                    }
                                });
                                if (found != true) {
                                    $('#' + ID).attr({fill: 'silver', stroke: 'black'});
                                }
            }
        }


    });

}


function closeDialog() {
  $('#new_diagram_dialog').dialog("close");
}

function CloseInfoMain(){
    $('#optionsPanelMain').dialog('close');
}

function createImage(print) {
	var image = 
	myDiagram.makeImageData({
		scale: zoom_scale,
		background: "white",	
		maxSize: new go.Size(Infinity, Infinity)
	});



    if (print) {
    var WindowObject = window.open("", "Diagram",
    "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
    WindowObject.document.writeln('<html><head></head><body><div style="text-align:center"><h2>'  + $.t("fhh_family_pedigree.print_title") + '</h2><img src="' + image + '"></div></body></html>');
    window.wo = WindowObject;
	    WindowObject.focus();		

	    WindowObject.print();
    }
    else {
		if (window.chrome) {
	    var WindowObject = window.open(image, "Diagram",
	    "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");

		}
		else{
	    var WindowObject = window.open("", "Diagram",
	    "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
	    WindowObject.document.writeln('<html><head></head><body><div style="text-align:center"><h2>'  + $.t("fhh_family_pedigree.print_title") + '</h2><img src="' + image + '"></div></body></html>');
	    window.wo = WindowObject;
		    WindowObject.focus();		
		}    	
    }
}

function zoom(direction) {
	zoom_scale+=direction;
	myDiagram.scale = zoom_scale;
	myDiagram.contentAlignment = go.Spot.TopCenter;

}
////////////////////////////////////////////////////////
//  Helper function to define a hash for all Strings

String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}