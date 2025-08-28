// app/profile/layout.tsx
import Sidebar from "../../components/sidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row overflow-hidden" style={{ height: 'calc(100vh - 128px)' }}>
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
