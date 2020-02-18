var AWS = require('aws-sdk');
const fs = require('fs');
        
function invoke (action, settings) {
    return new Promise((resolve, reject) => {
        if (!settings.AWS_ACCESS_KEY_ID || !settings.AWS_SECRET_ACCESS_KEY || !action.params.region || !action.params.functionName){
            return reject("missing..." + JSON.stringify(settings) + " and " + JSON.stringify(action));
        }
        AWS.config.region = action.params.region;
        accessKeyId = settings.AWS_ACCESS_KEY_ID
        secretAccessKey = settings.AWS_SECRET_ACCESS_KEY
        AWS.config.update({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
        let latest = '2015-03-31'
        let lambda = new AWS.Lambda({apiVersion: latest});
        let params = {
            FunctionName: action.params.functionName, /* required */
        };
        lambda.invoke(params, function(err, data) {
            if (err) // Invoke failed
            {
                return reject("Error Invoking function: " + err);
            } 
            else
            {
                return resolve(data);
            }   // successful response
          });
    });
}

function createFunction (action, settings) {
    return new Promise((resolve, reject) => {
        if (!settings.AWS_ACCESS_KEY_ID || !settings.AWS_SECRET_ACCESS_KEY || !action.params.region || !action.params.roleArn || !action.params.zipFile || !action.params.functionName || !action.params.handler || !action.params.runtime)
            return reject("One or more fields are missing");
        const apiVersion = 'latest';
        const region = action.params.region;
        accessKeyId = settings.AWS_ACCESS_KEY_ID
        secretAccessKey = settings.AWS_SECRET_ACCESS_KEY
        AWS.config.update({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey});
        const lambda = new AWS.Lambda({ apiVersion, region });
        const zipContents = fs.readFileSync(action.params.zipFile);

        const params = {
            Code: {
                ZipFile: zipContents,
            },
            FunctionName: action.params.functionName,
            Handler: action.params.handler,
            Role: action.params.roleArn,
            Runtime: action.params.runtime,
        };

        lambda.createFunction(params, function(err, data) {
            if (err) // Invoke failed
            {
                return reject("Error Invoking function: " + err);
            } 
            else
            {
                return resolve(data);
            }   // successful response
        });
    });
}


module.exports = {
    invoke: invoke,
    createFunction: createFunction
};