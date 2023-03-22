import { ApiError } from "src/errors/apiError";
import { Twilio } from "twilio";
import ssmService from "./awsServices/ssmService";
import getEnv from "./utils/getEnv";
class TwilioSmsSender {
  private twilioClient: Twilio;
  constructor() {
    this.twilioClient = new Twilio(
      getEnv("TWILIO_ACCOUNT_SID") as string,
      getEnv("TWILIO_AUTH_TOKEN") as string
    );
  }
  sendMessage = async (message: string, clientNumber: string) => {
    const { Parameter } = await ssmService.getParameter(
      getEnv("TWILIO_PHONE_NUMBERS_PARAM_NAME") as string
    );
    if (!Parameter) {
      throw ApiError.NotFound(`Parameter TWILIO_PHONE_NUMBERS`);
    }
    const { Value: paramValue } = Parameter;
    if (!paramValue) {
      throw ApiError.NotFound(`Parameter TWILIO_PHONE_NUMBERS`);
    }
    const numbers = paramValue.split(",");
    const number = numbers[Math.floor(Math.random() * numbers.length)];
    return await this.twilioClient.messages.create({
      from: number,
      to: clientNumber,
      body: message,
    });
  };
}
const twilioSmsSender = new TwilioSmsSender();
export default twilioSmsSender;
