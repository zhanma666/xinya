# GitHub项目上传脚本
Write-Host "=================================" -ForegroundColor Green
Write-Host "开始准备将项目上传到GitHub" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

Write-Host "`n第1步: 检查GitHub CLI是否已安装..." -ForegroundColor Yellow

# 检查GitHub CLI是否已安装
$ghInstalled = $false
try {
    $ghVersion = $(gh --version 2>$null)
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ GitHub CLI已安装: $ghVersion" -ForegroundColor Green
        $ghInstalled = $true
    }
} catch {
    Write-Host "✗ GitHub CLI未安装" -ForegroundColor Red
}

if (-not $ghInstalled) {
    Write-Host "`n错误: GitHub CLI未安装!" -ForegroundColor Red
    Write-Host "请先从 https://cli.github.com/ 下载并安装GitHub CLI" -ForegroundColor Red
    Write-Host "安装完成后重新运行此脚本。" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host "`n第2步: 检查GitHub认证状态..." -ForegroundColor Yellow

# 检查GitHub认证状态
$authStatus = $(gh auth status 2>&1)
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 当前未认证到GitHub" -ForegroundColor Red
    
    Write-Host "`n正在启动GitHub认证..." -ForegroundColor Yellow
    $authResult = $(gh auth login)
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ GitHub认证失败" -ForegroundColor Red
        Read-Host "按任意键退出"
        exit 1
    } else {
        Write-Host "✓ GitHub认证成功" -ForegroundColor Green
    }
} else {
    Write-Host "✓ 已认证到GitHub" -ForegroundColor Green
    Write-Host "认证状态: $authStatus" -ForegroundColor Cyan
}

Write-Host "`n第3步: 检查当前Git仓库状态..." -ForegroundColor Yellow

# 检查是否在Git仓库中
$gitStatus = $(git status --porcelain 2>$null)
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 当前目录不是一个Git仓库" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

$gitRemote = $(git remote -v 2>$null)
Write-Host "当前远程仓库: $gitRemote" -ForegroundColor Cyan

# 检查是否有未跟踪的文件
$untrackedFiles = $(git status --porcelain 2>$null | Measure-Object -Line).Lines
Write-Host "未跟踪/修改的文件数量: $untrackedFiles" -ForegroundColor Cyan

Write-Host "`n第4步: 准备上传到GitHub..." -ForegroundColor Yellow

# 获取当前用户名
$username = $(gh api user --jq '.login')
Write-Host "当前GitHub用户: $username" -ForegroundColor Cyan

# 提示用户输入仓库名称
Write-Host "`n请输入要创建的GitHub仓库名称:" -ForegroundColor White -NoNewline
$repoName = Read-Host

if ([string]::IsNullOrWhiteSpace($repoName)) {
    Write-Host "✗ 仓库名称不能为空" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

# 检查仓库是否已存在
$repoExists = $true
try {
    $repoCheck = $(gh repo view "$username/$repoName" --json name 2>$null)
    if ($LASTEXITCODE -ne 0) {
        $repoExists = $false
    }
} catch {
    $repoExists = $false
}

if ($repoExists) {
    Write-Host "⚠ 仓库 $username/$repoName 已存在，是否覆盖? (y/N)" -ForegroundColor Yellow -NoNewline
    $confirm = Read-Host
    if ($confirm -ne 'y' -and $confirm -ne 'Y') {
        Write-Host "操作已取消" -ForegroundColor Red
        Read-Host "按任意键退出"
        exit 0
    }
}

Write-Host "`n第5步: 创建GitHub仓库..." -ForegroundColor Yellow

# 创建新的GitHub仓库
$createRepoCmd = "gh repo create `"$repoName`" --private:false --confirm"
Write-Host "执行: $createRepoCmd" -ForegroundColor DarkGray
$result = Invoke-Expression $createRepoCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 创建仓库失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host "✓ 成功创建仓库: https://github.com/$username/$repoName" -ForegroundColor Green

Write-Host "`n第6步: 配置本地Git仓库..." -ForegroundColor Yellow

# 添加远程仓库地址
$remoteAddResult = $(git remote add origin "https://github.com/$username/$repoName.git")

if ($LASTEXITCODE -ne 0) {
    # 如果origin已存在，先删除再添加
    git remote remove origin
    $remoteAddResult = $(git remote add origin "https://github.com/$username/$repoName.git")
}

Write-Host "✓ 配置远程仓库地址" -ForegroundColor Green

Write-Host "`n第7步: 添加所有文件到Git索引..." -ForegroundColor Yellow

# 添加所有文件
git add .

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 添加文件失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host "✓ 所有文件已添加到Git索引" -ForegroundColor Green

Write-Host "`n第8步: 提交更改..." -ForegroundColor Yellow

# 检查是否有要提交的更改
$status = $(git status --porcelain)
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "ℹ 没有文件需要提交" -ForegroundColor Cyan
} else {
    # 提交更改
    git commit -m "Initial commit: Upload React TypeScript project with all files and configurations"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ 提交失败" -ForegroundColor Red
        Read-Host "按任意键退出"
        exit 1
    }
    
    Write-Host "✓ 成功提交更改" -ForegroundColor Green
}

Write-Host "`n第9步: 推送到GitHub..." -ForegroundColor Yellow

# 推送主分支到GitHub
git branch -M main
git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 推送失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host "✓ 成功推送到GitHub仓库: https://github.com/$username/$repoName" -ForegroundColor Green

Write-Host "`n=================================" -ForegroundColor Green
Write-Host "项目已成功上传到GitHub!" -ForegroundColor Green
Write-Host "仓库地址: https://github.com/$username/$repoName" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

Write-Host "`n接下来您可以:" -ForegroundColor Cyan
Write-Host "1. 分享您的仓库链接给团队成员" -ForegroundColor Cyan
Write-Host "2. 在GitHub上设置CI/CD流程" -ForegroundColor Cyan
Write-Host "3. 配置项目设置和保护规则" -ForegroundColor Cyan

Read-Host "`n按任意键退出"