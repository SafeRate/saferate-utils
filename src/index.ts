import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";
import { ServerClient } from "postmark";
import Stripe from "stripe";

export function helloWorld() {
  const message = "Hello World from my example modern npm package!";
  return message;
}

export function goodBye() {
  const message = "Goodbye from my example modern npm package!";
  return message;
}

export function getEnvironmentVariables() {
  console.log(`STRIPE_PRIVATE_KEY: ${process.env.STRIPE_PRIVATE_KEY}`);
  console.log(`PLAID_CLIENT_ID: ${process.env.PLAID_CLIENT_ID}`);
  console.log(`PLAID_SECRET: ${process.env.PLAID_SECRET}`);
  console.log(`POSTMARK_API: ${process.env.POSTMARK_API}`);
}

export async function getStripeClientAccountCountry(): Promise<string> {
  if (!process.env.STRIPE_PRIVATE_KEY) {
    throw new Error("STRIPE_PRIVATE_KEY environment variable is not defined");
  }
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
    apiVersion: "2022-11-15",
  });

  const accounts = await stripe.accounts.retrieve();
  if (!accounts?.country) {
    throw new Error("Unable to obtain Stripe Client Account Country");
  }

  return accounts.country;
}

export async function getPlaidLinkToken(): Promise<string> {
  if (!process.env.PLAID_CLIENT_ID) {
    throw new Error("PLAID_CLIENT_ID environment variable is not defined");
  }

  if (!process.env.PLAID_SECRET) {
    throw new Error("PLAID_SECRET environment variable is not defined");
  }

  const configuration = new Configuration({
    basePath: PlaidEnvironments.production,
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
        "PLAID-SECRET": process.env.PLAID_SECRET,
      },
    },
  });

  const client = new PlaidApi(configuration);
  const test = await client.linkTokenCreate({
    client_name: "Safe Rate",
    country_codes: [CountryCode.Us],
    language: "en",
    products: [Products.Auth],
    user: {
      client_user_id: "07816aff-4bb4-407c-81e9-04afd4cd5022",
    },
    redirect_uri: "https://saferate.com/account",
  });

  if (!test?.data?.link_token) {
    throw new Error("Unable to obtain Plaid Link Token");
  }

  return test.data.link_token;
}

export async function sendPostmarkEmail(): Promise<string> {
  if (!process.env.POSTMARK_API) {
    throw new Error("POSTMARK_API environment variable is not defined");
  }

  const postmarkClient = new ServerClient(process.env.POSTMARK_API);
  const result = await postmarkClient.sendEmailWithTemplate({
    From: "team@saferate.com",
    To: "dylan@saferate.com",
    TemplateAlias: "to-agent-saver-linked-to-agent",
    TemplateId: 28144270,
    TemplateModel: {
      agentFirstName: "Agent first name",
      borrowerFirstName: "Borrower first name",
      borrowerLastName: "Borrower last name",
      loginUrl: "https://www.google.com",
      saverAgentCredits: "$1,000",
      toEmail: "dylan@saferate.com",
      toName: "Dylan Hall",
    },
  });

  if (!result?.MessageID) {
    throw new Error("Unable to send Postmark email");
  }

  return result.MessageID;
}

export default {
  helloWorld,
  goodBye,
  getEnvironmentVariables,
  getPlaidLinkToken,
  getStripeClientAccountCountry,
  sendPostmarkEmail,
};
