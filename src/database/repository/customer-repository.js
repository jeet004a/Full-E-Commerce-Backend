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
                .populate('wishlist')
                .populate('orders')
                .populate('cart')
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

    async addToCartItem(userId, product, qty) {
        try {
            const userProfile = await CustomerModel.findById(userId).populate('cart')
            if (userProfile) {
                const cartItem = {
                    product,
                    unit: qty
                }

                let cartItems = userProfile.cart
                let counter = 0
                let index = 0
                for (let i = 0; i < cartItems.length; i++) {
                    if (userProfile.cart[i].product.toString() === product.data._id.toString()) {
                        counter = counter + 1
                        index = i
                    }
                }
                if (counter > 0) {
                    userProfile.cart[index].unit = userProfile.cart[index].unit + 1
                    const data = await userProfile.save()
                    return data
                } else {
                    cartItem.product = product.data._id.toString()
                        // cartItem.unit = 1
                    await userProfile.cart.push(cartItem)
                    const data = await userProfile.save()
                    return data
                }

                // console.log(userProfile.cart[0].product.toString())


            }
        } catch (error) {
            console.log(error)
        }

    }


    // userProfile.cart[i].product.toString()

    async deleteToCartItem(customerId, productId) {
        try {
            const userProfile = await CustomerModel.findById(customerId).populate('cart')
            let flag
            if (userProfile) {
                for (let i = 0; i < userProfile.cart.length; i++) {
                    if (userProfile.cart[i].product.toString() === productId.toString()) {
                        if (userProfile.cart[i].unit > 1) {
                            userProfile.cart[i].unit = userProfile.cart[i].unit - 1
                            const data = await userProfile.save()
                            return data
                        } else if (userProfile.cart[i].unit === 1) {
                            userProfile.cart.splice(1, 1)
                            const data = await userProfile.save()
                            return data
                                // console.log(userProfile)
                        } else {
                            return "Data Not Found"
                        }
                    } else {
                        flag = "Data not found"
                    }
                }
                return flag
            }
        } catch (error) {
            console.log(error)
        }
    }







}

module.exports = CustomerRepository