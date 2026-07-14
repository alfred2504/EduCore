Set-Location -LiteralPath "c:\Users\MANUNURE HIGH\Documents\EduCore"
Remove-Item -Force -ErrorAction SilentlyContinue cookies.txt,csrf.json,login.txt,dash.txt,invite.txt
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
try {
    $csrfResp = Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/auth/csrf' -WebSession $session -ErrorAction Stop
    $csrf = $csrfResp.csrfToken
    Write-Output "csrf=$csrf"

    $body = @{ csrfToken = $csrf; callbackUrl = 'http://127.0.0.1:3000/dashboard'; email = 'alfredmakura6@gmail.com'; password = '#Alfred2504' }
    $login = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/api/auth/callback/credentials' -Method Post -Body $body -WebSession $session -UseBasicParsing -ErrorAction Stop
    Write-Output "LOGIN RESPONSE STATUS: $($login.StatusCode)"

    $dash = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/dashboard' -WebSession $session -UseBasicParsing -ErrorAction Stop
    Write-Output "DASHBOARD STATUS: $($dash.StatusCode)"

    $inviteBody = @{ email = 'temp-admin@test.local'; name = 'Temp Admin'; password = 'TmpPass123!' } | ConvertTo-Json
    $invite = Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/admin/invite-admin' -Method Post -Body $inviteBody -ContentType 'application/json' -WebSession $session -ErrorAction Stop
    Write-Output 'INVITE RESPONSE:'
    $invite | ConvertTo-Json -Depth 5
} catch {
    Write-Output "ERROR: $($_.Exception.Message)"
    if ($_.InvocationInfo) { Write-Output "Invocation: $($_.InvocationInfo.PositionMessage)" }
    exit 1
}
