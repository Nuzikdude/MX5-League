function RulesPage({ league }) {
  return (
    <section className="card">
      <h2 className="section-title">League Rules</h2>
      {league?.rules?.length ? (
        league.rules.map((rule, i) => (
          <section key={i}>
            {rule.label && <h3>{rule.label}</h3>}
            <p>{rule.value}</p>
          </section>
        ))
      ) : (
        <p>No rules defined.</p>
      )}
    </section>
  );
}