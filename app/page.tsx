"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useMemo, useState, useCallback } from "react";

// Accessible tab keys
type ActiveTab = "tasks" | "chat" | "project" | "invite";
const tabs: { key: ActiveTab; label: string; icon?: string }[] = [
  { key: "tasks", label: "Tasks", icon: "✅" },
  { key: "chat", label: "Chat", icon: "💬" },
  { key: "project", label: "Create Project", icon: "📂" },
  { key: "invite", label: "Invite Friend", icon: "👥" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold">Bettermind</h1>
          <div className="flex items-center gap-3">
            <Authenticated>
              <UserButton afterSignOutUrl="/" />
            </Authenticated>
            <Unauthenticated>
              <SignInButton mode="modal">
                <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-sm">
                  Sign In
                </button>
              </SignInButton>
            </Unauthenticated>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Authenticated>
            <Dashboard />
          </Authenticated>

          <Unauthenticated>
            <div className="text-center py-24">
              <h2 className="text-2xl font-semibold mb-2">
                Welcome, to Bettermind!
              </h2>
              <p className="text-gray-600 mb-6">Please sign in to continue.</p>

              <SignInButton mode="modal">
                <button
                  onMouseMove={(e) => {
                    const target = e.currentTarget;
                    const rect = target.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    target.style.setProperty("--x", `${x}px`);
                    target.style.setProperty("--y", `${y}px`);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.removeProperty("--x");
                    e.currentTarget.style.removeProperty("--y");
                  }}
                  className="group relative inline-flex items-center justify-center px-7 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 ring-1 ring-white/10"
                  style={{ ["--x" as any]: "50%", ["--y" as any]: "50%" }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{
                      background:
                        "radial-gradient(140px circle at var(--x) var(--y), rgba(255,255,255,0.35), transparent 60%)",
                    }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-soft-light"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.15), transparent)",
                    }}
                  />
                  <span className="relative z-10">
                    🚀 Sign In to Bettermind
                  </span>
                </button>
              </SignInButton>
            </div>
          </Unauthenticated>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="mx-auto max-w-5xl px-4 py-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Bettermind
        </div>
      </footer>
    </div>
  );
}

function Dashboard() {
  const { user } = useUser();
  const firstName = user?.firstName ?? user?.username ?? "there";
  const [activeTab, setActiveTab] = useState<ActiveTab>("tasks");

  const messages = useQuery(api.messages.getForCurrentUser);
  const tasksCount = 3; // TODO: replace with real data
  const notificationsCount = 2; // TODO: replace with real data

  const messageCount = messages?.length ?? 0;
  const loading = messages === undefined;

  const stats = useMemo(
    () => [
      { label: "Messages", value: loading ? "—" : messageCount },
      { label: "Tasks", value: loading ? "—" : tasksCount },
      { label: "Notifications", value: loading ? "—" : notificationsCount },
    ],
    [loading, messageCount, tasksCount, notificationsCount]
  );

  // Keyboard navigation for tabs (Left/Right)
  const onKeyDownTabs = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const idx = tabs.findIndex((t) => t.key === activeTab);
      if (e.key === "ArrowRight") {
        const next = tabs[(idx + 1) % tabs.length].key;
        setActiveTab(next);
      } else if (e.key === "ArrowLeft") {
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length].key;
        setActiveTab(prev);
      }
    },
    [activeTab]
  );

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome back, {firstName}! <span className="inline-block">👋</span>
        </h2>
        <p className="text-gray-600 mt-1">
          Here's a quick overview of your account.
        </p>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow transition"
          >
            <div className="text-sm text-gray-500">{s.label}</div>
            <div className="mt-2 text-3xl font-semibold">
              {typeof s.value === "number" ? s.value : s.value}
            </div>
            {loading && (
              <div className="mt-3 h-2 w-24 bg-gray-200 rounded animate-pulse" />
            )}
          </div>
        ))}
      </section>

      {/* Quick actions as Tabs */}
      <section className="space-y-3">
        <h3 className="text-base font-semibold">Quick actions</h3>
        <div
          role="tablist"
          aria-label="Dashboard sections"
          onKeyDown={onKeyDownTabs}
          className="flex flex-wrap gap-3"
        >
          {tabs.map(({ key, label, icon }) => (
            <TabButton
              key={key}
              active={activeTab === key}
              onClick={() => setActiveTab(key)}
              aria-controls={`panel-${key}`}
              aria-selected={activeTab === key}
              role="tab"
            >
              <span className="select-none">
                {icon} {label}
              </span>
            </TabButton>
          ))}
        </div>
      </section>

      {/* Panels */}
      <section
        className="rounded-2xl border bg-white p-6 shadow-sm"
        role="region"
        aria-live="polite"
      >
        <div
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={activeTab}
        >
          {activeTab === "tasks" && <TasksTab />}
          {activeTab === "chat" && <ChatTab />}
          {activeTab === "project" && <ProjectTab />}
          {activeTab === "invite" && <InviteTab />}
        </div>
      </section>

      {/* Recent list (messages preview) */}
      <section className="space-y-3">
        <h3 className="text-base font-semibold">Recent messages</h3>
        <div className="rounded-2xl border bg-white">
          {loading ? (
            <div className="p-5 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          ) : messageCount === 0 ? (
            <div className="p-5 text-gray-600">No messages yet.</div>
          ) : (
            <ul className="divide-y">
              {messages!.slice(0, 5).map((m: any) => (
                <li key={m._id} className="p-5 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{m.title ?? "Untitled"}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {m.preview ?? m.body ?? "…"}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDateTime(m._creationTime)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

/* ------------------ Tabs UI helpers ------------------ */
function TabButton({
  children,
  onClick,
  active,
  role,
  ariaSelected, 
  ariaControls,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      data-active={active ? "true" : "false"}
      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium border shadow-sm transition-all active:scale-[.99]
           bg-white hover:bg-gray-50
           data-[active=true]:bg-gradient-to-r data-[active=true]:from-amber-500 data-[active=true]:via-orange-500 data-[active=true]:to-rose-500
           data-[active=true]:text-white data-[active=true]:shadow-md
           data-[active=true]:ring-2 data-[active=true]:ring-rose-300"
      role={role}
      aria-selected={rest["aria-selected"]}
      aria-controls={ariaControls}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ------------------ Panel stubs (replace with real components) ------------------ */
function TasksTab() {
  return (
    <div className="space-y-3">
      <p className="text-gray-700">✅ Here are your tasks.</p>
      <div className="rounded-xl border p-4">Task list goes here…</div>
    </div>
  );
}

function ChatTab() {
  return (
    <div className="space-y-3">
      <p className="text-gray-700">💬 Your chats.</p>
      <div className="rounded-xl border p-4">Chat UI goes here…</div>
    </div>
  );
}

function ProjectTab() {
  return (
    <div className="space-y-3">
      <p className="text-gray-700">📂 Create a new project.</p>
      <div className="rounded-xl border p-4">Project form goes here…</div>
    </div>
  );
}

function InviteTab() {
  return (
    <div className="space-y-3">
      <p className="text-gray-700">👥 Invite teammates or friends.</p>
      <div className="rounded-xl border p-4">Invite form goes here…</div>
    </div>
  );
}

/* ------------------ Utilities ------------------ */
function formatDateTime(ts?: number) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(d);
  } catch {
    return "";
  }
}
