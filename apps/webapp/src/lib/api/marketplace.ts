import api from "../api";

export interface CreateListingDto {
  wexelId: string;
  askPriceUsd: string;
  auction?: boolean;
  minBidUsd?: string;
  expiryTs?: string;
}

export interface BuyListingDto {
  listingId: string;
  buyerAddress: string;
  price: string;
  txHash: string;
}

export interface MarketplaceFilterDto {
  minApy?: string;
  maxPrice?: string;
  isCollateralized?: string;
  sortBy?: string;
}

export const marketplaceApi = {
  /**
   * Get all active listings
   */
  getListings: async (filters?: MarketplaceFilterDto) => {
    const response = await api.get("/api/v1/market/listings", { params: filters });
    return response.data;
  },

  /**
   * Get listing by ID
   */
  getListing: async (id: number) => {
    const response = await api.get(`/api/v1/market/listings/${id}`);
    return response.data;
  },

  /**
   * Create new listing
   */
  createListing: async (data: CreateListingDto) => {
    const response = await api.post("/api/v1/market/listings", data);
    return response.data;
  },

  /**
   * Purchase a listing
   */
  buyListing: async (data: BuyListingDto) => {
    const response = await api.post("/api/v1/market/buy", data);
    return response.data;
  },

  /**
   * Cancel a listing
   */
  cancelListing: async (id: number, userAddress: string) => {
    const response = await api.post(`/api/v1/market/listings/${id}/cancel`, { userAddress });
    return response.data;
  },
};
