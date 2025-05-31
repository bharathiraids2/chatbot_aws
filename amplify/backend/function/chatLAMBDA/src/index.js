

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);


    console.log(event.queryStringParameters.var)
    let data = "";
    if(event.queryStringParameters.var.includes("Hello")){
        data = "Hi Bharathi !!!"
    }
    else{
        data = event.queryStringParameters.var
    }

    
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
     headers: {
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Headers": "*"
     },
        body:data,
    };
};



