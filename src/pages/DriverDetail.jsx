import { useParams } from "react-router-dom";
import drivers from "../data/drivers.json";

export default function DriverDetail() {
  const { id } = useParams();
  const driver = drivers.find((d) => d.id === id);

  if (!driver) return <div>Driver not found</div>;

  return (
    <div className="driver-page">
      {/* HEADER */}
      <div className="driver-header">
        <img src={driver.image} className="driver-hero" />

        <div className="driver-info">
          <h1>{driver.name}</h1>
          <p className="nickname">{driver.nickname}</p>
          <p>{driver.nationality}</p>
          <p>Age: {driver.age}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="driver-stats">
        <div className="stat">
          <span>Points</span>
          <strong>0</strong>
        </div>
        <div className="stat">
          <span>Wins</span>
          <strong>0</strong>
        </div>
        <div className="stat">
          <span>Podiums</span>
          <strong>0</strong>
        </div>
        <div className="stat">
          <span>Fast Laps</span>
          <strong>0</strong>
        </div>
      </div>
    </div>
  );
}