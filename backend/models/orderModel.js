import mongoose from "mongoose";

// Function to convert UTC date to Indonesian time (WIB, UTC+7)
const convertToIndonesianTime = (date) => {
    if (!date) return null;
    const indonesianTimeOffset = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
    return new Date(date.getTime() + indonesianTimeOffset);
};

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "Pesanan Diproses" },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false }
});

// Method to get the order date in Indonesian time
orderSchema.methods.getIndonesianDate = function () {
    return convertToIndonesianTime(this.date);
};

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;