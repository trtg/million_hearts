//explicitly specify expected return dataType in $.ajax
//call to avoid differing behavior between chrome and firefox
function submitStuff()
{
    $.ajax({
        crossDomain: true,
    type: 'post',
    url: 'https://demo-indigo4health.archimedesmodel.com/IndiGO4Health/IndiGO4Health',
    dataType:'json',
    data: collectData(),
    success: function (results)
    {
        //alert(results);
        //jsonResults = jQuery.parseJSON(results);
        displayData(results);
        console.log(results)
    }
    });
    //surescripts API currently only returns data near minneapolis
    find_test_centers(44.979965,-93.263836,2,10)
}



function collectData()
{
    var allInputs = $('input')
        .map(function ()
                {
                    return $(this).attr("name") + "=" + $(this).val()
                })
    .get()
        .join("&");
    console.log(allInputs);
    return allInputs;
}

function displayData(jsonStuff)
{
    //clear results
    remainingText = "";
    $("#displayresults").html($("#risktable").show());
    $("#td0").html("");
    $("#td1").html("");
    $("#td2").html("");

    anyErrors = false;
    for (i = 0; i < 999; i++)
    {
        if (jsonStuff["ErrorMessageHashMap"][i] != undefined)
        {
            anyErrors = true;
            break;
        }
    }

    if (anyErrors)
    {
        remainingText += displayErrors(jsonStuff);
    }
    else
    {
        displayRisks(jsonStuff);
        remainingText += displayMiscellaneous(jsonStuff);
    }

    $("#displayresults").html($("#displayresults").html() + remainingText);
}

function displayRisks(jsonStuff)
{
    var currentRisk;
    var currentRiskElement;
    for (i = 0; i < jsonStuff["Risk"].length; i++)
    {
        currentRisk = jsonStuff["Risk"][i];
        currentRiskElement = $("#riskresults").clone();
        $(currentRiskElement).find("#riskType").text(currentRisk["riskType"]);
        $(currentRiskElement).find("#risk").text(currentRisk["risk"]);
        $(currentRiskElement).find("#riskPercentile").text(currentRisk["riskPercentile"]);
        $(currentRiskElement).find("#comparisonRisk").text(currentRisk["comparisonRisk"]);
        $(currentRiskElement).find("#ratingForAge").text(currentRisk["ratingForAge"]);
        $(currentRiskElement).find("#rating").text(currentRisk["rating"]);
        $(currentRiskElement).show();
        $(currentRiskElement).appendTo("#td" + i);
    }
}

function displayErrors(jsonStuff)
{
    //{"ErrorMessageMap":{"1":["Invalid/Unsupported Format: age"]}
    //{"ErrorMessageMap":{"1":["Invalid/Unsupported Format: age","Invalid/Unsupported Format: gender","Invalid/Unsupported Format: weight"]}
    var currentError;
    var currentErrorElement;
    remainingText = '';

    for (i = 0; i < 999; i++)
    {
        if (jsonStuff["ErrorMessageHashMap"][i] != undefined)
        {
            currentError = jsonStuff["ErrorMessageHashMap"][i];
            for (j = 0; j < jsonStuff["ErrorMessageHashMap"][i].length; j++)
            {
                remainingText += jsonStuff["ErrorMessageHashMap"][i][j] + "<br />";
            }
            remainingText += "<br />";
        }
    }
    return remainingText;
}

function displayMiscellaneous(jsonStuff)
{
    remainingText = '';
    remainingText += "IncreaseInRisk: " + jsonStuff["Interventions"]["IncreaseInRisk"] + "<br />";
    remainingText += "PercentReductionInRiskWithMedication: " + jsonStuff["Interventions"]["PercentReductionInRiskWithMedication"] + "<br />";
    remainingText += "PercentReductionInRiskWithAdditionalModerateExercise: " + jsonStuff["Interventions"]["PercentReductionInRiskWithAdditionalModerateExercise"] + "<br />";
    remainingText += "PercentReductionInRiskWithAdditionalVigorousExercise: " + jsonStuff["Interventions"]["PercentReductionInRiskWithAdditionalVigorousExercise"] + "<br />";
    remainingText += "PercentReductionInRiskWithWeightLoss: " + jsonStuff["Interventions"]["PercentReductionInRiskWithWeightLoss"] + "<br />";
    remainingText += "PoundsOfWeightLossRequired: " + jsonStuff["Interventions"]["PoundsOfWeightLossRequired"] + "<br />";
    remainingText += "PercentReductionWithSmokingCessation: " + jsonStuff["Interventions"]["PercentReductionWithSmokingCessation"] + "<br />";
    remainingText += "PercentReductionWithAllInterventions: " + jsonStuff["Interventions"]["PercentReductionWithAllInterventions"] + "<br />";
    remainingText += "<br />";
    remainingText += "Elevated Blood Pressure: " + jsonStuff["ElevatedBloodPressure"] + "<br />";
    remainingText += "Elevated Cholesterol: " + jsonStuff["ElevatedCholesterol"] + "<br />";
    remainingText += "Warning Code: " + jsonStuff["WarningCode"] + "<br />";
    remainingText += "Recommendation: " + jsonStuff["Recommendation"] + "<br />";
    remainingText += "DoctorRecommendation: " + jsonStuff["DoctorRecommendation"] + "<br />";
    return remainingText;
}
function goto_page2(){
    $('#page1').hide();
    $('#page2').show();
    $('#hba1c_input').hide()
}
function goto_page3(){
    $('#page2').hide();
    $('#page3').show();
}
//in one of these functions, conditionally add the Hba1c field, if diabetes==True
function goto_page4(){
    $('#page3').hide();
    $('#page4').show();
}
function goto_page5(){
    $('#page4').hide();
    $('#optional_info').show();

}
function add_hba1c(){
    $('diabetes_info').append("")
}

