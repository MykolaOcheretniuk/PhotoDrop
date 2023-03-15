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
          Time: Math.floor(Date.now() / 1000),
        },
      })
      .promise();
  };
}

const confirmationCodesStorage = new ConfirmationCodesStorage();
export default confirmationCodesStorage;
