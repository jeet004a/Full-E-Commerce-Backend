const mongoose = require('mongoose')


const Schema = mongoose.Schema

const OrderSchema = new mongoose.Schema({
        orderId: String,
        customerId: String,
        amount: Number,
        status: String,
        txnId: String,
        items: [{
            product: { type: Schema.Types.ObjectId, ref: 'product', require: true },
            unit: { type: Number, require: true }
        }],
    }, {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            }
        },
        timestamps: true
    }

)

module.exports = mongoose.model('order', OrderSchema)