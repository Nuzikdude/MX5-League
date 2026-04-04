import { useEffect, useState } from "react";

export default function RulesPage() {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    fetch("/data/rules.json")
      .then((res) => res.json())
      .then((data) => setRules(data || []))
      .catch(console.error);
  }, []);

  return (
    <section className="card">
      <h2 className="section-title">Rules</h2>
      {rules.length > 0 ? (
        rules.map((rule, i) => (
          <div key={i} className="rule-section">
            <h3>{rule.label}</h3>
            <p style={{ whiteSpace: "pre-line" }}>{rule.value}</p>
          </div>
        ))
      ) : (
        <p>No rules available.</p>
      )}
    </section>
  );
}