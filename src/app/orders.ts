export interface OrderProduct {
  gtin: string;
  quantity: number;
  serialNumberType: string;
  serialNumbers: string[];
  templateId: string;
  productName: string;
  imageUrl: string;
}

export interface OrderDetails {
  factoryId: string;
  factoryName?: string;
  factoryAddress?: string;
  factoryCountry: string;
  productionLineId: string;
  productCode: string;
  productDescription: string;
  poNumber?: string;
  expectedStartDate?: string;
}

export interface Order {
  omsId: string;
  products: OrderProduct[];
  orderDetails?: OrderDetails;
  orderId: string;
  expectedCompletionTime: number;
}
