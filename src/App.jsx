import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./index.css";
import RulesPage from './pages/RulesPage'; // (Make sure the path matches where your file is)



function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function driverHref(name, drivers = []) {
  const found = drivers.find(
    (d) => d.name === name
  );
  return found ? `/drivers/${found.id}` : "#";
}

function trackHref(track) {
  return `/tracks/${track?.id || slugify(track?.name || track?.track)}`;
}

function Layout({ league, children }) {
  return (
    <div className="app">
      <header className="hero">
        <div>
          <h1>{league?.name || "MX5 League"}</h1>
          <p>Championship dashboard, standings, drivers, and tracks.</p>
        </div>
        <nav className="nav">
        <Link to="/">Home</Link>
         <Link to="/standings">Standings</Link>
         <Link to="/drivers">Drivers</Link>
         <Link to="/tracks">Tracks</Link>
         <Link to="/news">News</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/rules">Rules</Link>
    </nav>
      </header>
      {children}
    </div>
  );
}

function HomePage({ standings, tracks, drivers, news, calendar }) {
  const topDriver = standings[0];

  const totalPoints = useMemo(() => {
    return standings.reduce((sum, d) => sum + (Number(d.points) || 0), 0);
  }, [standings]);

  // Logic to get exactly the next two incomplete races
  const upcomingRaces = useMemo(() => {
    if (!calendar) return [];
    return calendar
      .filter((race) => {
        // Ensure we handle both actual booleans and "true"/"false" strings from JSON
        const isDone = race.completed === true || race.completed === "true";
        return !isDone;
      })
      .slice(0, 2);
  }, [calendar]);

  return (
    <>
      <div className="grid">
        <section className="card">
          <div className="section-head">
            <h2 className="section-title">Latest News</h2>
            <Link className="text-link" to="/news">View all</Link>
          </div>
          {news?.length > 0 ? (
            <article>
              <p>{news[0].date || "-"}</p>
              <h3>{news[0].headline || "Untitled"}</h3>
              <p className="news-preview-body" style={{ whiteSpace: "pre-line" }}>
                {news[0].body || ""}
              </p>
            </article>
          ) : (
            <p>No news yet</p>
          )}
        </section>

        <aside className="card">
          <h2 className="section-title">Upcoming Races</h2>
          {upcomingRaces.length > 0 ? (
            <div className="calendar-preview">
              {upcomingRaces.map((race, index) => {
                const linkedTrack = tracks.find(
                  (t) =>
                    (t.name || t.track || "").toLowerCase() ===
                    (race.track || "").toLowerCase()
                );

                return (
                  <Link
                    key={`${race.track}-${index}`}
                    className="calendar-race-card"
                    to={trackHref(linkedTrack || race)}
                  >
                    <div className="calendar-race-copy">
                      <h3>{race.track}</h3>
                      <p><strong>Time:</strong> {race.time}</p>
                      <p><strong>Date:</strong> {race.date}</p>
                      <p><strong>Laps:</strong> {race.laps}</p>
                    </div>

                    {linkedTrack?.image ? (
                      <img
                        src={linkedTrack.image}
                        alt={race.track}
                        className="calendar-race-image"
                      />
                    ) : (
                      <div className="calendar-race-image-placeholder" />
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <p>Season Complete!</p>
          )}
        </aside>
      </div>

      <div className="grid">
        <section className="card">
          <h2 className="section-title">Standings</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Driver</th>
                  <th>Points</th>
                  <th>Wins</th>
                  <th>Podiums</th>
                  <th>Fast Laps</th>
                  <th>Starts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((driver, index) => (
                  <tr key={index}>
                    <td>{driver.rank}</td>
                    <td>
                      <Link className="name-link" to={driverHref(driver.driver, drivers)}>
                        {driver.driver}
                      </Link>
                    </td>
                    <td>{driver.points}</td>
                    <td>{driver.wins}</td>
                    <td>{driver.podiums}</td>
                    <td>{driver.fastLaps}</td>
                    <td>{driver.starts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="card">
          <h2 className="section-title">League Snapshot</h2>
          <div className="kpis">
            <div className="kpi">
              <div className="kpi-label">Leader</div>
              <div className="kpi-value">{topDriver?.driver || "-"}</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Leader Points</div>
              <div className="kpi-value">{topDriver?.points ?? 0}</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Tracks</div>
              <div className="kpi-value">{tracks.length}</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Total Points</div>
              <div className="kpi-value">{totalPoints}</div>
            </div>
          </div>
        </aside>
      </div>

      <div className="bottom-grid">
        <section className="card">
          <div className="section-head">
            <h2 className="section-title">Tracks</h2>
            <Link className="text-link" to="/tracks">
              View all
            </Link>
          </div>
          <div className="track-list">
            {tracks.slice(0, 6).map((track, index) => (
              <Link className="mini-card card-link" key={index} to={trackHref(track)}>
                {track.image && (
                  <img
                    src={track.image}
                    alt={track.name || track.track}
                    className="card-image"
                  />
                )}
                <h3>{track.name || track.track}</h3>
                <p>Laps: {track.laps ?? "-"}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="section-head">
            <h2 className="section-title">Drivers</h2>
            <Link className="text-link" to="/drivers">
              View all
            </Link>
          </div>
          <div className="driver-list">
            {drivers.slice(0, 6).map((driver, index) => (
              <Link className="mini-card driver-card card-link" key={index} to={`/drivers/${driver.id}`}>
                {driver.image && (
                  <img
                    src={driver.image}
                    alt={driver.name || driver.driver}
                    className="driver-image"
                  />
                )}
                <h3>{driver.name || driver.driver}</h3>
                <p>{driver.nickname || "Driver profile"}</p>
                <p>{driver.nationality || ""}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function StandingsPage({ standings, drivers }) {
  return (
    <section className="card">
      <h2 className="section-title">Full Standings</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Driver</th>
            <th>Points</th>
            <th>Wins</th>
            <th>Podiums</th>
            <th>Fast Laps</th>
            <th>Starts</th>
            <th>Avg Finish</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((driver, index) => (
            <tr key={index}>
              <td>{driver.rank}</td>
              <td>
                <Link className="name-link" to={driverHref(driver.driver, drivers)}>
                  {driver.driver}
                </Link>
              </td>
              <td>{driver.points}</td>
              <td>{driver.wins}</td>
              <td>{driver.podiums}</td>
              <td>{driver.fastLaps}</td>
              <td>{driver.starts}</td>
              <td>{driver.avgFinish ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function DriversPage({ drivers }) {
  return (
    <section className="card">
      <h2 className="section-title">Drivers</h2>
      <div className="driver-list">
        {drivers.map((driver, index) => (
          <Link className="card-link" key={index} to={`/drivers/${driver.id}`}>
            <div className="mini-card driver-card">
              {driver.image && (
                <img
                  src={driver.image}
                  alt={driver.name || driver.driver}
                  className="driver-image"
                />
              )}
              <h3>{driver.name || driver.driver}</h3>
              <p>{driver.nickname || "No nickname listed"}</p>
              <p>{driver.nationality || "Nationality not listed"}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function DriverPage({ driverPages, standings }) {
  const { id } = useParams();
  const driver = driverPages.find((d) => d.id === id);

  if (!driver) {
    return (
      <section className="card">
        <h2 className="section-title">Driver not found</h2>
      </section>
    );
  }

  const standing = standings.find((s) => s.driver === driver.name);

  return (
    <section className="card detail-page">
      <div className="detail-header">
        {driver.image && (
          <img src={driver.image} alt={driver.name} className="detail-image" />
        )}
        <div>
          <h2 className="section-title detail-title">{driver.name}</h2>
          <p className="detail-meta">
            {driver.nickname || "-"} · {driver.nationality || "-"}
            {driver.age ? ` · Age ${driver.age}` : ""}
          </p>
          {driver.tab ? <p className="detail-meta">Sheet: {driver.tab}</p> : null}
        </div>
      </div>

      <div className="stats-grid">
        <div className="kpi">
          <div className="kpi-label">Points</div>
          <div className="kpi-value">{standing?.points ?? 0}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Wins</div>
          <div className="kpi-value">{standing?.wins ?? 0}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Podiums</div>
          <div className="kpi-value">{standing?.podiums ?? 0}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Fast Laps</div>
          <div className="kpi-value">{standing?.fastLaps ?? 0}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Starts</div>
          <div className="kpi-value">{standing?.starts ?? 0}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Avg Finish</div>
          <div className="kpi-value">{standing?.avgFinish ?? "-"}</div>
        </div>
      </div>
    </section>
  );
}

function TracksPage({ tracks }) {
  return (
    <section className="card">
      <h2 className="section-title">Tracks</h2>
      <div className="track-list">
        {tracks.map((track, index) => (
          <Link className="mini-card card-link" key={index} to={trackHref(track)}>
            {track.image && (
              <img
                src={track.image}
                alt={track.name || track.track}
                className="card-image"
              />
            )}
            <h3>{track.name || track.track}</h3>
            <p>Laps: {track.laps ?? "-"}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function NewsPage({ news }) {
  return (
    <section className="card">
      <h2 className="section-title">News</h2>
      <div className="news-list">
        {news?.length ? (
          news.map((item, index) => (
            <article key={index} className="mini-card">
              <p>{item.date || "-"}</p>
              <h3>{item.headline || "Untitled"}</h3>
              <p>{item.body || ""}</p>
            </article>
          ))
        ) : (
          <p>No news yet.</p>
        )}
      </div>
    </section>
  );
}

function CalendarPage({ calendar }) {
  return (
    <section className="card">
      <div className="section-head">
        <h2 className="section-title">Calendar</h2>
      </div>

      {calendar?.length ? (
        <table className="table">
          <thead>
            <tr>
              <th>Track</th>
              <th>Date</th>
              <th>Time</th>
              <th>Laps</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {calendar.map((race, index) => (
              <tr key={`${race.track}-${race.date}-${race.time}-${index}`}>
                <td>{race.track}</td>
                <td>{race.date}</td>
                <td>{race.time}</td>
                <td>{race.laps ?? "-"}</td>
                <td>
                  <Link className="text-link" to={trackHref(race)}>
                    Track page
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No calendar entries yet.</p>
      )}
    </section>
  );
}

function TrackPage({ trackPages, drivers }) {
  const { id } = useParams();
  const track = trackPages.find((t) => t.id === id);

  if (!track) {
    return (
      <section className="card">
        <h2 className="section-title">Track not found</h2>
      </section>
    );
  }

  function getDriverId(name) {
    const found = drivers.find((d) => d.name === name);
    return found?.id;
  }

  return (
    <section className="card detail-page">
      <div className="detail-header">
        {track.image && (
          <img src={track.image} alt={track.name} className="detail-image" />
        )}
        <div>
          <h2 className="section-title detail-title">{track.name}</h2>
          <p className="detail-meta">{track.location || "-"}</p>
          {track.laps && <p className="detail-meta">Laps: {track.laps}</p>}
          {track.link && (
            <a href={track.link} target="_blank" rel="noreferrer">
              View Track Info
            </a>
          )}
        </div>
      </div>

      <h3 className="section-title">Results</h3>

      <table className="table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Driver</th>
            <th>Lap Time</th>
            <th>Fastest</th>
          </tr>
        </thead>
        <tbody>
          {track.results?.map((r, i) => {
            const driverId = getDriverId(r.driver);

            return (
              <tr key={i}>
                <td>{r.position || "-"}</td>
                <td>
                  {driverId ? (
                    <Link to={`/drivers/${driverId}`}>{r.driver}</Link>
                  ) : (
                    r.driver
                  )}
                </td>
                <td>{r.lapTime || "-"}</td>
                <td>{r.fastestLap ? "🔥" : "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function App() {
  const [tracks, setTracks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [driverPages, setDriverPages] = useState([]);
  const [trackPages, setTrackPages] = useState([]);
  const [league, setLeague] = useState(null);
  const [news, setNews] = useState([]);
  const [calendar, setCalendar] = useState([]);

  const standings = useMemo(() => {
    if (!trackPages.length) return [];

    const table = {};

    const pointsMap = {
      1: 10,
      2: 7,
      3: 5,
      4: 3,
      5: 2,
      6: 1,
    };

    trackPages.forEach((track) => {
      track.results?.forEach((r) => {
        const name = r.driver;
        if (!name) return;

        if (!table[name]) {
          table[name] = {
            driver: name,
            points: 0,
            wins: 0,
            podiums: 0,
            fastLaps: 0,
            starts: 0,
          };
        }

        const pos = Number(r.position);

        if (pos) {
          table[name].starts += 1;
          table[name].points += pointsMap[pos] || 0;

          if (pos === 1) table[name].wins += 1;
          if (pos <= 3) table[name].podiums += 1;
        }

        if (r.fastestLap) {
          table[name].points += 2;
          table[name].fastLaps += 1;
        }
      });
    });

    const sorted = Object.values(table).sort((a, b) => b.points - a.points);

    return sorted.map((d, i) => ({
      ...d,
      rank: i + 1,
    }));
  }, [trackPages]);

  useEffect(() => {
    Promise.all([
      fetch("/data/tracks.json").then((res) => res.json()),
      fetch("/data/drivers.json").then((res) => res.json()),
      fetch("/data/driver-pages.json").then((res) => res.json()),
      fetch("/data/track-pages.json").then((res) => res.json()),
      fetch("/data/league.json").then((res) => res.json()),
      fetch("/data/news.json").then((res) => res.json()),
      fetch("/data/calendar.json").then((res) => res.json()),
    ]).then(([tracksData, driversData, driverPagesData, trackPagesData, leagueData, newsData, calendarData]) => {
      setTracks(tracksData);
      setDrivers(driversData);
      setDriverPages(driverPagesData);
      setTrackPages(trackPagesData);
      setLeague(leagueData);
      setNews(newsData);
      setCalendar(calendarData);
    });
  }, []);

  return (
    <BrowserRouter>
      <Layout league={league}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                standings={standings}
                tracks={tracks}
                drivers={drivers}
                news={news}
                calendar={calendar}
              />
            }
          />
          <Route path="/standings" element={<StandingsPage standings={standings} drivers={drivers} />} />
          <Route path="/drivers" element={<DriversPage drivers={drivers} />} />
          <Route path="/news" element={<NewsPage news={news} />} />
          <Route path="/calendar" element={<CalendarPage calendar={calendar} />} />
          <Route
  path="/drivers/:id"
  element={<DriverPage driverPages={driverPages} standings={standings} />}
/>
          <Route path="/tracks" element={<TracksPage tracks={tracks} />} />
          <Route
            path="/tracks/:id"
            element={<TrackPage trackPages={trackPages} drivers={drivers} />}
          />
          <Route path="/rules" element={<RulesPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
