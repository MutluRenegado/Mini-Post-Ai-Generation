# Script: Grant Secret Manager Secret Accessor to Firebase Cloud Functions 2nd Gen & App Hosting Service Accounts

param (
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,

    [Parameter(Mandatory=$true)]
    [string]$ProjectNumber
)

Write-Host "🔐 Granting Secret Manager Secret Accessor role to $ProjectId service accounts..." -ForegroundColor Cyan

# 1. Grant to Default Compute Service Account (Cloud Functions v2)
$ComputeSA = "${ProjectNumber}-compute@developer.gserviceaccount.com"
Write-Host "Assigning roles/secretmanager.secretAccessor to $ComputeSA..." -ForegroundColor Yellow
gcloud projects add-iam-policy-binding $ProjectId `
    --member="serviceAccount:$ComputeSA" `
    --role="roles/secretmanager.secretAccessor"

# 2. Grant to App Engine / App Hosting Default Service Account
$AppEngineSA = "${ProjectId}@appspot.gserviceaccount.com"
Write-Host "Assigning roles/secretmanager.secretAccessor to $AppEngineSA..." -ForegroundColor Yellow
gcloud projects add-iam-policy-binding $ProjectId `
    --member="serviceAccount:$AppEngineSA" `
    --role="roles/secretmanager.secretAccessor"

Write-Host "✅ Permissions successfully granted!" -ForegroundColor Green
