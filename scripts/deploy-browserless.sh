#!/bin/bash

# Configuration
PROJECT_ID=$(gcloud config get-value project)
REGION="us-west1"  # or your preferred region
SERVICE_NAME="browserless"

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable run.googleapis.com containerregistry.googleapis.com

# Deploy to Cloud Run
echo "Deploying browserless to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image browserless/chrome:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 1 \
  --port 3000 \
  --set-env-vars "MAX_CONCURRENT_SESSIONS=10,PREBOOT_CHROME=true,KEEP_ALIVE=true,DEFAULT_BLOCK_ADS=true,FUNCTION_ENABLE_INCOGNITO_MODE=true"

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
echo "Browserless is deployed at: $SERVICE_URL"
echo "Add this URL to your environment variables as BROWSERLESS_URL=$SERVICE_URL" 