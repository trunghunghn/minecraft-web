$env:DATABASE_URL="postgresql://postgres.fnwnpyxpkzkdamgyacsu:Hunghoa%4019859@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
Write-Host "--- Dang ket noi toi Supabase (Pooler Mode)... ---" -ForegroundColor Cyan
npx prisma db push
Write-Host "--- Hoan thanh! ---" -ForegroundColor Green
