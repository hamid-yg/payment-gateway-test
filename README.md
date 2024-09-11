# Payment Gateway and Banking Simulation Project

This project is divided into two main components: the `Payment Gateway` and the `Banking Simulation`. The primary objective is to emulate the functionality of a payment gateway, including the validation and processing of payments.

## Project Overview

- **Payment Gateway**: Acts as the intermediary that verifies payment information before forwarding it to the Banking Simulation for processing. It is responsible for ensuring that all necessary data is accurate and complete for transaction processing.

- **Banking Simulation**: This component is built using FastAPI and simulates the banking system's role in verifying credit card information and determining the outcome of a payment request (success or failure).

## Technology Stack

- **Backend**: Python with FastAPI for the Banking Simulation; NodeJS with NestJS for the Payment Gateway.
- **Database**: MongoDB is used for storing transaction data.

## Getting Started

The project is fully deployed and accessible online. You can interact with both components through their respective documentation and endpoints:

- **Payment Gateway Documentation**: Access the comprehensive API documentation and test endpoints [here](https://payment-gateway-checkout-40c94f1a7134.herokuapp.com/api/v1/docs).

- **Banking Simulation Documentation**: Explore the API and simulate banking transactions [here](https://banking-simulation-d3f095fedcaa.herokuapp.com/docs#/).

For local setup and detailed instructions, please refer to the README files within each project's directory.
