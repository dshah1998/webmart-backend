import { getManager } from "typeorm";
import { sumBy } from "lodash";

import { Carts } from "../model/Cart";
import { disconnect } from "process";

interface Request {
  userId?: string;
  isOrder?: boolean;
}
interface ICartResponse {
  count?: number;
  subTotal?: number;
  grandTotal?: number;
  cartDetails?: Array<any>;
}
interface IOrderResponse {
  count?: number;
  subTotal?: number;
  grandTotal?: number;
  orderDetails?: Array<any>;
}
interface Response {
  count?: number;
  subTotal?: number;
  grandTotal?: number;
  cartData?: Array<Carts>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orderDetails?: Array<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartDetails?: Array<any>;
  orderCartResponse?: ICartResponse;
}
class GetCartService {
  private static instance: GetCartService;
  constructor() {
    if (GetCartService.instance instanceof GetCartService) {
      return GetCartService.instance;
    }
    GetCartService.instance = this;
  }

  public async execute(request: Request): Promise<Response> {
    const query = this.prepareQuery(request);
    const cartData = await query.getMany();
    return this.prepareOrderResponse(cartData, cartData.length);
  }

  private prepareQuery(request: Request) {
    const query = getManager()
      .createQueryBuilder(Carts, "cart")
      .leftJoinAndSelect("cart.user", "user", "user.id = :userId", {
        userId: request?.userId,
      })
      .leftJoinAndSelect("user.address", "address")
      .leftJoinAndSelect("cart.product", "product")
      .leftJoinAndSelect("product.category", "productCategory")
      .leftJoinAndSelect("product.brand", "productBrand");
    return query;
  }

  private getSubTotal(
    productPrice: number,
    productDiscount: number,
    quantity: number
  ) {
    return (1 - productDiscount) * productPrice * quantity;
  }

  private getGrandTotal(subTotal: number, salseTaxAmount: number) {
    return subTotal + salseTaxAmount;
  }

  private async getCartDetail(cartData: Carts[]) {
    const cartDetails = (cartData || []).map((cart) => {
      const qty = cart?.quantity || 0;
      const productPrice = cart?.product?.price || 0;
      const productDiscount = (cart?.product?.discount || 0) / 100;

      const subTotal = this.getSubTotal(
        productPrice || 0,
        productDiscount || 0,
        qty || 0
      );

      const salseTaxAmount = subTotal * 0.08;

      const grandTotal = this.getGrandTotal(subTotal, salseTaxAmount);

      return {
        ...cart,
        salseTaxAmount,
        grandTotal,
        subTotal,
        qty
      };
    });
    return { cartDetails };
  }

  private async prepareOrderResponse(
    cartData: Carts[],
    count: number
  ): Promise<IOrderResponse> {
    const { cartDetails } = await this.getCartDetail(cartData);
    const response: IOrderResponse = {
      count,
      orderDetails: cartDetails,
      grandTotal: sumBy(cartDetails, "grandTotal"),
    };
    return response;
  }

  private async prepareCartResponse(
    cartData: Carts[],
    count: number
  ): Promise<ICartResponse> {
    const { cartDetails } = await this.getCartDetail(cartData);

    const response: ICartResponse = {
      count,
      cartDetails,
      grandTotal: sumBy(cartDetails, "grandTotal"),
    };
    return response;
  }
}
export default GetCartService;
