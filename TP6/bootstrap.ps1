$ErrorActionPreference = "Stop"

Write-Host "Creating folders..."
mkdir apps -Force | Out-Null
mkdir libs/contracts/src -Force | Out-Null
mkdir libs/kafka-toolkit/src -Force | Out-Null
mkdir docker -Force | Out-Null

Write-Host "Setting up NPM Workspaces..."
Set-Content -Path package.json -Value '{
  "name": "activation-poc",
  "private": true,
  "workspaces": [
    "apps/*",
    "libs/*"
  ]
}'

cd apps

Write-Host "Scaffolding activation-api with NestJS..."
npx -y @nestjs/cli new activation-api --package-manager npm --skip-git --strict

Write-Host "Scaffolding demo-ui with Next.js..."
npx -y create-next-app@latest demo-ui --typescript --tailwind --eslint --app --src-dir false --import-alias "@/*" --use-npm --yes

Write-Host "Installing demo-ui dependencies..."
cd demo-ui
npm install motion react-motion socket.io-client

Write-Host "Installing activation-api dependencies..."
cd ../activation-api
npm install @nestjs/microservices kafkajs @nestjs/mongoose mongoose

cd ../../

Write-Host "Bootstrap completed successfully."
