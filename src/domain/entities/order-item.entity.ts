interface OrderItemProps {
    productId: string;
    quantity: number;
    price: number;
}

export class OrderItem {
    private props: OrderItemProps;

    constructor(props: OrderItemProps) {
        this.props = props;
    }

    get productId(): string {
        return this.props.productId;
    }

    get quantity(): number {
        return this.props.quantity;
    }

    get price(): number {
        return this.props.price;
    }
}