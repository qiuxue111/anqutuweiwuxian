@echo off
echo 正在启动本地服务器...
echo.
echo 访问地址: http://localhost:3456
echo 按 Ctrl+C 关闭服务器
echo.
:: 用 PowerShell 启动一个简单的 HTTP 服务器
powershell -Command "
$port = 3456;
$root = 'F:\暗区突围网站';
$listener = New-Object System.Net.HttpListener;
$listener.Prefixes.Add('http://localhost:' + $port + '/');
$listener.Start();
Write-Host ('服务器已启动: http://localhost:' + $port + '/');
Write-Host '按任意键停止服务器...';
$key = $false;
while (-not $key) {
    $context = $listener.GetContext();
    $request = $context.Request;
    $response = $context.Response;
    $path = $request.Url.AbsolutePath;
    if ($path -eq '/') { $path = '/index.html'; }
    $filePath = [System.IO.Path]::Combine($root, $path.TrimStart('/'));
    if ([System.IO.File]::Exists($filePath)) {
        $content = [System.IO.File]::ReadAllBytes($filePath);
        $response.ContentType = switch ([System.IO.Path]::GetExtension($filePath)) {
            '.html' { 'text/html; charset=utf-8' }
            '.css'  { 'text/css; charset=utf-8' }
            '.js'   { 'application/javascript; charset=utf-8' }
            '.jpg'  { 'image/jpeg' }
            '.png'  { 'image/png' }
            default { 'application/octet-stream' }
        };
        $response.ContentLength64 = $content.Length;
        $response.OutputStream.Write($content, 0, $content.Length);
    } else {
        $response.StatusCode = 404;
        $notFound = [System.Text.Encoding]::UTF8.GetBytes('404 未找到');
        $response.OutputStream.Write($notFound, 0, $notFound.Length);
    }
    $response.Close();
    if ([System.Console]::KeyAvailable) { $key = $true; }
}
$listener.Stop();
"
pause
