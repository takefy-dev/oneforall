@echo off
set directory = %1
cd directory
pm2 start pm2.json