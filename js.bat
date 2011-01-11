@echo off

if "%1"=="" (
	java -cp scripts\js.jar org.mozilla.javascript.tools.shell.Main
	GOTO END
)

if "%1"=="-h" GOTO PRINT_HELP
if "%1"=="-?" GOTO PRINT_HELP
if "%1"=="--help" GOTO PRINT_HELP

if "%1"=="-d" (
	java -classpath scripts\js.jar org.mozilla.javascript.tools.debugger.Main
	GOTO END
)
SET ARGS=[
SET FILENAME=%1
SET FILENAME=%FILENAME:\=/%
for /f "tokens=2,3,4,5,6,7 delims= " %%a in ("%*") do SET ARGS=%ARGS%'%%a','%%b','%%c','%%d','%%e','%%f'
::remove the commas
for %%a in (",''=") do ( call set ARGS=%%ARGS:%%~a%% )
::remove the spaces
for /f "tokens=1*" %%A in ("%ARGS%") do SET ARGS=%%A
SET ARGS=%ARGS%]
java -cp scripts\js.jar org.mozilla.javascript.tools.shell.Main -e _args=%ARGS% -e load('%FILENAME%')		
	
GOTO END

:PRINT_HELP
echo Load a command line Rhino JavaScript environment or run JavaScript script files in Rhino.
echo Available commands:
echo js				Opens a command line JavaScript environment
echo js	-d			Opens the Rhino debugger
echo js -selenium   Starts selenium server
echo js [FILE]			Runs FILE in the Rhino environment

:END