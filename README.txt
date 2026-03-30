MX5 League web export
Files:
- league.json: league title and scoring rules
- drivers.json: driver profiles from Driver tabs
- tracks.json: track metadata
- results.json: per-track finishing rows
- standings.json: current summary table from League Overview

Suggested website pages:
- /           -> league.json + standings.json
- /drivers    -> drivers.json
- /drivers/[slug] -> drivers.json + results.json filtered by driver
- /tracks     -> tracks.json
- /tracks/[slug] -> tracks.json + results.json filtered by track
