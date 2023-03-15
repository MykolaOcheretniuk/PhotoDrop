import AWS from "aws-sdk";
class SsmService {
  private ssmClient = new AWS.SSM();

  getParameter = async (paramName: string) => {
    const param = await this.ssmClient
      .getParameter({
        Name: paramName,
        WithDecryption: false,
      })
      .promise();
    return param;
  };
}
const ssmService = new SsmService();
export default ssmService;
