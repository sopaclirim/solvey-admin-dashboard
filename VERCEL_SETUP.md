# Vercel Deployment Setup - Solvey Admin Dashboard

## Problemi: Email nuk po dërgohet në Vercel

Nëse email-i funksionon në localhost por jo në Vercel, problemi është që **VITE_API_URL** nuk është vendosur në Vercel Environment Variables.

## Zgjidhja: Vendos Environment Variable në Vercel

### Hapat:

1. **Shko te Vercel Dashboard**
   - Hap [vercel.com](https://vercel.com)
   - Zgjidh projektin `solvey-admin-dashboard`

2. **Shko te Settings → Environment Variables**

3. **Shto Environment Variable:**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://solveylabs-backend.onrender.com`
   - **Environments:** Zgjidh të gjitha:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

4. **Redeploy projektin:**
   - Shko te Deployments
   - Kliko "Redeploy" në deployment-in më të fundit
   - Ose bëj një push të ri në GitHub

## Si të verifikosh që funksionon:

1. **Hap browser Console** (F12) në Vercel deployment
2. **Kërko për këto mesazhe:**
   - `🔧 API Base URL: https://solveylabs-backend.onrender.com` ✅
   - Ose `🔧 API Base URL: http://localhost:8080` ❌ (problem!)

3. **Nëse shikon localhost:**
   - Environment variable nuk është vendosur
   - Redeploy pasi ta vendosësh

4. **Kur dërgosh email, shiko Console për:**
   - `📤 Request: POST /api/admin/send-email`
   - `✅ Response: POST /api/admin/send-email 200` (sukses)
   - Ose `❌ API Error:` me detaje (problem)

## Troubleshooting

### Problem: "Network error: Cannot connect to backend server"
**Zgjidhja:** Vendos `VITE_API_URL` në Vercel Environment Variables

### Problem: "CORS error"
**Zgjidhja:** Kontrollo që backend-i ka CORS të konfiguruar për të lejuar requests nga Vercel domain

### Problem: "Backend endpoint not found (404)"
**Zgjidhja:** Kontrollo që URL-ja e backend-it është e saktë dhe endpoint-i ekziston

## Backend URL

Backend URL aktual: `https://solveylabs-backend.onrender.com`

Kontrollo që backend-i është online: [https://solveylabs-backend.onrender.com/api/health](https://solveylabs-backend.onrender.com/api/health)

