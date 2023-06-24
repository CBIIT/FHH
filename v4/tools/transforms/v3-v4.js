var v4 = {};

$(document).ready(function() {

$("#import_from_file").click(function() {
  $("#import_file").click();
});

$("#import_file").change(function(e) {

  var reader = new FileReader();
  reader.readAsText(e.target.files[0]);
  reader.onload = function(e) {
    xmlDoc = $.parseXML( e.target.result ),
    $xml = $( xmlDoc );
    $patient = $xml.find("patient patientPerson");

    // Find the proband id and add it to the v4 object
    var id = $patient.find("id").attr("extension");
    v4.proband = id;

    // Add the empty people list to the v4 object
    v4.people = {};
    // Add the proband as the first person in the list
    v4.people[id] = {"name":"Test"};

    $patient.find("relative relationshipHolder").each(function() {

      id = $(this).find("id").attr("extension");
      name = $(this).find("name").attr("formatted");

      if (id && name && name != 'undefined') {
        v4.people[id] = {"name":name};
      }

    });
  };
  document.getElementById('import_file').value= null; // resets the value to allow reload
  console.log(v4);
});

});

function add_proband_to_v4() {
  v4.proband = "test"
}