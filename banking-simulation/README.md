# Banking Simuation API

## Overview

The Credit Card Verification API is a simple, secure, and efficient way to validate credit card information. This RESTful API checks the validity of credit card numbers, expiration dates, and CVV codes, ensuring that all provided details are accurate and up-to-date. It's designed for businesses and developers who require a straightforward method to verify credit card details before processing payments or for validation purposes.

## Features

- **Credit Card Number Validation**: Verify the format and issuer of credit card numbers (Assuming that to be a valid card, it should start with `4` or `5`)
- **Expiration Date Check:** Ensure that the credit card is not expired.
- **CVV:** Ensure that it's 3 caracters

## Prerequisites

- Python (version 3.7 or later) [python.org](https://www.python.org/downloads/)
- FastAPI
- Uvicorn (for serving the application)

FastAPI and Uvicorn can be installed using pip:

```bash
pip install fastapi uvicorn
```

## Setup and Running

### Local

You can first setup a virtual environment:
```bash
python -m venv venv
source venv/bin/activate # Activate your environment
```

Then, install the dependencies:

```bash
pip install -r requirements.txt
```

Now, you can run the application directly on your machine.

```bash
uvicorn app.main:app --reload
```

### With Docker

You can also use Docker to run it. First, make sure to install it on your machine [Docker](https://docs.docker.com/get-docker/)

```bash
docker build -t banking-simulation . # Build the image
docker run -d -p 8000:8000 banking-simulation # Run the container
```

## Example: Processing a Payment

### Use the deployed link

The project is deployed on [fly.io](fly.io). You can get access to the docs just here -> [Banking Simulation Docs](https://banking-simulation-d3f095fedcaa.herokuapp.com/docs#/)

### In local

To process a payment, send a POST request to the `/process-payment` endpoint with the credit card information in the body. Here's an example using `curl`:

```bash
curl -X POST http://localhost:8000/process-payment \
     -H "Content-Type: application/json" \
     -d '{"cardNumber": "1234567890123456", "expiryDate": "12/23", "cvv": "123"}'
```

This request will initiate the payment processing for the provided credit card details. If the card details are valid, you will receive a response indicating that the payment has been processed successfully.

```json
{
  "status": "success",
  "message": "Payment processed successfully"
}
```

If the card details are invalid, the response will indicate failure:

```json
{
  "status": "failure",
  "message": "Invalid card details"
}
```

## Improvements

- Implement a real verification of the credit cards using an external API
- Add more unit tests
