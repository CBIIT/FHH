var v4 = [];

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
    $patient.find("relative relationshipHolder").each(function() {

      id = $(this).find("id").attr("extension");
      name = $(this).find("name").attr("formatted");

      if (id && name && name != 'undefined') console.log(id + ": " + name);

    });
  };
  document.getElementById('import_file').value= null; // resets the value to allow reload
});

});