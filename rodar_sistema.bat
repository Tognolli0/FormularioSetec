@echo off
cls
echo ======================================================
echo    INICIANDO SISTEMA SETEC LOGISTICS...
echo ======================================================

:: Inicia a API C# em uma nova janela de comando
start "API SETEC (Back-end)" cmd /k "cd SetecApi && dotnet run"

:: Inicia o React na janela atual (ou em outra se preferir)
echo Iniciando Painel do Consultor (Front-end)...
cd meu-formulario-logistica
npm run dev

pause