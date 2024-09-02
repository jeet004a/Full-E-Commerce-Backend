const { ShoppingRepository } = require('../database')
const { FormateData } = require('../utils')
const { APIError, NotFoundError, AppError } = require('../utils/app-errors')

class ShoppingService {
    constructor() {
        this.repository = new ShoppingRepository()
    }

    async GetOrder() {
        try {
            await this.repository.Orders()
        } catch (error) {
            throw new APIError("Data Not found", error);
        }
    }

    async PlaceOrder(userInputs) {
        try {
            const { _id, txnNumber } = userInputs

            const orderResult = await this.repository.CreateNewOrder(_id, txnNumber)
                // await this.repository.CreateNewOrder(_id, txnNumber)
            return FormateData(orderResult)
        } catch (error) {
            throw new APIError("Data Not found", error);
        }
    }
}

module.exports = ShoppingService