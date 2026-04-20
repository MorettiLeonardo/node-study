"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    constructor(props) {
        this.props = props;
    }
    get id() {
        return this.props.id;
    }
    get userId() {
        return this.props.userId;
    }
    get status() {
        return this.props.status;
    }
    get products() {
        return this.props.products;
    }
    get total() {
        return this.props.total;
    }
}
exports.Order = Order;
//# sourceMappingURL=order.entity.js.map