import styles from './PublicInfoPage.module.scss'

export default function PublicInfoPage() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Młodzi Działają</h1>
      <p className={styles.paragraph}>
        Młodzi Działają to cyfrowa platforma, która pomaga młodym wolontariuszom znaleźć inicjatywy w Krakowie,
        a organizacjom i szkołom sprawnie zarządzać ich zaangażowaniem.
      </p>
      <p className={styles.paragraph}>
        Naszym celem jest stworzenie jednego, wiarygodnego miejsca współpracy między młodzieżą, organizacjami i koordynatorami,
        aby każdy wolontariusz mógł bezpiecznie rozwijać umiejętności i realnie wpływać na lokalną społeczność.
      </p>
      <h2 className={styles.sectionTitle}>Jakie wyzwania rozwiązujemy?</h2>
      <ul className={styles.list}>
        <li className={styles.listItem}>Ułatwiamy organizacjom docieranie z ofertami do młodych ludzi w atrakcyjnej i przejrzystej formie.</li>
        <li className={styles.listItem}>Zapewniamy szkołom narzędzia do formalnego prowadzenia i raportowania wolontariatu uczniów, w tym osób U18.</li>
        <li className={styles.listItem}>
          Budujemy przestrzeń, która wspiera bezpieczną komunikację, zarządzanie zgodami oraz dokumentowanie efektów działań.
        </li>
        <li className={styles.listItem}>Pomagamy wolontariuszom odkrywać inicjatywy dopasowane do ich zainteresowań i budować portfolio aktywności.</li>
      </ul>
    </section>
  )
}
