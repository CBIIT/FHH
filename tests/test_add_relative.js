QUnit.module("Add Relative Dropdown");

// This tests fhh.js:656  add_dynamic_relative_to_dropdown
// This test adds 2 maternal aunts to the pedigree and verifies that the dropdown for adding cousin shows 2 entries
QUnit.test( "Test Add Cousin: Two Maternal Aunts", function( assert ) {
	personal_information = make_personal_information();
	personal_information.maternal_aunt_0 = make_relative("Aunt #1", "FEMALE");
	personal_information.maternal_aunt_1 = make_relative("Aunt #2", "FEMALE");

	var fixture = $( "#qunit-fixture" );
	var select_element = $("<select id='test_select'></select>");
	fixture.append( select_element );
	
	add_cousin_select(select_element);
	assert.ok(select_element.children().length == 3, "2 Aunts + 1 ('please_specify') = 3:" 
			+  select_element.children().length);
});

QUnit.test( "Test Add Cousin: All four Uncles/Aunt types", function( assert ) {
	personal_information = make_personal_information();
	personal_information.maternal_aunt_0 = make_relative("Maternal Aunt #1", "FEMALE");
	personal_information.maternal_uncle_0 = make_relative("Maternal Uncle #1", "MALE");
	personal_information.paternal_aunt_0 = make_relative("Paternal Aunt #1", "FEMALE");
	personal_information.paternal_uncle_0 = make_relative("Paternal Uncle #1", "MALE");

	var fixture = $( "#qunit-fixture" );
	var select_element = $("<select id='test_select'></select>");
	fixture.append( select_element );
	
	add_cousin_select(select_element);
	assert.ok(select_element.children().length == 5, "M.Aunt + P.Aunt + M.Uncle + P.Uncle + 1 ('please_specify') = 5:"  
			+  select_element.children().length);
});

QUnit.test( "Test Add Nephew: Multiple Brothers", function( assert ) {
	personal_information = make_personal_information();
	personal_information.brother_0 = make_relative("Brother #1", "MALE");
	personal_information.brother_1 = make_relative("Brother #2", "MALE");
	personal_information.brother_2 = make_relative("Brother #3", "MALE");

	var fixture = $( "#qunit-fixture" );
	var select_element = $("<select id='test_select'></select>");
	fixture.append( select_element );
	
	add_nephew_select(select_element);
	assert.ok(select_element.children().length == 4, "3 Brothers + 1 ('please_specify') = 4:" 
			+  select_element.children().length );
});

QUnit.test( "Test Add Nephew: Including all Siblings and HalfSiblings Brothers", function( assert ) {
	personal_information = make_personal_information();
	
	personal_information.brother_0 = make_relative("Brother #1", "MALE");
	personal_information.brother_1 = make_relative("Brother #2", "MALE");
	personal_information.sister_0 = make_relative("Sister #1", "FEMALE");

	personal_information.maternal_halfbrother_0 = make_relative("Maternal Halfbrother #1", "MALE");
	personal_information.maternal_halfsister_0 = make_relative("Maternal Halfsister #1", "FEMALE");
	personal_information.paternal_halfbrother_0 = make_relative("Paternal Halfbrother #1", "MALE");
	personal_information.paternal_halfsister_0 = make_relative("Paternal Halfsister #1", "FEMALE");

	personal_information.paternal_halfbrother_1 = make_relative("Paternal Halfbrother #2", "MALE");

	var fixture = $( "#qunit-fixture" );
	var select_element = $("<select id='test_select'></select>");
	fixture.append( select_element );
	
	add_nephew_select(select_element);
	assert.ok(select_element.children().length == 9, "2 Brothers + 1 Sister + 5 Halfsiblings = 8 + 1 ('please_specify') = 9:" 
			+  select_element.children().length );
});

QUnit.test( "Test Add Niece: Multiple Brothers", function( assert ) {
	personal_information = make_personal_information();
	personal_information.brother_0 = make_relative("Brother #1", "MALE");
	personal_information.brother_1 = make_relative("Brother #2", "MALE");
	personal_information.brother_2 = make_relative("Brother #3", "MALE");

	var fixture = $( "#qunit-fixture" );
	var select_element = $("<select id='test_select'></select>");
	fixture.append( select_element );
	
	add_niece_select(select_element);
	assert.ok(select_element.children().length == 4, "3 Brothers + 1 ('please_specify') = 4:" 
			+  select_element.children().length );
});

QUnit.test( "Test Add Niece: Including all Siblings and HalfSiblings Brothers", function( assert ) {
	personal_information = make_personal_information();
	
	personal_information.brother_0 = make_relative("Brother #1", "MALE");
	personal_information.brother_1 = make_relative("Brother #2", "MALE");
	personal_information.sister_0 = make_relative("Sister #1", "FEMALE");

	personal_information.maternal_halfbrother_0 = make_relative("Maternal Halfbrother #1", "MALE");
	personal_information.maternal_halfsister_0 = make_relative("Maternal Halfsister #1", "FEMALE");
	personal_information.paternal_halfbrother_0 = make_relative("Paternal Halfbrother #1", "MALE");
	personal_information.paternal_halfsister_0 = make_relative("Paternal Halfsister #1", "FEMALE");

	personal_information.paternal_halfbrother_1 = make_relative("Paternal Halfbrother #2", "MALE");

	var fixture = $( "#qunit-fixture" );
	var select_element = $("<select id='test_select'></select>");
	fixture.append( select_element );
	
	add_niece_select(select_element);
	assert.ok(select_element.children().length == 9, "2 Brothers + 1 Sister + 5 Halfsiblings = 8 + 1 ('please_specify') = 9:" 
			+  select_element.children().length );
});

QUnit.test( "Test Add Grandson: Multiple Sons", function( assert ) {
	personal_information = make_personal_information();
	personal_information.son_0 = make_relative("Son #1", "MALE");
	personal_information.son_1 = make_relative("Son #2", "MALE");
	personal_information.son_2 = make_relative("Son #3", "MALE");
	personal_information.son_3 = make_relative("Son #4", "MALE");

	var fixture = $( "#qunit-fixture" );
	var select_element = $("<select id='test_select'></select>");
	fixture.append( select_element );
	
	add_grandson_select(select_element);
	assert.ok(select_element.children().length == 5, "4 Sons + 1 ('please_specify') = 5:" 
			+  select_element.children().length );
});

QUnit.test( "Test Add Grandson: Sons and Daughters", function( assert ) {
	personal_information = make_personal_information();
	personal_information.son_0 = make_relative("Son #1", "MALE");
	personal_information.son_1 = make_relative("Son #2", "MALE");
	personal_information.daughter_0 = make_relative("Daughter #1", "FEMALE");
	personal_information.daughter_1 = make_relative("Daughter #2", "FEMALE");
	personal_information.daughter_2 = make_relative("Daughter #3", "FEMALE");

	var fixture = $( "#qunit-fixture" );
	var select_element = $("<select id='test_select'></select>");
	fixture.append( select_element );
	
	add_grandson_select(select_element);
	assert.ok(select_element.children().length == 6, "3 Sons + 2 Daughters = 5 + 1 ('please_specify') = 6:" 
			+  select_element.children().length );
});

QUnit.test( "Test Add Granddaughter: Multiple Sons", function( assert ) {
	personal_information = make_personal_information();
	personal_information.son_0 = make_relative("Son #1", "MALE");
	personal_information.son_1 = make_relative("Son #2", "MALE");
	personal_information.son_2 = make_relative("Son #3", "MALE");
	personal_information.son_3 = make_relative("Son #4", "MALE");

	var fixture = $( "#qunit-fixture" );
	var select_element = $("<select id='test_select'></select>");
	fixture.append( select_element );
	
	add_granddaughter_select(select_element);
	assert.ok(select_element.children().length == 5, "4 Sons + 1 ('please_specify') = 5:" 
			+  select_element.children().length );
});

QUnit.test( "Test Add Granddaughter: Sons and Daughters", function( assert ) {
	personal_information = make_personal_information();
	personal_information.son_0 = make_relative("Son #1", "MALE");
	personal_information.son_1 = make_relative("Son #2", "MALE");
	personal_information.daughter_0 = make_relative("Daughter #1", "FEMALE");
	personal_information.daughter_1 = make_relative("Daughter #2", "FEMALE");
	personal_information.daughter_2 = make_relative("Daughter #3", "FEMALE");

	var fixture = $( "#qunit-fixture" );
	var select_element = $("<select id='test_select'></select>");
	fixture.append( select_element );
	
	add_granddaughter_select(select_element);
	assert.ok(select_element.children().length == 6, "3 Sons + 2 Daughters = 5 + 1 ('please_specify') = 6:" 
			+  select_element.children().length );
});


QUnit.test( "Test Static Add New Family Member Select with no Extra Relatives", function( assert ) {
	personal_information = make_personal_information();

	var fixture = $( "#qunit-fixture" );
	var select_element = $("<select id='test_select'></select>");
	fixture.append( select_element );
	
	var select_element = add_new_family_member_select(select_element);
	assert.ok(select_element.children().length == 9, "Secondary Relatives are Aunt/Uncles/Brothers/Sisters/Sons/Daughters/HalfBrothers/HalfSisters -> 8 + 1 = 9:" 
			+  select_element.children().length );
});

QUnit.test( "Test Static Add New Family Member Select with Extra Relatives", function( assert ) {
	personal_information = make_personal_information();
	personal_information.son_0 = make_relative("Son #1", "MALE");
	personal_information.maternal_uncle_0 = make_relative("M.Uncle #1", "MALE");
	personal_information.brother_0 = make_relative("Brother #1", "MALE");

	var fixture = $( "#qunit-fixture" );
	var select_element = $("<select id='test_select'></select>");
	fixture.append( select_element );
	
	var select_element = add_new_family_member_select(select_element);
	assert.ok(select_element.children().length == 14, "Secondary Relatives are Aunt/Uncles/Brothers/Sisters/Sons/Daughters/HalfBrothers/HalfSisters -> 8");
	assert.ok(select_element.children().length == 14, "Tertiary Relatives are Cousins/Grandsons/Granddaughters/Nephews/Nieces -> 5; 8 + 5 + 1 = 14:" 
			+  select_element.children().length );
});

QUnit.test( "Test Add New Family Members Instructions", function( assert ) {

	var fixture = $( "#qunit-fixture" );	
	add_new_family_member_instructions(fixture);
	
	assert.ok(true , "Instructions are: [" + fixture.html()+ "]");
	assert.ok(fixture.html().indexOf("new_family_member_relationship")!= -1 , "Instructions contain the label:'new_family_member_relationship'");
});

QUnit.test( "Test Bind New Family Member Button Action ", function( assert ) {
	var fixture = $( "#qunit-fixture" );	

	var stub = sinon.stub( $.fn, 'dialog' );
	
	var nfmd = bind_add_another_family_member_button_action();
	assert.ok(nfmd.html().indexOf("new_family_member_relationship")!= -1 , "Dialog contain the label:'new_family_member_relationship'");
});

QUnit.test( "Test On Change Select ", function( assert ) {
//	var fixture = $( "#qunit-fixture" );	
//	var stub = sinon.stub( $.fn, 'dialog' );
//	var nfmd = bind_add_another_family_member_button_action();
	
//	var select_element = nfmd.find("#new_family_member_relationship");
	
//	assert.ok(true, select_element.html());
});
