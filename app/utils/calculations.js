export const calculateNetAssetGoal = (age) => {
  const numAge = parseInt(age);
  
  if (numAge < 18) return 0;
  if (numAge <= 20) return 3650;
  if (numAge <= 25) return 18250;
  if (numAge <= 30) return 73000;
  if (numAge <= 35) return 219000;
  if (numAge <= 40) return 438000;
  if (numAge <= 45) return 730000;
  if (numAge <= 50) return 1095000;
  if (numAge <= 55) return 1460000;
  if (numAge <= 60) return 1825000;
  return 2000000;
};
