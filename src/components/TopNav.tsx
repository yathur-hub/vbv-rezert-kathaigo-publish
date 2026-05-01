"use client";

import styles from "./TopNav.module.css";
import { useAuth } from "@/contexts/AuthContext";

export default function TopNav({ title = "Dashboard" }: { title?: string }) {
  const { user } = useAuth();
  
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    : "??";

  const getRoleLabel = (role?: string) => {
    switch(role) {
      case "SUPER_ADMIN": return "Systemadministrator";
      case "ENTERPRISE_ADMIN": return "Mandantenverantwortlicher";
      case "COMPANY_ADMIN": return "Unternehmensadministrator";
      case "LEARNER": return "Zertifikatsanwärter";
      default: return "Gastbenutzer";
    }
  };

  return (
    <header className={styles.topNav}>
      <h1>{title}</h1>
      <div className={styles.userProfile}>
        <div className={styles.avatar}>{initials}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{user?.name || "Gastbenutzer"}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
            {getRoleLabel(user?.role)}
          </span>
        </div>
      </div>
    </header>
  );
}
