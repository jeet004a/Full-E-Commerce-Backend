const { CustomerModel, AddressModel } = require("../models");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

class CustomerRepository {
    async CreateCustomer({ email, password, phone, salt }) {
        try {
            const customer = new CustomerModel({
                email,
                password,
                salt,
                phone,
                address: [],
            });
            const customerResult = await customer.save();
            return customerResult;
            // console.log('DB Email', email)
        } catch (error) {
            console.log(error)
        }
    }
    async FindCustomer({ email }) {
        try {
            const existingCustomer = await CustomerModel.findOne({ email: email })
            return existingCustomer
        } catch (error) {
            console.log('Error from customer-repository', error)
        }
    }

    async CreateAddress(_id, { street, postalcode, city, country }) {
        try {
            const profile = await CustomerModel.findById({ _id })
            if (profile) {
                const newAddress = await new AddressModel({
                    street,
                    postalcode,
                    city,
                    country
                })
                await newAddress.save()
                await profile.address.push(newAddress)
            }


            return profile.save()
        } catch (error) {
            console.log('Repository Create Address', error)
        }
    }


    async FindCustomerById(_id) {
        try {
            const existingCustomer = await CustomerModel.findById({ _id })
                .populate('address')
                // .populate('wishlist')
                // .populate('orders')
                // .populate('cart')
            return existingCustomer
        } catch (error) {

        }
    }


    async AddWishlistItem(customerId, product) {
        try {
            const profile = await CustomerModel.findById(customerId).populate('address')
                // console.log(profile.wishlist.toString())
                // console.log(product.data._id.toString())
            let counter = 0
            for (let i = 0; i < profile.wishlist.length; i++) {
                if (profile.wishlist[i].toString() === product.data._id.toString()) {
                    counter = counter + 1
                }
            }
            if (counter > 0) {
                console.log("Data Already Added")
                return "Item Already Added To Your WishList"
            } else {
                profile.wishlist.push(product.data._id.toString())
                const data = await profile.save()

                return data
            }
        } catch (error) {
            console.log(error)
        }

    }




    async deleteToWishListItem(customerId, product) {
        const userProfile = await CustomerModel.findById(customerId)
            // console.log(userProfile.wishlist)
        const index = userProfile.wishlist.indexOf(product.data._id.toString())
        if (index > -1) {
            userProfile.wishlist.splice(index, 1) //
        } else {
            return "Item is not present into your wishlist"
        }
        const data = await userProfile.save()
        return data
    }
}
//hello
module.exports = CustomerRepository