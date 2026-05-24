export function validateLead(req, res, next) {
  const { name, email, phone, company, source, status } = req.body;

  const errors = {};

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.name = 'Name is required and must be a string';
  }

  if (!email || !isValidEmail(email)) {
    errors.email = 'Valid email is required';
  }

  if (phone && typeof phone !== 'string') {
    errors.phone = 'Phone must be a string';
  }

  if (company && typeof company !== 'string') {
    errors.company = 'Company must be a string';
  }

  if (source && typeof source !== 'string') {
    errors.source = 'Source must be a string';
  }

  const validStatuses = ['New', 'Contacted', 'Converted', 'Rejected'];
  if (status && !validStatuses.includes(status)) {
    errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors 
    });
  }

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  const errors = {};

  if (!email || !isValidEmail(email)) {
    errors.email = 'Valid email is required';
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.password = 'Password is required and must be at least 6 characters';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors 
    });
  }

  next();
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
