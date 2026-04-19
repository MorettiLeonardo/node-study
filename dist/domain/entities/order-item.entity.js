"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = void 0;
class OrderItem {
    constructor(props) {
        this.props = props;
    }
    get productId() {
        return this.props.productId;
    }
    get quantity() {
        return this.props.quantity;
    }
    get price() {
        return this.props.price;
    }
}
exports.OrderItem = OrderItem;
//# sourceMappingURL=order-item.entity.js.map