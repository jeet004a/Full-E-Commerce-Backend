const { CustomerModel } = require('../models')

class ShoppingRepository {
    async Orders() {
        console.log('Shopping Repo')
    }


    async CreateNewOrder(customerId, txnId) {
        try {
            const profile = await CustomerModel.findById(customerId)
            if (profile) {
                console.log(profile.cart)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ShoppingRepository