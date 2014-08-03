/**
 * Created by hendrikssonm on 8/1/2014.
 *
 *
 *
 *
 */

function calculateBmi() {
    var weight =parseInt(personal_information.weight);
    var height = personal_information.height;

    alert( personal_information.weight);

    if(weight > 0 && height > 0){
        var finalBmi = weight/(height/100*height/100)
        alert(finalBmi)
//        if(finalBmi < 18.5){
//            document.bmiForm.meaning.value = "That you are too thin."
//        }
//        if(finalBmi > 18.5 && finalBmi < 25){
//            document.bmiForm.meaning.value = "That you are healthy."
//        }
//        if(finalBmi > 25){
//            document.bmiForm.meaning.value = "That you have overweight."
//        }
    }
    else{
        alert("Please Fill in everything correctly")
    }
}

        function mod(div,base) {
        return Math.round(div - (Math.floor(div/base)*base));
        }

        function calcBmi() {




        var w = parseInt(personal_information.weight) * 1;
        var HeightFeetInt =  0;
        var HeightInchesInt = parseInt(personal_information.height);



        HeightFeetConvert = HeightFeetInt * 12;
        h = HeightFeetConvert + HeightInchesInt;
        displaybmi = (Math.round((w * 703) / (h * h)));


        var rvalue = true;

        if ( (w <= 35) || (w >= 500)  || (h <= 48) || (h >= 120) ) {
        alert ("Invalid data.  Please check and re-enter!");
        rvalue = false;
        }

        if (rvalue) {
//        if (HeightInchesInt > 11) {
//        reminderinches = mod(HeightInchesInt,12);
//        document.bmi.hti.value = reminderinches;
//        document.bmi.htf.value = HeightFeetInt +
//        ((HeightInchesInt - reminderinches)/12);
//        document.bmi.answer.value = displaybmi;
//        }
        if (displaybmi <19)
            return ("Underweight");
        if (displaybmi >=19 && displaybmi <=25)
            return("Desirable");
        if (displaybmi >=26 && displaybmi <=29)
            return("prone to health risks");
        if (displaybmi >=30 && displaybmi <=40)
            return("Obese");
        if (displaybmi >40)
            return("Extremely obese");
//            alert(displaybmi);
        }
        return false;
        }

