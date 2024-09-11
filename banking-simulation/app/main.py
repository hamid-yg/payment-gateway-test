import logging

from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel, Field
from datetime import datetime

logging.basicConfig(level=logging.INFO)

app: FastAPI = FastAPI()


class CardInfoRequest(BaseModel):
    cardNumber: str = Field(..., min_length=16, max_length=16)
    expiryMonth: int = Field(..., gt=0, lt=13)
    expiryYear: int
    cvv: str = Field(..., min_length=3, max_length=3)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/health")
def health():
    logging.info("Health check")

    return {"status": "OK"}


def is_card_valid(card_info: CardInfoRequest) -> bool:
    current_year = datetime.now().year
    current_month = datetime.now().month
    if card_info.expiryYear < current_year or (card_info.expiryYear == current_year and card_info.expiryMonth < current_month):
        return False
    if not card_info.cardNumber.startswith("4") and not card_info.cardNumber.startswith("5"):
        return False
    return True


@app.post("/process-payment")
def process(card_info: CardInfoRequest, res: Response):
    cardNumber = '*' * 12 + card_info.cardNumber[-4:]
    logging.info(f"Payment processing initiated for card: {cardNumber}")
    if not is_card_valid(card_info):
        logging.error(f"Invalid card details: {cardNumber}")
        res.status_code = 400
        return {"status": "failure", "message": "Invalid card details"}
    logging.info(f"Payment processed successfully for card: {cardNumber}")
    return {"status": "success", "message": "Payment processed successfully"}
