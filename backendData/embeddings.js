import data from './ai_data.json';

const allData = [
  ...data?.Properties,
  ...data?.FAQs,
  ...data?.FinancialData,
  ...data?.CompanyData
];

export default allData;