import { DynamoDB } from "aws-sdk";

export class DynamoDBRefreshTokensStorage {
  private dbClient = new DynamoDB.DocumentClient();
  private table = "PersonIdRefreshToken";

  addRefreshToken = async (personId: string, refreshToken: string) => {
    await this.dbClient
      .put({
        TableName: this.table,
        Item: {
          PersonId: personId,
          RefreshToken: refreshToken,
        },
      })
      .promise();
  };
  findRefreshToken = async (personId: string) => {
    return await this.dbClient
      .get({
        TableName: this.table,
        Key: {
          PersonId: personId,
        },
      })
      .promise();
  };
}

const refreshTokensStorage = new DynamoDBRefreshTokensStorage();
export default refreshTokensStorage;
