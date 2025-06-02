import {
    BedrockRuntimeClient,
    InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime';
export const handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);


    console.log(event.queryStringParameters.input)
    let data = "";
    if (event.queryStringParameters.input.includes("hello")) {
        data = "Hi Bharathi !!!"
    }
    else if (event.queryStringParameters.input.includes("hi")) {
        data = "Hello Bharathi !!!";

    }
    else if (event.queryStringParameters.input.includes("hi")) {
        data = "Hello Bharathi !!!";

    }
    else {
        data = event.queryStringParameters.input
    }


    return {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: data,
    };
};



