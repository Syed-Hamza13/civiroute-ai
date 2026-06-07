@echo off
title Hackathon Project Setup
echo Bhai, project ka structure ban raha hai... Thoda wait karo...
echo =======================================================

echo.
echo [1/4] Backend ke folders bana rahe hain...
mkdir backend\config
mkdir backend\controllers
mkdir backend\middlewares
mkdir backend\models
mkdir backend\routes
mkdir backend\utils

echo [2/4] Backend ki files bana rahe hain...
type nul > backend\config\db.js
type nul > backend\controllers\auth.controller.js
type nul > backend\controllers\superadmin.controller.js
type nul > backend\controllers\depthead.controller.js
type nul > backend\controllers\supervisor.controller.js
type nul > backend\controllers\citizen.controller.js
type nul > backend\middlewares\auth.middleware.js
type nul > backend\middlewares\rbac.middleware.js
type nul > backend\models\user.model.js
type nul > backend\models\complaint.model.js
type nul > backend\routes\auth.routes.js
type nul > backend\routes\superadmin.routes.js
type nul > backend\routes\depthead.routes.js
type nul > backend\routes\supervisor.routes.js
type nul > backend\routes\citizen.routes.js
type nul > backend\utils\mockAI.js
type nul > backend\.env
type nul > backend\package.json
type nul > backend\server.js

echo.
echo [3/4] Frontend ke folders bana rahe hain...
mkdir frontend\public
mkdir frontend\src\assets
mkdir frontend\src\components\ui
mkdir frontend\src\components\layout
mkdir frontend\src\components\shared
mkdir frontend\src\context
mkdir frontend\src\pages\Auth
mkdir frontend\src\pages\Dashboards\SuperAdmin
mkdir frontend\src\pages\Dashboards\DeptHead
mkdir frontend\src\pages\Dashboards\Supervisor
mkdir frontend\src\pages\Dashboards\Citizen
mkdir frontend\src\services

echo [4/4] Frontend ki files bana rahe hain...
type nul > frontend\src\context\AuthContext.jsx
type nul > frontend\src\pages\Auth\Login.jsx
type nul > frontend\src\pages\Auth\Signup.jsx
type nul > frontend\src\services\api.js
type nul > frontend\src\App.jsx
type nul > frontend\src\main.jsx
type nul > frontend\src\index.css
type nul > frontend\components.json
type nul > frontend\tailwind.config.js
type nul > frontend\vite.config.js
type nul > frontend\package.json

echo.
echo =======================================================
echo BOOM! Pura folder structure ekdum ready hai!
echo Ab sidha VS Code me open karo (code .) aur development shuru karte hain.
echo =======================================================
pause