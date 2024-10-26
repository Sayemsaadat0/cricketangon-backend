"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const cow_model_1 = require("../cow/cow.model");
const user_model_1 = require("../user/user.model");
const order_model_1 = require("./order.model");
const getAllOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.find();
    return result;
});
const createOrder = (order) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const { cow } = order;
        const selectedCow = yield cow_model_1.Cow.findById(cow).populate('seller');
        if (!selectedCow) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Cow not found');
        }
        if (selectedCow.label === 'sold out') {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Cow is already Sold out . Try to buy another one');
        }
        const buyerId = order.buyer;
        const buyer = yield user_model_1.User.findById(buyerId);
        if (!buyer || buyer.role !== 'buyer') {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid Buyer');
        }
        if (buyer.budget < selectedCow.price) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Buyer have not enough money. Please Try to add  money and then Buy the cow');
        }
        if (buyer.budget) {
            buyer.budget -= selectedCow.price;
            yield buyer.save();
        }
        const seller = yield user_model_1.User.findById(selectedCow.seller);
        if (!seller || seller.role !== 'seller') {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid Seller');
        }
        seller.income = (seller.income || 0) + selectedCow.price;
        yield seller.save();
        selectedCow.label = 'sold out';
        yield selectedCow.save();
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    const createOrder = yield (yield order_model_1.Order.create(order)).populate('cow', 'buyer');
    if (!createOrder) {
        throw new ApiError_1.default(400, 'Failed to create Order');
    }
    return createOrder;
});
exports.OrderService = {
    createOrder,
    getAllOrder,
};
