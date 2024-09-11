# Payment Gateway API

## Overview

The Payment Gateway API is designed to streamline the transaction process for merchants by offering a robust and secure platform for processing payments and retrieving transaction details. This API serves as a bridge between merchants' systems and the financial networks required to process payments.

## Features

- **Process Payments:** Merchants can submit payment requests to process transactions.
- **Retrieve Payment Details:** Merchants can fetch details of previously processed payments for reconciliation and reporting.
- **Download PDF Report:** Merchants can download a report of previsouly processed payments during a specific date range.

## Prerequisites

Before starting with the project, ensure you have the following installed:

- **Node.js**: Download and install it from [Node.js official website](https://nodejs.org/).

- **MongoDB**: You can install MongoDB locally from [MongoDB's official site](https://www.mongodb.com/try/download/community), or use a cloud-based MongoDB service like MongoDB Atlas.

- **NestJS CLI**: Install it globally via npm with the command:

```bash
npm i -g @nestjs/cli
```

- **Docker and Docker-compose:** (Only if you want to run it with Docker) [Docker](https://docs.docker.com/get-docker/)

## Setup and Running

### Local

First, install everything listed below and:

```bash
npm install
cp .env.example .env
npm run start:dev
```

### With docker-compose

To run the project using Docker Compose, ensure you have Docker and Docker Compose installed on your machine.

```bash
docker-compose up --build # to build and run all the services
```

Once everything is setup, you should have access to the documentation here [http://localhost:3000](http://localhost:3000)

## Assumptions

To begin integration with our payment gateway, please note the following assumptions:

- It is assumed that a `merchantId` already exists for each merchant intending to use the payment gateway. This `merchantId` is crucial for identifying transactions and must be included in all payment processing requests.

- The integration process and API interactions do not require authentication via API keys or tokens. This simplifies the initial setup and testing phases but I's more than important.

## Example: Processing and retrieving Payment

### Use the deployed link

The project is deployed on [Heroku](heroku.com). You can get access to the docs just here -> [Payment Gateway Docs](https://payment-gateway-checkout-40c94f1a7134.herokuapp.com/api/v1/docs)

### In local

To process a payment, merchants need to submit a payment request to our payment gateway. Here's an example with `curl`:

```bash
curl -X POST http://localhost:3000/process-payment \
-H "Content-Type: application/json" \
-d '{
    "merchantId": "12345",
    "card_number": "4242424242424242",
    "expiry_month": "12",
    "expiry_year": "2023",
    "amount": 100.00,
    "currency": "USD",
    "cvv": "123"
}'
```

This action create a Payment with all the necessary information with an unique identifier.

You can then use all of the following routes to interact:

| Description                                   | URL                                    | Method |
| --------------------------------------------- | -------------------------------------- | ------ |
| Create a payment                              | `/payment`                             | POST   |
| Get a payment by id                           | `/payment/{id}`                        | GET    |
| Get all payments made by a merchant           | `/payment/merchant/{merchantId}`       | GET    |
| Get last payment made by a merchant           | `/payment/last/{merchantId}`           | GET    |
| Get payments made by a merchant by date range | `/payment/range/{merchantId}`          | GET    |
| Download a report                             | `payment/download-report/{merchantId}` | GET    |

You can find all the routes with all the details on the [Postman Collection](https://www.postman.com/api-guys/workspace/payment-gateway/collection/12176888-861a50de-333e-488b-8193-674cadd6c034?action=share&creator=12176888) or directly on the Swagger Documentation

## Improvements

- Add more tests to get to 100% coverage
- Use AWS for scalability (Lambda, API Gateway, DynamoDB)
- Add Authentication
- Think about the best way to save credit cards informations
- Check Currency with External API
