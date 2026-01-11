# Backend
cd backend
New-Item -Path "app/routers/admin.py" -ItemType File -Force

# Frontend
cd ../frontend
New-Item -Path "app/admin/templates/page.tsx" -ItemType File -Force

cd backend
New-Item -Path "app/models/template_text.py" -ItemType File -Force

cd backend
New-Item -ItemType Directory -Path "backend" -Force | Out-Null
New-Item -Path "app/services/template_service.py" -ItemType File -Force