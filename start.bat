@echo off
echo ===================================================
echo     KHOI DONG UNG DUNG GIA PHA HO NGUYEN DAC
echo ===================================================

cd /d "%~dp0"

IF NOT EXIST node_modules (
    echo Dang cai dat thu vien lan dau tien, co the mat vai phut...
    call npm install
)

echo.
echo Dang khoi dong may chu. Trinh duyet se tu dong mo...
echo Bam Ctrl+C de tat may chu.
echo.

call npm run dev -- --open
pause
