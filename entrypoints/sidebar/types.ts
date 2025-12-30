export interface CommonProductData {
  productId: string | null;
  itemId: string | null;
  vendorItemId: string | null;
  url: string | null;
  title: string | null;
  thumbnail: string;
  salePrice: number | null;
  shippingFee: number | null;
  isFreeShipping: boolean | null;
  isRocket: boolean | null;
  sellerName: string | null;
  rating: number | null;
  reviewCount: number | null;
  categoryPath: string[];
  selectedOptions: string[];
}

export interface CalculationHistory {
  id: string;
  timestamp: number;
  productTitle: string | null;
  productUrl: string | null;
  salePrice: number;
  cost: number;
  extraCost: number;
  productSize: string;
  marginRate: number;
  netProfit: number;
  totalFee: number;
}
