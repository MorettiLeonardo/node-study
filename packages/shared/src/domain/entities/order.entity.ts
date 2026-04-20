import { EOrderStatus } from "../enums/EOrderStatus";
import { Product } from "./product.entity";

interface OrderProps {
  id?: string;
  userId: string;
  status: EOrderStatus;
  products: Product[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  private props: OrderProps;

  constructor(props: OrderProps) {
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
