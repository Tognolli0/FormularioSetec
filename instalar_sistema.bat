@echo off
cls
echo ======================================================
echo    SETEC LOGISTICS - INSTALADOR DE AMBIENTE 2026
echo ======================================================
echo.

:: 1. Entrando na pasta do Front-end e instalando dependências
echo [1/2] Configurando Front-end (React)...
cd meu-formulario-logistica
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha ao instalar dependencias do Node. Verifique se o Node.js esta instalado.
    pause
    exit
)
echo.

:: 2. Voltando e entrando na pasta da API C#
echo [2/2] Configurando Back-end (.NET API)...
cd ..
cd SetecApi
dotnet restore
dotnet build
if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha ao compilar a API C#. Verifique se o SDK do .NET esta instalado.
    pause
    exit
)

echo.
echo ======================================================
echo    INSTALACAO CONCLUIDA COM SUCESSO!
echo ======================================================
echo Para rodar o sistema:
echo 1. Rode 'npm run dev' na pasta do Front-end.
echo 2. Rode 'dotnet run' na pasta da API.
echo ======================================================
pause