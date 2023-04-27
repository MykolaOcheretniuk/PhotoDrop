import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from "aws-lambda";
import { JwtPayload } from "jsonwebtoken";
import personsRepository from "src/db/repositories/personsRepository";
import rolesRepository from "src/db/repositories/rolesRepository";
import { ApiError } from "src/errors/apiError";
import jwtTokensService from "src/services/utils/jwtTokensService";

export async function handler(
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> {
  try {
    const { authorizationToken } = event;
    const { personId, personRole } =
      (await jwtTokensService.validateAccessToken(
        authorizationToken
      )) as JwtPayload;
    const person = await personsRepository.getById(personId);
    if (!person) {
      throw ApiError.NotFound("Person");
    }
    const { title: roleTitle } = await rolesRepository.personRole(personId);
    if (roleTitle !== personRole) {
      throw ApiError.IncorrectRole();
    }
    return {
      principalId: personId,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: event.methodArn,
          },
        ],
      },
      context: {
        role: personRole,
        personId: personId,
      },
    };
  } catch (err) {
    return {
      principalId: "principalId",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: event.methodArn,
          },
        ],
      },
    };
  }
}
