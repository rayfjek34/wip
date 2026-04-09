// Client-side validation helpers
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidUrl = (url) => {
  if (!url) return true; // optional
  try { new URL(url.startsWith('http') ? url : `https://${url}`); return true; }
  catch { return false; }
};

export const validateCV = (cv) => {
  const errors = {};
  const p = cv.personal;
  if (!p.firstName?.trim()) errors.firstName = 'First name is required';
  if (!p.lastName?.trim()) errors.lastName = 'Last name is required';
  if (!p.email?.trim()) errors.email = 'Email is required';
  else if (!isValidEmail(p.email)) errors.email = 'Invalid email format';
  if (p.website && !isValidUrl(p.website)) errors.website = 'Invalid URL';
  return errors;
};
