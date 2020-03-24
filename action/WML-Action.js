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
            url: "https://us-south.ml.cloud.ibm.com/v3/identity/token",
            headers: {
                "Content-Type": "application/json"
            },
            auth: {
                // TODO: Replace "pass" with äpikey" from credentials of Watson Machine Learning service
                user: "apikey",
                pass: "<API Key>"
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
        const body = {fields: ["BPM", "PPD", "COLESTEROL", "MC", "IDADE", "SEXO", "HF", "FUMANTE5ANOS", "EPS"], 
      values: [[params.BPM,params.PPD,params.COLESTEROL,params.MC,params.IDADE,params.SEXO,params.HF,params.FUMANTE5ANOS,params.EPS]]};
        
        // TODO: Create a acces token:
        // curl -X POST 'https://iam.cloud.ibm.com/identity/token' -H 'Content-Type: application/x-www-form-urlencoded' -d 'grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=<WML API Key>'
        const _token = {"access_token":......"};

        getToken().then(token => {
            const options = {
                // TODO: Replace with SCORING END-POINT from IMPLEMENTATION tab on Watson Machine Learning deployment, on Watson Studio
                url: "https://us-south.ml.cloud.ibm.com/v3/wml_instances/d696b5ac-7042-45ef-84cf-0dd33d77de3a/deployments/0dfd4a78-5b21-432e-90bc-fb8f5e5aa589/online",
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
