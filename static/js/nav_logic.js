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
        //jsonResults = jQuery.parseJSON(results);
        drawResultTable(results);
        console.log(results)
    }
    });
    //surescripts API currently only returns data near minneapolis
}


function collectData()
{
    var allInputs = $(':text, :checked')
        .map(function ()
                {
                    return $(this).attr("name") + "=" + $(this).val()
                })
    .get()
        .join("&");
    console.log(allInputs);
    return allInputs;
}

function drawResultTable(jsonData)
{
    console.log("in drawResultTable");
    console.log(jsonData)
    rating_for_age_map = {1:'low', 2:'medium',3:'high',4:'very high',5:'extremely high'};
    //rating_for_age_map = {1:'low', 2:'medium',3:'high',4:'very high',5:'extremely high'};
    //move this elsewhere and check for it in a better way
    var all_biomarkers_entered=false
       if(jsonData['Risk'][1]['rating']==''){
           all_biomarkers_entered=true;
       }
    if (all_biomarkers_entered){
        risk_msg=jsonData['Risk'][0]['risk'];
        rating_msg=jsonData['Risk'][0]['rating'];
        percentile_msg=jsonData['Risk'][0]['riskPercentile'];
        rating_for_age_msg=rating_for_age_map[jsonData['Risk'][0]['ratingForAge']];
        comparison_risk_msg=jsonData['Risk'][0]['comparisonRisk'];
    }else{
        risk_msg=jsonData['Risk'][2]['risk']+' to '+jsonData['Risk'][1]['risk'];
        rating_msg=rating_for_age_map[jsonData['Risk'][2]['rating']]+' to '+rating_for_age_map[jsonData['Risk'][1]['rating']];
        percentile_msg=jsonData['Risk'][2]['riskPercentile'] +' to '+jsonData['Risk'][1]['riskPercentile'];
        rating_for_age_msg=rating_for_age_map[jsonData['Risk'][2]['ratingForAge']] + ' to '+rating_for_age_map[jsonData['Risk'][1]['ratingForAge']];
        comparison_risk_msg=jsonData['Risk'][2]['comparisonRisk'] + ' to ' +jsonData['Risk'][1]['comparisonRisk'];
    }
    //console.log('rating is ' +jsonData['Risk'][1]['rating']);
    $('#riskTable tbody').html('<tr class="error"><td>Your risk of having a heart attack or stroke is</td><td>'+rating_msg+"</td></tr>");
    $('#riskTable tr:last').after('<tr class="error"><td>Risk compared to a healthy person your age</td><td>'+comparison_risk_msg+" times more likely to have a heart attack</td></tr>");
    $('#riskTable tr:last').after('<tr><td>Your risk of having a heart attack or stroke in the next 5 years</td><td>'+risk_msg+"% </td></tr>");
    $('#riskTable tr:last').after('<tr><td>Percentile </td><td>'+percentile_msg+" % of people your age and gender are less likely to contract CVD than you</td></tr>");
    $('#riskTable tr:last').after('<tr><td>Your risk of having a heart attack or stroke</td><td>'+rating_for_age_msg+" for someone your age</td></tr>");

    //$('#riskTable tbody').html('<tr><td>Rating </td><td>'+jsonData['Risk'][1]['rating']+"</td></tr>");
    //$('#riskTable tr:last').after('<tr class="error"><td>Percentile </td><td>'+jsonData['Risk'][1]['riskPercentile']+"</td></tr>");
    //$('#riskTable tr:last').after('<tr class="success"><td>Rating for age </td><td>'+jsonData['Risk'][1]['ratingForAge']+"</td></tr>");
    //$('#riskTable tr:last').after('<tr><td>Comparison risk </td><td>'+jsonData['Risk'][1]['comparisonRisk']+"</td></tr>");
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

