$ErrorActionPreference = 'Stop'
$repo = 'D:\.SonicLee\biweb'
$out  = Join-Path $repo 'showcase\index.html'

# 1. Láº¥y HTML render tháº­t tá»« ASP.NET Core
$resp = Invoke-WebRequest -Uri 'http://localhost:5005/' -UseBasicParsing
$bytes = $resp.RawContentStream.ToArray()
$html = [Text.Encoding]::UTF8.GetString($bytes)

# 2. Chuyá»ƒn Ä‘Æ°á»ng dáº«n tuyá»‡t Ä‘á»‘i gá»‘c -> tÆ°Æ¡ng Ä‘á»‘i cho GitHub Pages (/biweb/)
foreach ($d in @('css','js','img','lib','fonts')) {
    $html = $html.Replace("=`"/$d/", "=`"./$d/").Replace("='/$d/", "='./$d/").Replace("url(/$d/", "url(./$d/").Replace("url('/$d/", "url('./$d/")
}
$html = $html.Replace('href="/style.css', 'href="./style.css').Replace('href="/favicon.ico', 'href="./favicon.ico')
# Trang chá»§: anchor ná»™i bá»™ dÃ¹ng #id Ä‘á»ƒ cuá»™n mÆ°á»£t trÃªn trang tÄ©nh
$html = $html.Replace('href="/Home/Index#', 'href="#').Replace('href="/Home/Index"', 'href="./"')

[IO.File]::WriteAllText($out, $html, (New-Object Text.UTF8Encoding $false))

# 3. Äá»“ng bá»™ tÃ i nguyÃªn tÄ©nh
Copy-Item (Join-Path $repo 'DoAn-FW\wwwroot\css\*') (Join-Path $repo 'showcase\css') -Force -Recurse
Copy-Item (Join-Path $repo 'DoAn-FW\wwwroot\js\*')  (Join-Path $repo 'showcase\js')  -Force -Recurse
Copy-Item (Join-Path $repo 'DoAn-FW\wwwroot\img\*') (Join-Path $repo 'showcase\img') -Force -Recurse

"Saved {0:N0} bytes" -f (Get-Item $out).Length
