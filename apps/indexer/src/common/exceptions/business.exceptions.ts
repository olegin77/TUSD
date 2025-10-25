import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientFundsException extends HttpException {
  constructor(required: string, available: string) {
    super(
      {
        message: 'Insufficient funds',
        details: {
          required,
          available,
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PoolNotFoundException extends HttpException {
  constructor(poolId: string | number) {
    super(
      {
        message: 'Pool not found',
        details: {
          poolId,
        },
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class WexelNotFoundException extends HttpException {
  constructor(wexelId: string | number) {
    super(
      {
        message: 'Wexel not found',
        details: {
          wexelId,
        },
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class WexelAlreadyCollateralizedException extends HttpException {
  constructor(wexelId: string | number) {
    super(
      {
        message: 'Wexel is already collateralized',
        details: {
          wexelId,
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class WexelNotCollateralizedException extends HttpException {
  constructor(wexelId: string | number) {
    super(
      {
        message: 'Wexel is not collateralized',
        details: {
          wexelId,
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class BoostTargetExceededException extends HttpException {
  constructor(wexelId: string | number, maxBoost: string) {
    super(
      {
        message: 'Boost target exceeded',
        details: {
          wexelId,
          maxBoost,
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class WexelNotMaturedException extends HttpException {
  constructor(wexelId: string | number, maturityDate: string) {
    super(
      {
        message: 'Wexel has not matured yet',
        details: {
          wexelId,
          maturityDate,
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidPriceSourceException extends HttpException {
  constructor(source: string) {
    super(
      {
        message: 'Invalid price source',
        details: {
          source,
          validSources: ['pyth', 'chainlink', 'dex', 'cex'],
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PriceDeviationTooHighException extends HttpException {
  constructor(deviation: number, maxDeviation: number) {
    super(
      {
        message: 'Price deviation too high',
        details: {
          deviation: `${deviation}%`,
          maxDeviation: `${maxDeviation}%`,
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UnauthorizedWalletException extends HttpException {
  constructor(walletAddress: string) {
    super(
      {
        message: 'Unauthorized wallet access',
        details: {
          walletAddress,
        },
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class KYCRequiredException extends HttpException {
  constructor() {
    super(
      {
        message: 'KYC verification required',
        details: {
          action: 'Please complete KYC verification to continue',
        },
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
