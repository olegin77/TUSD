export const createMockTronWeb = () => ({
  setAddress: jest.fn(),
  contract: jest.fn().mockReturnValue({
    at: jest.fn().mockResolvedValue({
      methods: {
        balanceOf: jest.fn().mockResolvedValue('1000000'),
        transfer: jest.fn().mockResolvedValue({ transactionHash: '0x123' }),
        getDeposit: jest.fn().mockReturnValue({
          call: jest.fn().mockResolvedValue({
            id: '1',
            owner: 'TXxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            amount: '1000000',
            timestamp: Date.now(),
          }),
        }),
      },
      events: {},
    }),
  }),
  trx: {
    getAccount: jest.fn().mockResolvedValue({ balance: 1000000 }),
    sendTransaction: jest.fn().mockResolvedValue({ txid: '0x456' }),
    getTransaction: jest.fn().mockResolvedValue({
      txID: '0x789',
      raw_data: {},
      signature: [],
    }),
    getCurrentBlock: jest.fn().mockResolvedValue({
      block_header: {
        raw_data: {
          number: 12345678,
          timestamp: Date.now(),
        },
      },
    }),
    getBlock: jest.fn().mockResolvedValue({
      block_header: {
        raw_data: {
          timestamp: Date.now(),
        },
      },
    }),
  },
  getEventResult: jest.fn().mockResolvedValue([]),
});

// Экспорт для jest
module.exports = class TronWeb {
  constructor(cfg?: any) {
    if (cfg) {
      Object.assign(this, cfg);
    }
  }
  setAddress() {}
  contract() {
    return {
      at: () => ({
        methods: {},
        events: {},
      }),
    };
  }
  trx = {
    getAccount: () => Promise.resolve({ balance: 0 }),
    sendTransaction: () => Promise.resolve({ txid: '0x000' }),
    getTransaction: () => Promise.resolve({}),
    getCurrentBlock: () =>
      Promise.resolve({
        block_header: { raw_data: { number: 0, timestamp: 0 } },
      }),
    getBlock: () =>
      Promise.resolve({ block_header: { raw_data: { timestamp: 0 } } }),
  };
  getEventResult = () => Promise.resolve([]);
};
