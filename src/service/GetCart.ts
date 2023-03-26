// import { getManager } from 'typeorm';
// import { sumBy } from 'lodash';

// import { Cart } from '../model/Cart';

// interface Request {
//   userId?: string;
//   isOrder?: boolean;
// }
// interface ICartResponse {
//   count?: number;
//   subTotal?: number;
//   grandTotal?: number;
//   cartDetails?: Array<any>;
// }
// interface IOrderResponse {
//   count?: number;
//   subTotal?: number;
//   grandTotal?: number;
//   orderDetails?: Array<any>;
// }
// interface Response {
//   count?: number;
//   subTotal?: number;
//   grandTotal?: number;
//   cartData?: Array<Cart>;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   orderDetails?: Array<any>;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   cartDetails?: Array<any>;
//   orderCartResponse?: ICartResponse;
// }
// class GetCartService {
//   private static instance: GetCartService;
//   constructor() {
//     if (GetCartService.instance instanceof GetCartService) {
//       return GetCartService.instance;
//     }
//     GetCartService.instance = this;
//   }

//   public async execute(request: Request): Promise<Response> {
//     const query = this.prepareQuery(request);
//     const cartData = await query.getMany();
//     return this.prepareOrderResponse(cartData, cartData.length)
//   }

//   private prepareQuery(request: Request) {
//     const query = getManager()
//       .createQueryBuilder(Cart, 'cart')
//       .leftJoinAndSelect('cart.user', 'user', 'user.id = :userId', { userId: request?.userId })
//       .leftJoinAndSelect('user.address', 'address')
//       .leftJoinAndSelect('cart.product', 'product')
//       .leftJoinAndSelect('product.category', 'productCategory')
//       .leftJoinAndSelect('product.brand', 'productBrand');
//     return query;
//   }

//   private async getCartDetail(cartData: Cart[]) {
//     const cartDetails = (cartData || []).map((cart) => {
//       return {};
//     });
//     return { cartDetails };
//   }

//   private async prepareOrderResponse(
//     cartData: Cart[],
//     count: number,
//   ): Promise<IOrderResponse> {
//     const { cartDetails } = await this.getCartDetail(
//       cartData,
//     );
    
//     const response: IOrderResponse = {
//       count,
//       orderDetails: cartDetails,
//       grandTotal: sumBy(cartDetails, 'grandTotal'),
//     };
//     return response;
//   }

//   private async prepareCartResponse(
//     cartData: Cart[],
//     count: number,
//   ): Promise<ICartResponse> {
//     const { cartDetails } = await this.getCartDetail(
//       cartData,
//     );
    
//     const response: ICartResponse = {
//       count,
//       cartDetails,
//       grandTotal: sumBy(cartDetails, 'grandTotal'),
//     };
//     return response;
//   }
// }
// export default GetCartService;
