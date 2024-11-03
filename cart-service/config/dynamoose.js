import "./dotenv.js";
import dynamoose from "dynamoose";
try {
  const ddb = new dynamoose.aws.ddb.DynamoDB({
    credentials: {
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
      secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_DEFAULT_REGION,
  });
  dynamoose.aws.ddb.set(ddb);
} catch (error) {
  console.log(error);
}
