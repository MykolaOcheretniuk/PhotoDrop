import { DynamoDB } from "aws-sdk";

export class ConfirmationCodesStorage {
  private dbClient = new DynamoDB.DocumentClient();
  private table = "PhoneNumberConfirmationCode";

  addCode = async (phoneNumber: string, code: string) => {
    await this.dbClient
      .put({
        TableName: this.table,
        Item: {
          PhoneNumber: phoneNumber,
          Code: code,
          SentTime: Math.floor(Date.now() / 1000),
          ResendTries: 1,
        },
      })
      .promise();
  };
  findExistingCode = async (phoneNumber: string) => {
    return await this.dbClient
      .get({
        TableName: this.table,
        Key: {
          PhoneNumber: phoneNumber,
        },
      })
      .promise();
  };
  resendUpdate = async (phoneNumber: string, code: string) => {
    const time = Math.floor(Date.now() / 1000);
    await this.dbClient
      .update({
        TableName: this.table,
        Key: {
          PhoneNumber: phoneNumber,
        },
        UpdateExpression:
          "set Code = :Code, ResendTries = :ResendTries, SentTime = :SentTime",
        ExpressionAttributeValues: {
          ":Code": code,
          ":ResendTries": 0,
          ":SentTime": time,
        },
      })
      .promise();
  };
  deleteCode = async (phoneNumber: string) => {
    await this.dbClient.delete({
      TableName: this.table,
      Key: {
        PhoneNumber: phoneNumber,
      },
    });
  };
}

const confirmationCodesStorage = new ConfirmationCodesStorage();
export default confirmationCodesStorage;
