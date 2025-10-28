/**
 * Centralized API client exports
 */

export { authApi, WalletType } from './auth';
export { depositsApi } from './deposits';
export { collateralApi } from './collateral';
export { marketplaceApi } from './marketplace';

export type {
  WalletLoginRequest,
  WalletLoginResponse,
} from './auth';

export type {
  CreateDepositDto,
  ConfirmDepositDto,
  ApplyBoostToDepositDto,
} from './deposits';

export type {
  OpenCollateralDto,
  RepayLoanDto,
} from './collateral';

export type {
  CreateListingDto,
  BuyListingDto,
  MarketplaceFilterDto,
} from './marketplace';
