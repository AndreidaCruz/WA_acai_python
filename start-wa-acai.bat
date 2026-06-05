@echo off
setlocal EnableExtensions

set "ROOT=%~dp0"
cd /d "%ROOT%"

set "PYEXE="
where py >nul 2>nul && set "PYEXE=py -3"
if not defined PYEXE (
  where python >nul 2>nul && set "PYEXE=python"
)

if not defined PYEXE (
  echo [ERRO] Python nao encontrado no PATH.
  exit /b 1
)

if not exist ".venv\Scripts\python.exe" (
  echo [1/5] Criando ambiente virtual...
  %PYEXE% -m venv .venv
  if errorlevel 1 (
    echo [ERRO] Nao foi possivel criar o ambiente virtual.
    exit /b 1
  )
)

set "VENV_PY=%ROOT%.venv\Scripts\python.exe"

echo [2/5] Ativando ambiente virtual e instalando dependencias do backend...
call ".venv\Scripts\activate.bat"
python -m pip install --upgrade pip >nul
python -m pip install -r backend\requirements.txt
if errorlevel 1 (
  echo [ERRO] Falha ao instalar dependencias do backend.
  exit /b 1
)

echo [3/5] Instalando dependencias do frontend...
if not exist "frontend\node_modules" (
  pushd frontend
  npm install
  if errorlevel 1 (
    popd
    echo [ERRO] Falha ao instalar dependencias do frontend.
    exit /b 1
  )
  popd
)

echo [4/5] Iniciando backend e frontend...
set "WA_ACAI_DEBUG=1"
start "WA Acai Backend" /D "%ROOT%backend" "%VENV_PY%" -m src.app.main --debug --host 127.0.0.1 --port 8000
start "WA Acai Frontend" /D "%ROOT%frontend" cmd /c "npm run dev -- --host 127.0.0.1 --port 5173"

echo [5/5] Aguardando a interface subir e abrindo o navegador...
powershell -NoProfile -Command "Start-Sleep -Seconds 10; Start-Process 'http://127.0.0.1:5173'"

echo Pronto. Se o navegador nao abriu automaticamente, acesse http://127.0.0.1:5173
endlocal
