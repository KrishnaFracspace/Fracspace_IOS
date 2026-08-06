import { GetCarousel } from './UserApi';

export const getAppVersionConfig = async () => {
  try {
    const response = await GetCarousel();
    const res = response?.data;
    if (res?.success && res?.data?.appVersion) {
      return res.data.appVersion;
    }
    return null;
  } catch (error) {
    console.log('Error fetching app version config:', error);
    return null;
  }
};
