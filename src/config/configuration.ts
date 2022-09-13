interface ZKNCurrency {
  COD: string;
}

export interface ZEFProjectConfig {
  COD: string;
  CURRENCY: ZKNCurrency;
}

export default () => ({
  AWS: {
    SQS: {
      URL: process.env.AWS_SQS_URL || '',
    },
  },
  ZEF_PROJECT: {
    COD: 'ZEF',
    CURRRENCY: {
      COD: 'ZKN',
    },
  },
});
