@echo off
setlocal

REM Usage:
REM export_mx5_json.bat "C:\path\to\MX5_League_fixed.xlsm" "C:\path\to\mx5-league-site\public\data"

python export_mx5_json.py %1 %2

pause
