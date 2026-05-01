import Link from "next/link";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img 
          src="https://raw.githubusercontent.com/yathur-hub/kathiago.ch-assets/main/Kathiago%20Logo%20Transparent.png" 
          alt="Kathiago Logo" 
          className="max-w-[75px] w-full h-auto"
        />
      </div>
      <nav className={styles.nav}>
        <Link href="/">Dashboard</Link>
        <Link href="/learning-hub">Lernmodule & Diagnostik</Link>
        <Link href="/exams">Prüfungssimulation</Link>
        <Link href="/progress">Kompetenznachweis</Link>
        <Link href="/enterprise">Unternehmensverwaltung</Link>
        <Link href="/admin">Systemadministration</Link>
      </nav>
    </aside>
  );
}
