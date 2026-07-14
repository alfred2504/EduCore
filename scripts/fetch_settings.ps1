Set-Location -LiteralPath "c:\Users\MANUNURE HIGH\Documents\EduCore"
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
try {
    $csrfResp = Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/auth/csrf' -WebSession $session -ErrorAction Stop
    $csrf = $csrfResp.csrfToken
    Write-Output "csrf=$csrf"

    $body = @{ csrfToken = $csrf; callbackUrl = 'http://127.0.0.1:3000/dashboard'; email = 'alfredmakura6@gmail.com'; password = '#Alfred2504' }
    $login = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/api/auth/callback/credentials' -Method Post -Body $body -WebSession $session -UseBasicParsing -ErrorAction Stop
    Write-Output "LOGIN RESPONSE STATUS: $($login.StatusCode)"

    $r = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/dashboard/settings' -WebSession $session -UseBasicParsing -ErrorAction Stop
    Write-Output "STATUS: $($r.StatusCode)"
    $c = $r.Content
    $len = $c.Length
    Write-Output "Content length: $len"
    if ($len -le 4000) { Write-Output $c } else { Write-Output $c.Substring(0,4000) }
} catch {
    Write-Output "ERROR: $($_.Exception.Message)"
    exit 1
}
