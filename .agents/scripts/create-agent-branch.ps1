param (
    [Parameter(Mandatory=$true)]
    [string]$Role,

    [Parameter(Mandatory=$true)]
    [string]$TaskSlug
)

# Validate role
$AllowedRoles = @("frontend", "backend", "test", "fix", "feature")
if ($AllowedRoles -notcontains $Role) {
    Write-Error "Invalid role '$Role'. Allowed roles: $($AllowedRoles -join ', ')"
    exit 1
}

# Clean slug (lowercase, replace spaces/special chars with hyphens)
$CleanSlug = $TaskSlug.ToLower() -replace '[^a-z0-9\-]', '-' -replace '-+', '-'

$BranchName = "$Role/$CleanSlug"

Write-Host "🚀 Creating clean git branch: $BranchName" -ForegroundColor Green

# Ensure working directory is clean or checkout new branch
git checkout -b $BranchName

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully switched to branch '$BranchName'" -ForegroundColor Green
} else {
    Write-Error "❌ Failed to create branch '$BranchName'"
    exit 1
}
