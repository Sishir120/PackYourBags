# Production Setup Guide

This guide covers all the production-ready improvements that have been implemented.

## ✅ Implemented Features

### 1. Enhanced Encryption (crypto-js)
- **Status**: ✅ Implemented
- **Location**: `frontend_temp/src/utils/security.js`
- **Details**: 
  - AES encryption for token storage
  - Browser fingerprinting for additional security
  - Migration support for old base64-encoded data
  - Encryption key from environment variable `VITE_ENCRYPTION_KEY`

### 2. CSRF Protection
- **Status**: ✅ Implemented
- **Frontend**: `frontend_temp/src/utils/csrf.js`
- **Backend**: `backend/csrf.py`
- **Details**:
  - CSRF token generation and validation
  - Automatic token inclusion in state-changing requests
  - Token endpoint: `/api/csrf-token`
  - Token expiration (24 hours)

### 3. Error Tracking (Sentry)
- **Status**: ✅ Implemented
- **Location**: `frontend_temp/src/utils/sentry.js`
- **Details**:
  - Sentry integration for error tracking
  - User context tracking
  - Sensitive data filtering
  - Breadcrumb tracking
  - Session replay support

### 4. HTTPS Enforcement
- **Status**: ✅ Implemented
- **Location**: `backend/security.py`
- **Details**:
  - Force HTTPS in production
  - HSTS (HTTP Strict Transport Security)
  - Configurable via `FORCE_HTTPS` environment variable

### 5. Content Security Policy (CSP)
- **Status**: ✅ Implemented
- **Location**: `backend/security.py`
- **Details**:
  - Comprehensive CSP headers
  - Sentry integration
  - Vite/Tailwind CSS support
  - Frame protection
  - XSS protection

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```bash
# Sentry Error Tracking
VITE_SENTRY_DSN=your_sentry_dsn_here

# Encryption Key (generate a strong random key)
VITE_ENCRYPTION_KEY=your-strong-encryption-key-here

# API Base URL
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

#### Backend (.env)
```bash
# Security
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
FORCE_HTTPS=true

# CORS (comma-separated list of allowed origins)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@localhost/packyourbags

# Site URL
SITE_URL=https://yourdomain.com
```

### Generate Encryption Key

```bash
# Generate a strong encryption key (32 bytes, hex)
python -c "import secrets; print(secrets.token_hex(32))"

# Or use OpenSSL
openssl rand -hex 32
```

### Generate Secret Keys

```bash
# Generate Flask secret key
python -c "import secrets; print(secrets.token_hex(32))"

# Generate JWT secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## 📦 Installation

### Frontend Dependencies

```bash
cd frontend_temp
npm install
```

New dependencies:
- `@sentry/react` - Error tracking
- `crypto-js` - Encryption

### Backend Dependencies

```bash
cd backend
pip install -r requirements_security.txt
```

## 🚀 Deployment Steps

### 1. Set Up Sentry

1. Create a Sentry account at https://sentry.io
2. Create a new project (React)
3. Copy your DSN
4. Add to frontend `.env`:
   ```bash
   VITE_SENTRY_DSN=your_sentry_dsn_here
   ```

### 2. Configure Encryption

1. Generate encryption key:
   ```bash
   openssl rand -hex 32
   ```

2. Add to frontend `.env`:
   ```bash
   VITE_ENCRYPTION_KEY=your-generated-key-here
   ```

### 3. Configure Backend

1. Set environment variables:
   ```bash
   SECRET_KEY=your-secret-key
   JWT_SECRET_KEY=your-jwt-secret-key
   FORCE_HTTPS=true
   CORS_ORIGINS=https://yourdomain.com
   ```

2. Ensure HTTPS is enabled on your server (nginx, Apache, or cloud provider)

### 4. Build and Deploy

#### Frontend
```bash
cd frontend_temp
npm run build
# Deploy the dist/ folder to your hosting service
```

#### Backend
```bash
cd backend
# Use gunicorn or similar WSGI server
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🔒 Security Checklist

- [x] AES encryption for sensitive data
- [x] CSRF protection
- [x] HTTPS enforcement
- [x] Content Security Policy
- [x] Error tracking (Sentry)
- [x] Rate limiting
- [x] Input validation
- [x] XSS protection
- [x] Secure token storage
- [ ] Security audit (recommended)
- [ ] Penetration testing (recommended)

## 📊 Monitoring

### Sentry Dashboard

1. Go to https://sentry.io
2. Monitor errors in real-time
3. Set up alerts for critical errors
4. Review performance metrics

### Error Tracking

- All errors are automatically captured
- User context is included
- Sensitive data is filtered
- Breadcrumbs provide context

## 🐛 Troubleshooting

### CSRF Token Errors

If you see CSRF token errors:
1. Ensure `credentials: 'include'` is set in fetch requests
2. Check that CORS is configured correctly
3. Verify CSRF token endpoint is accessible

### Encryption Errors

If encryption fails:
1. Check `VITE_ENCRYPTION_KEY` is set
2. Ensure crypto-js is installed
3. Check browser console for errors

### Sentry Not Working

If Sentry isn't capturing errors:
1. Verify `VITE_SENTRY_DSN` is set correctly
2. Check Sentry dashboard for project status
3. Ensure network requests to Sentry aren't blocked

### HTTPS Issues

If HTTPS enforcement causes issues:
1. Set `FORCE_HTTPS=false` in development
2. Ensure SSL certificate is valid
3. Check HSTS headers aren't too strict

## 🔐 Best Practices

1. **Never commit secrets**: Use environment variables
2. **Rotate keys regularly**: Change encryption and secret keys periodically
3. **Monitor errors**: Regularly check Sentry for issues
4. **Update dependencies**: Keep packages up to date
5. **Security audits**: Conduct regular security audits
6. **Backup data**: Regular backups of database and files

## 📚 Additional Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [OWASP Security Guidelines](https://owasp.org/)
- [Flask Security Best Practices](https://flask.palletsprojects.com/en/2.3.x/security/)
- [React Security Best Practices](https://reactjs.org/docs/security.html)

## 🎯 Next Steps

1. Set up monitoring alerts in Sentry
2. Configure backup strategy
3. Set up CI/CD pipeline
4. Conduct security audit
5. Set up log aggregation (optional)
6. Configure CDN for static assets (optional)

