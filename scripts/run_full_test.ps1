Set-Location -LiteralPath "c:\Users\MANUNURE HIGH\Documents\EduCore"
Remove-Item -Force -ErrorAction SilentlyContinue full_test_results.txt
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
Write-Output "Starting full app smoke tests..."
try {
    $csrfResp = Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/auth/csrf' -WebSession $session -ErrorAction Stop
    $csrf = $csrfResp.csrfToken
    Write-Output "csrf=$csrf"

    $body = @{ csrfToken = $csrf; callbackUrl = 'http://127.0.0.1:3000/dashboard'; email = 'alfredmakura6@gmail.com'; password = '#Alfred2504' }
    $login = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/api/auth/callback/credentials' -Method Post -Body $body -WebSession $session -UseBasicParsing -ErrorAction Stop
    Write-Output "LOGIN RESPONSE STATUS: $($login.StatusCode)"

    # Endpoints to GET
    $gets = @('/','/login','/register','/dashboard','/api/classes','/api/students','/api/teachers','/api/subjects','/api/terms','/api/exams','/api/grades','/api/invoices')
    foreach ($p in $gets) {
        $url = "http://127.0.0.1:3000$p"
        try {
            $r = Invoke-WebRequest -Uri $url -WebSession $session -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
            Write-Output "$p => $($r.StatusCode)"
        } catch {
            if ($_.Exception.Response) { $status = $_.Exception.Response.StatusCode.Value__; Write-Output "$p => $status" } else { Write-Output "$p => ERROR: $($_.Exception.Message)" }
        }
    }

    # POST tests
    Write-Output "Testing POST /api/ai/chat"
    $aiBody = @{ message = 'Hello, this is a smoke test' } | ConvertTo-Json
    try {
        $ai = Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/ai/chat' -Method Post -Body $aiBody -ContentType 'application/json' -WebSession $session -ErrorAction Stop
        Write-Output "/api/ai/chat => OK: $($ai.reply -replace "`r|`n"," ")"
    } catch {
        if ($_.Exception.Response) { $status = $_.Exception.Response.StatusCode.Value__; Write-Output "/api/ai/chat => $status" } else { Write-Output "/api/ai/chat => ERROR: $($_.Exception.Message)" }
    }

    Write-Output "Testing POST /api/admin/invite-admin"
    $inviteBody = @{ email = ('smoke+' + [guid]::NewGuid().ToString().Substring(0,8) + '@test.local'); name = 'Smoke Test'; password = 'TmpPass123!' } | ConvertTo-Json
    try {
        $inv = Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/admin/invite-admin' -Method Post -Body $inviteBody -ContentType 'application/json' -WebSession $session -ErrorAction Stop
        Write-Output "/api/admin/invite-admin => OK: $($inv.email) (id: $($inv.id))"
    } catch {
        if ($_.Exception.Response) { $status = $_.Exception.Response.StatusCode.Value__; Write-Output "/api/admin/invite-admin => $status" } else { Write-Output "/api/admin/invite-admin => ERROR: $($_.Exception.Message)" }
    }

    Write-Output "Full smoke tests completed successfully."
} catch {
    Write-Output "ERROR: $($_.Exception.Message)"
    exit 1
}
