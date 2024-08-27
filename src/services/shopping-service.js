const { ShoppingRepository } = require('../database')

class ShoppingService {
    constructor() {
        this.repository = new ShoppingRepository()
    }

    async GetOrder() {
        try {
            await this.repository.Orders()
        } catch (error) {
            console.log(error)
        }
    }

    async PlaceOrder(userInputs) {
        const { _id, txnNumber } = userInputs

        const orderResult = await this.repository.CreateNewOrder(_id, txnNumber)
    }
}

module.exports = ShoppingService