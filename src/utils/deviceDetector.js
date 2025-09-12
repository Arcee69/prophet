export const isMobileOrTablet = () => {
  const userAgent = navigator.userAgent;
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isSmallScreen = window.innerWidth < 1200; // Example threshold
  
  return isMobileUserAgent || isSmallScreen;
};