"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(props) {
        this.props = props;
    }
    get id() {
        return this.props.id;
    }
    get name() {
        return this.props.name;
    }
    get price() {
        return this.props.price;
    }
}
exports.Product = Product;
//# sourceMappingURL=product.entity.js.map