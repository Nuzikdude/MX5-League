import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./index.css";

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
        </nav>
      </header>
      {children}
    </div>
  );
}

function HomePage({ standings, tracks, drivers }) {
  const topDriver = standings[0];

  const totalPoints = useMemo(() => {
    return standings.reduce((sum, d) => sum + (Number(d.points) || 0), 0);
  }, [standings]);

  return (
    <>
      <div className="grid">
        <section className="card">
          <h2 className="section-title">Standings</h2>
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
                  <td>{driver.driver}</td>
                  <td>{driver.points}</td>
                  <td>{driver.wins}</td>
                  <td>{driver.podiums}</td>
                  <td>{driver.fastLaps}</td>
                  <td>{driver.starts}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <div className="mini-card" key={index}>
  {track.image && (
    <img
      src={track.image}
      alt={track.name}
      style={{
        width: "100%",
        height: "120px",
        objectFit: "cover",
        borderRadius: "10px",
        marginBottom: "10px"
      }}
    />
  )}
  <h3>{track.name || track.track}</h3>
  <p>Laps: {track.laps ?? "-"}</p>
</div>
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
              <div className="mini-card" key={index}>
  {driver.image && (
    <img
      src={driver.image}
      alt={driver.name}
      style={{
        width: "100%",
        height: "140px",
        objectFit: "cover",
        borderRadius: "10px",
        marginBottom: "10px"
      }}
    />
  )}
  <h3>{driver.name || driver.driver}</h3>
                <p>
                  {driver.nickname ? `${driver.nickname} · ` : ""}
                  {driver.nationality || "Driver profile"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function StandingsPage({ standings }) {
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
              <td>{driver.driver}</td>
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
          <div className="mini-card" key={index}>
            <h3>{driver.name || driver.driver}</h3>
            <p>{driver.nickname || "No nickname listed"}</p>
            <p>{driver.nationality || "Nationality not listed"}</p>
            {driver.age ? <p>Age: {driver.age}</p> : null}
          </div>
        ))}
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
          <div className="mini-card" key={index}>
            <h3>{track.name || track.track}</h3>
            <p>Laps: {track.laps ?? "-"}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [standings, setStandings] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [league, setLeague] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/standings.json").then((res) => res.json()),
      fetch("/data/tracks.json").then((res) => res.json()),
      fetch("/data/drivers.json").then((res) => res.json()),
      fetch("/data/league.json").then((res) => res.json()),
    ]).then(([standingsData, tracksData, driversData, leagueData]) => {
      setStandings(standingsData);
      setTracks(tracksData);
      setDrivers(driversData);
      setLeague(leagueData);
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
              />
            }
          />
          <Route path="/standings" element={<StandingsPage standings={standings} />} />
          <Route path="/drivers" element={<DriversPage drivers={drivers} />} />
          <Route path="/tracks" element={<TracksPage tracks={tracks} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;