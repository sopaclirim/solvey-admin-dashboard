# Email Reply Troubleshooting - Admin Dashboard

## Problemi
Email reply nga admin dashboard nuk po funksionon në production (Vercel), por funksionon në localhost. Format e kontaktit dhe aplikimeve nga solveylabs-frontend po funksionojnë me sukses.

## Analiza
Nëse format e tjera po funksionojnë, kjo tregon që:
- ✅ Backend-i është online dhe funksional
- ✅ Email service (Gmail SMTP) është i konfiguruar saktë
- ✅ Environment variables në Render janë të saktë
- ❌ Problemi është specifik për endpoint-in `/api/admin/send-email`

## Çfarë të kontrollosh

### 1. Backend Logs në Render
Shko te Render Dashboard → Backend Service → Logs dhe shiko çfarë error-i po ndodh kur dërgon email nga admin dashboard.

Kërko për:
- Error messages që lidhen me `/api/admin/send-email`
- Stack traces
- Validation errors
- Authentication errors

### 2. Krahaso Request-et

#### Request nga solveylabs-frontend (që funksionon):
```
POST /api/contacts
POST /api/applications
```

#### Request nga admin-dashboard (që nuk funksionon):
```
POST /api/admin/send-email
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
  {
    "to": "email@example.com",
    "subject": "Re: ...",
    "message": "..."
  }
```

### 3. Kontrollo në Backend Code

Kontrollo endpoint-in `/api/admin/send-email` në backend dhe shiko:

1. **Authentication Middleware:**
   - A kërkon authentication?
   - A është middleware-i i saktë?
   - A po verifikon token-in siç duhet?

2. **Request Validation:**
   - A ka validation për `to`, `subject`, `message`?
   - A ka ndonjë validation që mund të dështojë në production?

3. **Email Service Call:**
   - A po përdor të njëjtin email service si format e tjera?
   - A ka ndonjë ndryshim në konfigurim?

4. **Error Handling:**
   - A po kthen error messages të qarta?
   - A po logon errors në console?

### 4. Test në Console (Browser)

Kur provon të dërgosh email nga admin dashboard, shiko Console për:

```
📧 Email request details: {
  to: "...",
  subject: "...",
  messageLength: ...,
  hasToken: true/false,
  tokenLength: ...,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ***' ose 'MISSING'
  }
}
```

Nëse `hasToken: false` ose `Authorization: 'MISSING'`, problemi është me authentication.

### 5. Krahaso me Localhost

Në localhost, kontrollo:
- A po dërgohet token-i?
- A ka ndonjë ndryshim në request payload?
- A ka ndonjë ndryshim në headers?

## Zgjidhje të Mundshme

### Problem 1: Token nuk po dërgohet
**Symptom:** `hasToken: false` në Console
**Zgjidhje:** Kontrollo që user-i është logged in dhe token-i është i ruajtur në localStorage

### Problem 2: Token i skaduar
**Symptom:** 401 Unauthorized error
**Zgjidhje:** Log out dhe log in përsëri

### Problem 3: Backend validation error
**Symptom:** 400 Bad Request ose 422 Validation Error
**Zgjidhje:** Kontrollo backend logs për validation errors specifike

### Problem 4: Backend server error
**Symptom:** 500 Internal Server Error
**Zgjidhje:** 
- Shiko backend logs për stack trace
- Kontrollo që email service është i konfiguruar saktë
- Kontrollo që të gjitha environment variables janë të vendosura

### Problem 5: CORS ose Network error
**Symptom:** Network error ose CORS error
**Zgjidhje:** Kontrollo CORS settings në backend për të lejuar requests nga Vercel domain

## Debugging Steps

1. **Hap Console në browser** (F12)
2. **Provo të dërgosh email**
3. **Shiko logs:**
   - `📧 Email request details` - kontrollo token dhe headers
   - `❌ API Error` - shiko error details
   - `📧 Backend error response` - shiko mesazhin nga backend
4. **Kopjo error details** dhe kontrollo në backend logs
5. **Krahaso me request-et që funksionojnë** (contacts/applications)

## Next Steps

Pas kësaj analize, do të kesh informacion më të qartë për problemin:
- Nëse problemi është në frontend (token, headers, payload)
- Nëse problemi është në backend (validation, email service, error handling)

