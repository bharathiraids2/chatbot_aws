import {
  BedrockRuntimeClient,
  InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime';

export const handler = async (event) => {
  const bedrock = new BedrockRuntimeClient({
    serviceId: 'bedrock',
    region: 'ap-south-1',
  });
  try {
    const input = event.queryStringParameters?.input || "";

    if (!input) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({ error: "Missing input" }),
      };
    }

    const bedrock = new BedrockRuntimeClient({
      region: 'ap-south-1',
    });

    const command = new InvokeModelCommand({
      modelId: 'amazon.titan-text-express-v1',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        inputText: input
      })
    });

    const response = await bedrock.send(command);
    const decoded = new TextDecoder().decode(response.body);
    const parsed = JSON.parse(decoded);
    const output = parsed.results?.[0]?.outputText || "No response generated.";

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({ message: output }),
    };
    
  } catch (error) {
    console.error("Bedrock Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
