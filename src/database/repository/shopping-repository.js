const { CustomerModel } = require('../models')
const { OrderModel } = require('../models')
const { v4: uuid } = require('uuid')
class ShoppingRepository {
    async Orders() {
        console.log('Shopping Repo')
    }


    async CreateNewOrder(customerId, txnId) {
        try {
            const userProfile = await CustomerModel.findById(customerId).populate('cart.product')
            if (userProfile) {
                let orderAmount = 0
                let cartItem = userProfile.cart
                if (cartItem.length > 0) {
                    cartItem.map(item => {
                        orderAmount += item.product.price * item.unit
                    })
                    let orderNumber = uuid()


                    const order = new OrderModel({
                        orderId: orderNumber,
                        customerId: customerId,
                        amount: orderAmount,
                        status: 'received',
                        txnId: txnId,
                        items: cartItem
                    })

                    userProfile.cart = []

                    order.populate('items.product');
                    const orderResult = await order.save();

                    userProfile.orders.push(orderResult)

                    const userData = await userProfile.save()

                    return userData
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ShoppingRepository