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
    //console.log(allInputs);
    return allInputs;
}

function drawResultTable(jsonData)
{
    //console.log(jsonData)
    rating_for_age_map = {1:'low', 2:'medium',3:'high',4:'very high',5:'extremely high'};
    doctor_recommendation_map={0:'No additional screening', 1:'You should discuss your heart risk with your doctor and any steps you take to reduce your risk',2:'It is important for you to visit your doctor and discuss your heart risk and steps you can take to reduce your risk.',3:'It is extremely important you see a doctor immediately and discuss the steps needed for you to reduce your heart risk.'};
    screening_recommendation_map={0: 'No additional screening is needed.',1: 'You are in a lower risk category but screening would be useful. It is important to know your blood pressure and cholesterol to better understand your risk and keep track of it over time.',2: 'You could be at high or very high risk for your age so screening is important. You should get screened for your blood pressure and cholesterol and take action.',3: 'Screening is urgent as you are likely to be at very high risk and treatment could be critical.'}
    //back up click handler which allows collapsing accordion and restore it once you have all biomarkers
    //console.log($('#interventions_collapse_link'))
    //var original_click_handler=$('#interventions_collapse_link').data('events').click[0].handler;

    //rating_for_age_map = {1:'low', 2:'medium',3:'high',4:'very high',5:'extremely high'};
    //move this elsewhere and check for it in a better way
    var all_biomarkers_entered=false
       if(jsonData['Risk'][1]['rating']==''){
           all_biomarkers_entered=true;
       }
    if (all_biomarkers_entered){
        //restore collapsibility
        //$('#interventions_collapse_link').bind('click',original_click_handler);

        rating_msg=rating_for_age_map[jsonData['Risk'][0]['rating']];
        risk_msg=jsonData['Risk'][0]['risk'];
        percentile_msg=jsonData['Risk'][0]['riskPercentile'];
        rating_for_age_msg=rating_for_age_map[jsonData['Risk'][0]['ratingForAge']];
        comparison_risk_msg=jsonData['Risk'][0]['comparisonRisk'];

        $('#current_medication_risk_reduction').html(jsonData['Interventions']['IncreaseInRisk']);
        $('#new_medication_risk_reduction').html(jsonData['Interventions']['PercentReductionInRiskWithMedication']);
        $('#moderate_exercise_risk_reduction').html(jsonData['Interventions']['PercentReductionInRiskWithAdditionalModerateExercise']);
        $('#vigorous_exercise_risk_reduction').html(jsonData['Interventions']['PercentReductionInRiskWithAdditionalVigorousExercise']);

        $('#weight_loss_risk_reduction').html(jsonData['Interventions']['PercentReductionInRiskWithWeightLoss']);
        $('#pounds_to_lose').html(jsonData['Interventions']['PoundsOfWeightLossRequired']);
        $('#smoking_risk_reduction').html(jsonData['Interventions']['PercentReductionWithSmokingCessation']);
        $('#total_risk_reduction').html(jsonData['Interventions']['PercentReductionWithAllInterventions']);
        $('#interventions_collapse_link').html("Recommendations for you");

        if(jsonData['DoctorRecommendation']!=0){
            $('#dr_or_screening_recommendation').html(doctor_recommendation_map[jsonData['DoctorRecommendation']]);
        }else{
            $('#dr_or_screening_recommendation').html("");
        }

    }else{
        rating_msg=rating_for_age_map[jsonData['Risk'][2]['rating']]+' to '+rating_for_age_map[jsonData['Risk'][1]['rating']];
        risk_msg=jsonData['Risk'][2]['risk']+' to '+jsonData['Risk'][1]['risk'];
        percentile_msg=jsonData['Risk'][2]['riskPercentile'] +' to '+jsonData['Risk'][1]['riskPercentile'];
        rating_for_age_msg=rating_for_age_map[jsonData['Risk'][2]['ratingForAge']] + ' to '+rating_for_age_map[jsonData['Risk'][1]['ratingForAge']];
        comparison_risk_msg=jsonData['Risk'][2]['comparisonRisk'] + ' to ' +jsonData['Risk'][1]['comparisonRisk'];
        $('#interventions_collapse_link').html("Click on step 2 at left and then click continue to get personalized recommendations here");

            if(jsonData['Recommendation']!=0){
                $('#dr_or_screening_recommendation').html(screening_recommendation_map[jsonData['Recommendation']]);
            }else{
                $('#dr_or_screening_recommendation').html("");
            }
            //tried saving and restoring click handler, but this doesn't seem to work
        //$('#interventions_collapse_link').click(function(e){
        //    $('#myTab li:eq(2) a').tab('show');
        //});
    }
    if($('#smoker_true').is(':checked')){
            $('#smoking_row').show();
        }else{
            $('#smoking_row').hide();
        }
    if($('#aspirin_true').is(':checked') | $('#bloodpressure_meds_true').is(':checked') |$('#cholesterol_meds_true').is(':checked')){
            $('#current_medication_row').show();
        }else{
            $('#current_medication_row').hide();
        }

if(jsonData['Interventions']['PoundsOfWeightLossRequired'].length!=0){
    $('#weight_loss_row').show();
}else{
    $('#weight_loss_row').hide();
}
    $('#riskTable tbody').html('<tr class="error"><td>Your risk of having a heart attack or stroke is</td><td><b>'+rating_msg+"</b></td></tr>");
    $('#riskTable tr:last').after('<tr class="error"><td>Risk compared to a healthy person your age</td><td><b>'+comparison_risk_msg+"</b> times more likely to have a heart attack</td></tr>");
    $('#riskTable tr:last').after('<tr><td>Your risk of having a heart attack or stroke in the next 5 years</td><td><b>'+risk_msg+"%</b> </td></tr>");
    $('#riskTable tr:last').after('<tr><td>Percentile </td><td><b>'+percentile_msg+"</b> % of people your age and gender are less likely to contract CVD than you</td></tr>");
    $('#riskTable tr:last').after('<tr><td>Your risk of having a heart attack or stroke</td><td><b>'+rating_for_age_msg+"</b> for someone your age</td></tr>");

    
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

