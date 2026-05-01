import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import styles from "./layout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.dashboardShell}>
      <Sidebar />
      <div className={styles.mainContent}>
        <TopNav title="VBV Zertifizierungsportal" />
        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
}
