// app/profile/layout.tsx
import Sidebar from "../../components/sidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
