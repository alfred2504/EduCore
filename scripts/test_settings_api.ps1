Set-Location -LiteralPath "c:\Users\MANUNURE HIGH\Documents\EduCore"
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$csrfResp = Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/auth/csrf' -WebSession $session
$csrf = $csrfResp.csrfToken
Write-Output "csrf=$csrf"
$body = @{ csrfToken = $csrf; callbackUrl = 'http://127.0.0.1:3000/dashboard'; email = 'alfredmakura6@gmail.com'; password = '#Alfred2504' }
Invoke-WebRequest -Uri 'http://127.0.0.1:3000/api/auth/callback/credentials' -Method Post -Body $body -WebSession $session -UseBasicParsing
Write-Output "Logged in"
try {
    $get = Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/settings' -WebSession $session -ErrorAction Stop
    Write-Output "GET /api/settings:"
    $get | ConvertTo-Json -Depth 5 | Write-Output
} catch {
    Write-Output "GET failed: $($_.Exception.Message)"
}
$putBody = @{ siteTitle = 'EduCore (Live)'; schoolName = 'Test School'; contactEmail = 'admin@test.local' } | ConvertTo-Json
try {
    $put = Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/settings' -Method Put -Body $putBody -ContentType 'application/json' -WebSession $session -ErrorAction Stop
    Write-Output "PUT response:"
    $put | ConvertTo-Json -Depth 5 | Write-Output
} catch {
    Write-Output "PUT failed: $($_.Exception.Message)"
}
