/**
  *
  * main() will be executed when this action be triggered
  *
  * @param Is the only way to pass parameters to an action, and it mus be a JSON
  *
  * @return Output of action and must be a JSON format
  *
  * TO TEST: {"AVGHEARTBEATSPERMIN":93,"PALPITATIONSPERDAY":22,"CHOLESTEROL":180,"BMI":23,"AGE":52,"SEX":"M","FAMILYHISTORY":"Y","SMOKERLAST5YRS":"Y","EXERCISEMINPERWEEK":0}
  */
const request = require('request');
function main(params) {
    const getToken = () => {
        const options = {
            // us-south if the region of your service is Dallas
            url: "https://us-south.ml.cloud.ibm.com/v3/identity/token",
            headers: {
                "Content-Type": "application/json"
            },
            auth: {
                // TODO: Replace "pass" with äpikey" from credentials of Watson Machine Learning service
                user: "apikey",
                pass: "<API KEY>"
            },
            json: true
        };
        return new Promise((resolve, reject) => {
            request.get(options, (error, resp, body) => {
                if (error) reject(error);
                else {
                    resolve(body.token);
                }
            });
        });
    };

    return new Promise((resolve, reject) => {
        const body = {fields: ["AVGHEARTBEATSPERMIN", "PALPITATIONSPERDAY", "CHOLESTEROL", "BMI", "AGE", "SEX", "FAMILYHISTORY", "SMOKERLAST5YRS", "EXERCISEMINPERWEEK"], 
      values: [[params.AVGHEARTBEATSPERMIN,params.PALPITATIONSPERDAY,params.CHOLESTEROL,params.BMI,params.AGE,params.SEX,params.FAMILYHISTORY,params.SMOKERLAST5YRS,params.EXERCISEMINPERWEEK]]};
        
        // TODO: Create a acces token:
        // curl -X POST 'https://iam.cloud.ibm.com/identity/token' -H 'Content-Type: application/x-www-form-urlencoded' -d 'grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=<WML API Key>'
        const _token = {"access_token":"<ACCESS TOKEN>"};

        getToken().then(token => {
            const options = {
                // TODO: Replace with SCORING END-POINT from IMPLEMENTATION tab on Watson Machine Learning deployment, on Watson Studio
                url: "<SCORING END-POINT URL>",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ` + _token.access_token
                },
                body: body,
                json: true
            };
            request.post(options, (error, resp, data) => {
                if (error) reject(error);
                else if (data.errors) {
                    resolve({
                        "err": true,
                        "result": data.errors[0].message
                    });
                }
                else {
                    resolve({
                        "err": false,
                        "result": data.values[0][0],
                        "confidence": data.values[0][1]
                    });
                }
            });
        }).catch(err => reject(err));
    });
}
