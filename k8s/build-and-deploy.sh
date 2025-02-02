#!/bin/bash

# Build images
echo "🏗️  Building Docker images..."
./k8s/build.sh

kind create cluster --name faq-system
# Deploy to Kubernetes

echo "📦 Loading images into Kind cluster..."
kind load docker-image faq-system-frontend:latest
kind load docker-image faq-system-backend:latest


echo "🚀 Deploying to Kubernetes..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml


# Show status
echo "📊 Deployment Status:"
kubectl get pods -n faq-system
kubectl get services -n faq-system

echo "✅ Deployment complete!" 