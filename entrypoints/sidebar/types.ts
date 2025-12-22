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
