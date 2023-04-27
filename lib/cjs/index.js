"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPostmarkEmail = exports.getPlaidLinkToken = exports.getStripeClientAccountCountry = exports.getEnvironmentVariables = exports.goodBye = exports.helloWorld = void 0;
const plaid_1 = require("plaid");
const postmark_1 = require("postmark");
const stripe_1 = __importDefault(require("stripe"));
function helloWorld() {
    const message = "Hello World from my example modern npm package!";
    return message;
}
exports.helloWorld = helloWorld;
function goodBye() {
    const message = "Goodbye from my example modern npm package!";
    return message;
}
exports.goodBye = goodBye;
function getEnvironmentVariables() {
    console.log(`STRIPE_PRIVATE_KEY: ${process.env.STRIPE_PRIVATE_KEY}`);
    console.log(`PLAID_CLIENT_ID: ${process.env.PLAID_CLIENT_ID}`);
    console.log(`PLAID_SECRET: ${process.env.PLAID_SECRET}`);
    console.log(`POSTMARK_API: ${process.env.POSTMARK_API}`);
}
exports.getEnvironmentVariables = getEnvironmentVariables;
function getStripeClientAccountCountry() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.STRIPE_PRIVATE_KEY) {
            throw new Error("STRIPE_PRIVATE_KEY environment variable is not defined");
        }
        const stripe = new stripe_1.default(process.env.STRIPE_PRIVATE_KEY, {
            apiVersion: "2022-11-15",
        });
        const accounts = yield stripe.accounts.retrieve();
        if (!(accounts === null || accounts === void 0 ? void 0 : accounts.country)) {
            throw new Error("Unable to obtain Stripe Client Account Country");
        }
        return accounts.country;
    });
}
exports.getStripeClientAccountCountry = getStripeClientAccountCountry;
function getPlaidLinkToken() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.PLAID_CLIENT_ID) {
            throw new Error("PLAID_CLIENT_ID environment variable is not defined");
        }
        if (!process.env.PLAID_SECRET) {
            throw new Error("PLAID_SECRET environment variable is not defined");
        }
        const configuration = new plaid_1.Configuration({
            basePath: plaid_1.PlaidEnvironments.production,
            baseOptions: {
                headers: {
                    "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
                    "PLAID-SECRET": process.env.PLAID_SECRET,
                },
            },
        });
        const client = new plaid_1.PlaidApi(configuration);
        const test = yield client.linkTokenCreate({
            client_name: "Safe Rate",
            country_codes: [plaid_1.CountryCode.Us],
            language: "en",
            products: [plaid_1.Products.Auth],
            user: {
                client_user_id: "07816aff-4bb4-407c-81e9-04afd4cd5022",
            },
            redirect_uri: "https://saferate.com/account",
        });
        if (!((_a = test === null || test === void 0 ? void 0 : test.data) === null || _a === void 0 ? void 0 : _a.link_token)) {
            throw new Error("Unable to obtain Plaid Link Token");
        }
        return test.data.link_token;
    });
}
exports.getPlaidLinkToken = getPlaidLinkToken;
function sendPostmarkEmail() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.POSTMARK_API) {
            throw new Error("POSTMARK_API environment variable is not defined");
        }
        const postmarkClient = new postmark_1.ServerClient(process.env.POSTMARK_API);
        const result = yield postmarkClient.sendEmailWithTemplate({
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
        if (!(result === null || result === void 0 ? void 0 : result.MessageID)) {
            throw new Error("Unable to send Postmark email");
        }
        return result.MessageID;
    });
}
exports.sendPostmarkEmail = sendPostmarkEmail;
exports.default = {
    helloWorld,
    goodBye,
    getEnvironmentVariables,
    getPlaidLinkToken,
    getStripeClientAccountCountry,
    sendPostmarkEmail,
};
