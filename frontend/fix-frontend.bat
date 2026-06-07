@echo off
title Frontend Architecture Fix
echo Meer bhai, frontend ka structure wapas set kar rahe hain...
echo =======================================================

:: Vite ki unnecessary file delete karna
if exist frontend\src\App.css del frontend\src\App.css

:: Folders create karna
echo [1/2] Apne custom folders bana rahe hain...
if not exist frontend\src\components\ui mkdir frontend\src\components\ui
if not exist frontend\src\components\layout mkdir frontend\src\components\layout
if not exist frontend\src\components\shared mkdir frontend\src\components\shared
if not exist frontend\src\context mkdir frontend\src\context
if not exist frontend\src\pages\Auth mkdir frontend\src\pages\Auth
if not exist frontend\src\pages\Dashboards\SuperAdmin mkdir frontend\src\pages\Dashboards\SuperAdmin
if not exist frontend\src\pages\Dashboards\DeptHead mkdir frontend\src\pages\Dashboards\DeptHead
if not exist frontend\src\pages\Dashboards\Supervisor mkdir frontend\src\pages\Dashboards\Supervisor
if not exist frontend\src\pages\Dashboards\Citizen mkdir frontend\src\pages\Dashboards\Citizen
if not exist frontend\src\services mkdir frontend\src\services

:: Files create karna
echo [2/2] Files bana rahe hain...
type nul > frontend\src\context\AuthContext.jsx
type nul > frontend\src\pages\Auth\Login.jsx
type nul > frontend\src\pages\Auth\Signup.jsx
type nul > frontend\src\services\api.js

:: App.jsx ko clean karna (React Router ke base setup ke sath)
echo import React from 'react'; > frontend\src\App.jsx
echo import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; >> frontend\src\App.jsx
echo. >> frontend\src\App.jsx
echo function App() { >> frontend\src\App.jsx
echo   return ( >> frontend\src\App.jsx
echo     ^<Router^> >> frontend\src\App.jsx
echo       ^<div className="min-h-screen bg-gray-50"^> >> frontend\src\App.jsx
echo         ^<h1 className="text-3xl text-center mt-10 font-bold"^>System Ready^</h1^> >> frontend\src\App.jsx
echo       ^</div^> >> frontend\src\App.jsx
echo     ^</Router^> >> frontend\src\App.jsx
echo   ); >> frontend\src\App.jsx
echo } >> frontend\src\App.jsx
echo. >> frontend\src\App.jsx
echo export default App; >> frontend\src\App.jsx

:: index.css ko clean karke sirf Tailwind ka import dalna
echo @import "tailwindcss"; > frontend\src\index.css

echo.
echo =======================================================
echo DONE! Vite ke core files safe hain aur apna custom structure wapas aa gaya.
echo =======================================================
pause