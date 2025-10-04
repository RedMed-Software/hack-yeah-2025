import styles from './PublicInfoPage.module.scss'

export default function PublicInfoPage() {
  return (
    <section className="page">
      <h1>Młodzi Działają</h1>
      <p>
        Młodzi Działają to cyfrowa platforma, która pomaga młodym wolontariuszom znaleźć inicjatywy w Krakowie,
        a organizacjom i szkołom sprawnie zarządzać ich zaangażowaniem.
      </p>
      <p>
        Naszym celem jest stworzenie jednego, wiarygodnego miejsca współpracy między młodzieżą, organizacjami i koordynatorami,
        aby każdy wolontariusz mógł bezpiecznie rozwijać umiejętności i realnie wpływać na lokalną społeczność.
      </p>
      <h2>Jakie wyzwania rozwiązujemy?</h2>
      <ul>
        <li>Ułatwiamy organizacjom docieranie z ofertami do młodych ludzi w atrakcyjnej i przejrzystej formie.</li>
        <li>Zapewniamy szkołom narzędzia do formalnego prowadzenia i raportowania wolontariatu uczniów, w tym osób U18.</li>
        <li>
          Budujemy przestrzeń, która wspiera bezpieczną komunikację, zarządzanie zgodami oraz dokumentowanie efektów działań.
        </li>
        <li>Pomagamy wolontariuszom odkrywać inicjatywy dopasowane do ich zainteresowań i budować portfolio aktywności.</li>
      </ul>
    </section>
  )
}