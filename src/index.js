
'use strict';

var APP_ID = 'arn:aws:lambda:us-east-1:364345822490:function:HalfStaff';

var http = require('http');
var StringDecoder = require('string_decoder').StringDecoder;

var allFlagHalfStaff='';

var states = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming",
    "USA": "Nation Wide"
};

// --------------- Helpers that build all of the responses -----------------------



function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    //second
    console.log("speechlet");
    return {
        //pretty obvious
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        //what is the point of card?
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        //how is reprompt triggered?
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    //session attributes hold variables for the current session(in this example, the user's favorite color)
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to Half Staff';
        
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = '';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for trying the Half Staff Skill. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function GetStateName(state){

        if(states[state] !=undefined){
        return states[state];
        }
        else{
            return '';
        }
    

}


function GetFullWeek( week, year){
    let weekStart = week * 7;
    let startDate = new Date(year, 0, 1);
    let endDate = new Date(year, 0, 1);
    startDate.setDate(startDate.getDate() + weekStart);
    let dayOfStartWeek = startDate.getDay();
    let daysFromSunday = 0;
    while(dayOfStartWeek > 0 ){

        dayOfStartWeek --;
        daysFromSunday --;
    }
    let weekEnd = weekStart + daysFromSunday + 6;
    startDate.setDate(startDate.getDate() + daysFromSunday);
    endDate.setDate(endDate.getDate() + weekEnd);
    let retDate = startDate.toLocaleDateString() + "-" + endDate.toLocaleDateString();
    return retDate;

}
function GetWeekEnd( week, year){

    let weekStart = week * 7;
    let startDate = new Date(year, 0, 1);
    let endDate = new Date(year, 0, 1);
    startDate.setDate(startDate.getDate() + weekStart);
    let dayOfStartWeek = startDate.getDay();
    let daysFromFriday = 0;
    while(dayOfStartWeek !== 5 ){

            if(dayOfStartWeek > 5){
                dayOfStartWeek --;
                daysFromFriday --;
                continue;
            }

            if(dayOfStartWeek < 5){
                dayOfStartWeek ++;
                daysFromFriday ++;
                continue;
            }
    }
    let weekEnd = weekStart + daysFromFriday + 2;
    startDate.setDate(startDate.getDate() + daysFromFriday);
    endDate.setDate(endDate.getDate() + weekEnd);
    let retDate = startDate.toLocaleDateString() + "-" + endDate.toLocaleDateString();
    return retDate;
}

function GetFullSeason(givenYear, season){
    //SU, WI, SP, FA
    let startMonth = 0;
    let startDay = 1;
    let endMonth = 0;
    let endDay = 1;
    let yearAsInt = parseInt(givenYear);

    if(season == "SP"){
        startMonth =2;
        startDay = 20;
        endMonth = 5;
        endDay = 21;
    }
    if(season == "SU"){
        startMonth =5;
        startDay = 21;
        endMonth = 8;
        endDay = 22;
       

    }
    if(season == "FA"){
        startMonth =8;
        startDay = 22;
        endMonth = 11;
        endDay = 21;

    }
    if(season == "WI"){
        startMonth =11;
        startDay = 21;
        endMonth = 2;
        endDay = 20;
        yearAsInt = yearAsInt +1;

    }
    let startDate = new Date(givenYear, startMonth, startDay);
    let endDate = new Date(yearAsInt, endMonth, endDay);
    let retDate = startDate.toLocaleDateString() + "-" + endDate.toLocaleDateString();
    return retDate;

}

function GetFullMonth(year, month){
    let yearAsInt = parseInt(year);
    let monthAsInt = parseInt(month) -1;
    let endDay = 1;
    let startDate = new Date(yearAsInt, monthAsInt, 1);
    let endDate = new Date(yearAsInt, monthAsInt, 1);

    if(monthAsInt == 11){
        let yearPlusOne = yearAsInt + 1;
        endDate = new Date(yearPlusOne, 0, 1);

    }
    else{
        let yearPlusOne = monthAsInt + 1;
       endDate = new Date(yearAsInt, monthAsInt, 1);
    }
    
    endDate.setDate(endDate.getDate() - 1);

    let retDate = startDate.toLocaleDateString() + "-" + endDate.toLocaleDateString();
    return retDate;

}

function GetFullYear(year){
    let startDate = new Date(year, 0, 1);
    let endDate = new Date(year, 11, 31);
    let retDate = startDate.toLocaleDateString() + "-" + endDate.toLocaleDateString();
    return retDate;
}

//who the fuck's going to ask for a full decace?
function GetFullDecade(decade){
    let decadeStartString = decade.substring(0,3) + '0';
    let decadeStartInt = parseInt(decadeStartString);
    let decadeEndInt = decadeStartInt + 9;
    

    let startDate = new Date(decadeStartInt, 0, 1);
    let endDate = new Date(decadeEndInt, 11, 31);
    let retDate = startDate.toLocaleDateString() + "-" + endDate.toLocaleDateString();
    return retDate;
}

function parseAmazonDate(date) {
    var splitDate = date.split('-');
    var retDate = "";
    var reg = new RegExp('^[0-9]+$');
    if (splitDate.length - 1 == 2) {
        //checks amazon date format for 20xx-Wxx-WE (weekend)
        if (date.indexOf('W') != -1) {
            var year = splitDate[0];
            var week = parseInt(splitDate[1].substring(1));
           retDate = GetWeekEnd(week,year);
            return retDate;
        }
        //else this is a single day
        var standardDate = new Date(date).toLocaleDateString();
        retDate += standardDate + "-" + standardDate;
        return retDate;

    }

    if (splitDate.length - 1 == 1) {
        
        //checks for season
        if(reg.test(splitDate[1].substring(1)) == false){
           var year = splitDate[0];
           var season = splitDate[1];
           retDate = GetFullSeason(year,season);
            return retDate;

        }
        //checks amazon date format for 20xx-Wxx (week)
        if (date.indexOf('W') != -1) {
            var year = splitDate[0];
            var week = parseInt(splitDate[1].substring(1));
            retDate = GetFullWeek(week,year);
            return retDate;
        }
         //else this is an entire month
        else{
            var year = splitDate[0];
            var month = splitDate[1];
            retDate = GetFullMonth(year,month);
            return retDate;
        }
       
    }
    //else this is a year or decade
    if (splitDate.length - 1 == 0) {
        var year = splitDate[0];
        //decade
        if(reg.test(splitDate[0].substring(2)) == false){
            retDate = GetFullDecade(year);
            return retDate;

        }
        //year
        else{
            retDate = GetFullYear(year);
            return retDate;
        }

    }

}

function GetHalfStaffInfo(intent, session, callback) {

   
    
    var responseString = '';
    const dateSlot = intent.slots.GivenDate;
    const sessionAttributes = {};
    var startDate = new Date().toLocaleDateString('en-US');
    var endDate = new Date().toLocaleDateString('en-US');
    var dateAsString = "";
    var test ='';
      if(dateSlot.value != null){
          test = dateSlot.value;
          const givenDate = dateSlot.value;
          //sessionAttributes = createDateAttributes(givenDate);
           dateAsString = `${givenDate}`;
          var dateRange = parseAmazonDate(dateAsString);
          var dates = dateRange.split('-');
          
          startDate = new Date(dates[0]).toLocaleDateString('en-US');
          endDate = new Date(dates[1]).toLocaleDateString('en-US');
      }
       
 
    var getReadableData = '';

    var arr = allFlagHalfStaff.split("<item>");
    var allFlagDataArray = [];
//TODO: things
    
        for(var i=0;i<arr.length;i++){
            if(arr[i].indexOf("<title>") != -1 && arr[i].indexOf("<pubDate>") != -1){
            var title = arr[i].substring(arr[i].indexOf("<title>")+7,arr[i].indexOf("</title>"));
            title+=",";

            var description = '';

            //if(arr[i].indexOf("<description>") != -1 ){
              //  description += arr[i].substring(arr[i].indexOf("<description>")+13,arr[i].indexOf("</description>"));
              //  description += ",";
            //}
            
        
           
            
            let pubDate = arr[i].substring(arr[i].indexOf("<pubDate>") + 9, arr[i].indexOf("</pubDate>"));
            let localeDate = new Date(pubDate).toLocaleDateString('en-US');
            var tempObj = {'date': localeDate, 'title':title,  'description':description}
            allFlagDataArray.push(tempObj);
            }

        }
        var returnString = '';
    for(var a in allFlagDataArray){
    let tempDate = new Date(allFlagDataArray[a].date);
    let tempStart = new Date(startDate);
    let tempEnd = new Date(endDate);
        if(tempDate >= tempStart && tempDate <= tempEnd){
            
            returnString += (allFlagDataArray[a].date + ", " + allFlagDataArray[a].title + allFlagDataArray[a].description)
        }
    }
    
   if(returnString.length == 0){
       returnString += "no flags are at half mast at this time."
   }
    const repromptText = null;
   
    let shouldEndSession = false;
    let speechOutput = ("Here's your flag briefing, " + returnString);//: "I could not find any half staff details for the given date.";

    

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);
    http.get('http://halfstaff.org/feed/',  (resp) => {
            var decoder = new StringDecoder('utf8');
           var temp = '';
          
             resp.on('data',  (chunk) => {
                 var textChunk = decoder.write(chunk);
                 var testChunk = chunk.toString();

                
                allFlagHalfStaff += testChunk;
                //fourth
               console.log("in");
                  

        });
        //third
        console.log("out");
              resp.on('end', function () {
                  //last
                   console.log("end")
                   
        });
        console.log("done");
        });
       
        //first
    console.log("really done");
    console.log(allFlagHalfStaff);
    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'GetHalfStaffInfo') {
        
        GetHalfStaffInfo(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}

// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.

exports.handler = (event, context, callback) => {
    try {
        //console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
