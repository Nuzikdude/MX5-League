MX5 export step

Files included:
- export_mx5_json.py
- export_mx5_json.bat

What it does:
- reads your Excel workbook (.xlsm or .xlsx)
- exports fresh JSON files for the website into public/data

It writes:
- league.json
- drivers.json
- driver-pages.json
- tracks.json
- track-pages.json
- standings.json

How to use on Windows:
1. Put export_mx5_json.py somewhere easy, like inside your mx5-league-site folder.
2. Open Command Prompt in that folder.
3. Run:

python export_mx5_json.py "C:\Users\nuzik\Documents\mx5-league-site\MX5_League_fixed.xlsm" "C:\Users\nuzik\Documents\mx5-league-site\public\data"

Then refresh the website.

Important:
- It keeps existing image paths from your current drivers.json and tracks.json when it can.
- Track links are read from P1 on each track sheet.
- Driver bio fields are read from Driver 1/2/3... tabs.
- Standings are calculated from track results and fastest laps.

If you want, I can next help you make this a one-click double-click batch file with your exact folders already filled in.
