/**
  *
  * main() will be executed when this action be triggered
  *
  * @param Is the only way to pass parameters to an action, and it mus be a JSON
  *
  * @return Output of action and must be a JSON format
  *
  * TO TEST: {"BPM":93,"PPD":22,"COLESTEROL":180,"MC":23,"IDADE":52,"SEXO":"M","HF":"S","FUMANTE5ANOS":"S","EPS":120}
  */
const request = require('request');
function main(params) {
const getToken = () => {
    const options = {
        // us-south if the region of your service is Dallas
        url: "https://iam.cloud.ibm.com/identity/token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        form: {
            grant_type: "urn:ibm:params:oauth:grant-type:apikey",
            // TODO: Create a IBM Cloud API Key and copy it below:
            apikey: "<API KEY>"
        },
        json: true
    };
    return new Promise((resolve, reject) => {
        request.post(options, (error, resp, body) => {
            if (error) reject(error);
            else {
                resolve(body.access_token);
            }
        });
    });
};

    return new Promise((resolve, reject) => {
       const body = {
            "input_data": [
                    {fields: 
                       ["BPM", "PPD", "COLESTEROL", "MC", "IDADE", "SEXO", "HF", "FUMANTE5ANOS", "EPS"], 
                     values: 
                       [[params.BPM,params.PPD,params.COLESTEROL,params.MC,params.IDADE,params.SEXO,params.HF,params.FUMANTE5ANOS,params.EPS]]}
                ]};
        
        // TODO: Create a acces token:
        // The command below you get on implementation tab WML deployment
        // curl -X POST 'https://iam.cloud.ibm.com/identity/token' -H 'Content-Type: application/x-www-form-urlencoded' -d 'grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=<WML API Key>'
        // Use the follwing token only if the getToken fail
        const _token = {"access_token":<ACCESS_TOKEN>};
        getToken().then(token => {
            const options = {
                // TODO: Replace with SCORING END-POINT from IMPLEMENTATION tab on Watson Machine Learning deployment, on Watson Studio
                url: "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/sdp1/predictions?version=2023-04-22",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ` + token // _token.access_token (use case we get the token out of this code)
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
                        "err": false, "result":{
                        "prediction": data.predictions[0].values[0][0],
                        "confidence": data.predictions[0].values[0][1][0]}
                    });
                }
            });
        }).catch(err => reject(err));
    });
}
