
function setup_new_diagram_dialog() {
	$("#new_diagram_dialog").load ("new_diagram_dialog.html", function () {
	});

	$("#new_diagram_dialog").dialog({
		title:"New Diagram Dialog",
		position:['middle',0],
		autoOpen: false,
		height:'auto',
		width:['95%']
	});		
	
}

function open_new_diagram_dialog() {
	$("#new_diagram_dialog").dialog("open");
	load_diagram();	
}

function load_diagram() {	
	var diagram_data = load_data() ;
	console.log(JSON.stringify(diagram_data));
	init(diagram_data);	
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
	console.log(proband);

	// Maternal Aunts/Uncles HAVE to be added BEFORE the mother or they will be placed in the wrong place
	push_all_relatives_of_type(diagram_data, "maternal_aunt");
	push_all_relatives_of_type(diagram_data, "maternal_uncle");

	
	var father = add_relative("father", pi.father); 
	if (pi['paternal_halfbrother_0'] != null || pi['paternal_halfsister_0'] != null) {
		var spouse = add_non_blood_spouse(pi.father, father, 2);
		diagram_data.push(spouse);	
	}
	diagram_data.push(father);


	var mother = add_relative("mother", pi.mother);
	if (pi['maternal_halfbrother_0'] != null || pi['maternal_halfsister_0'] != null) {
		var spouse = add_non_blood_spouse(pi.mother, mother, 2);
		diagram_data.push(spouse);	
	}	 
	diagram_data.push(mother);

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

function add_characteristics(relative, person) {
	if (relative.adopted==true) person.a.push("A");
	if (relative.is_alive=="dead") person.a.push("D");
}

function add_relative(relationship_type, relative) {
	var person = {};
	person.a = [];
	person.key = relative.id.hashCode();
	person.n = relative.name;

	// add characteristics like adopted, deceased, related, etc //
	add_characteristics(relative,person);
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
	console.log(JSON.stringify(relative));
	// person['characteristics']='sadasd';
	return person;
}

function push_all_relatives_of_type(diagram_data, relationship_type) {
	var pi = personal_information;
	var i = 0;
	var relative = pi[relationship_type + "_" + i];
	while (relative != null) {
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

function add_non_blood_spouse(relative, new_diagram_relative, num = 1) {
	var spouse = {};
	spouse.key = relative.id.hashCode() + num;
	spouse.n = relative.name + "'s Spouse";
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