import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 border-r border-white/10 bg-[#0B1020] px-5 py-6 lg:flex lg:flex-col">

      {/* Logo */}
      <div className="mb-10 flex items-center gap-3 px-2">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
          <span className="text-lg">✦</span>
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">
            Cogni<span className="text-blue-500">Forge</span>
          </h1>

          <p className="text-[10px] uppercase tracking-widest text-slate-500">
            AI Study Platform
          </p>
        </div>

      </div>


      {/* Navigation */}
      <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        Workspace
      </div>

      <nav className="space-y-2">

        {/* Dashboard */}
        <button
          onClick={() => scrollToSection('dashboard')}
          className="flex w-full items-center gap-3 rounded-xl bg-blue-500/10 px-4 py-3 text-sm font-medium text-blue-400 ring-1 ring-blue-500/20 transition hover:bg-blue-500/15"
        >
          <span>⌂</span>
          <span>Dashboard</span>
        </button>


        {/* Study Materials */}
        <button
          onClick={() => scrollToSection('materials')}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <span>📚</span>
          <span>Study Materials</span>
        </button>


        {/* Study Aids */}
        <button
          onClick={() => scrollToSection('study-aids')}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <span>✦</span>
          <span>Study Aids</span>
        </button>


        {/* Flashcards */}
        <button
          onClick={() => scrollToSection('flashcards')}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <span>▣</span>
          <span>Flashcards</span>
        </button>


        {/* Quizzes */}
        <button
          onClick={() => scrollToSection('quizzes')}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <span>✓</span>
          <span>Quizzes</span>
        </button>

      </nav>


      {/* Bottom section */}
      <div className="mt-auto">

        <div className="mb-4 border-t border-white/10 pt-4">

          <button
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <span>⚙</span>
            <span>Settings</span>
          </button>

        </div>


        {/* User */}
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">
            S
          </div>

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-medium text-white">
              Student
            </p>

            <p className="text-xs text-slate-500">
              Free account
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="text-slate-500 transition hover:text-red-400"
            title="Log out"
          >
            ↪
          </button>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;