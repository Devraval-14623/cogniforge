import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../API/axios.js';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050914] text-white relative overflow-hidden">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      {/* Blue glow - top left */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Purple glow - right */}
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none" />

      {/* Bottom glow */}
      <div className="absolute -bottom-60 left-1/3 w-[500px] h-[400px] rounded-full bg-blue-600/5 blur-[130px] pointer-events-none" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative z-10 min-h-screen max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12">

        <div className="min-h-[calc(100vh-6rem)] grid lg:grid-cols-[1fr_0.85fr] gap-12 lg:gap-20 items-center">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="flex flex-col justify-center">

            {/* Logo */}

            <Link
              to="/"
              className="inline-flex items-center gap-3 w-fit mb-14 group"
            >

              {/* Logo icon */}
              <div
                className="
                  w-11 h-11
                  rounded-xl
                  bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600
                  flex items-center justify-center
                  shadow-[0_0_30px_rgba(59,130,246,0.25)]
                  group-hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]
                  transition-all duration-300
                "
              >

                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 3L19 7V17L12 21L5 17V7L12 3Z"
                    stroke="white"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M8.5 9.2L12 11.2L15.5 9.2"
                    stroke="white"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M12 11.2V16"
                    stroke="white"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>

              </div>

              <span className="text-2xl font-semibold tracking-tight">
                Cogni<span className="text-blue-400">Forge</span>
              </span>

            </Link>


            {/* Small badge */}

            <div
              className="
                inline-flex items-center gap-2
                w-fit
                px-3 py-1.5
                rounded-full
                border border-blue-400/20
                bg-blue-400/[0.06]
                text-blue-300
                text-xs font-medium
                mb-6
              "
            >

              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />

              AI-powered learning platform

            </div>


            {/* Heading */}

            <h1
              className="
                text-4xl
                sm:text-5xl
                lg:text-[54px]
                xl:text-[60px]
                font-semibold
                leading-[1.08]
                tracking-[-0.03em]
                max-w-2xl
              "
            >
              Turn your notes into

              <span
                className="
                  block
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-r
                  from-blue-400
                  via-blue-500
                  to-indigo-400
                  mt-1
                "
              >
                something you'll
                <br className="hidden xl:block" />
                actually remember.
              </span>
            </h1>


            {/* Description */}

            <p className="mt-6 text-base sm:text-lg leading-7 text-slate-400 max-w-lg">
              Upload a PDF, and let AI transform your study material
              into summaries, flashcards and quizzes in minutes.
            </p>


            {/* =================================================
                FEATURES
            ================================================= */}

            <div className="mt-9 space-y-4">

              <Feature
                title="AI-powered study tools"
              />

              <Feature
                title="Generate flashcards & quizzes"
              />

              <Feature
                title="Learn faster from your notes"
              />

            </div>


            {/* =================================================
                DECORATIVE STUDY VISUAL
            ================================================= */}

            <div className="hidden xl:block relative h-28 mt-7">

              {/* Glow */}
              <div className="absolute left-16 top-8 w-44 h-16 bg-blue-500/10 blur-3xl rounded-full" />

              {/* PDF card */}

              <div
                className="
                  absolute
                  left-20
                  top-0
                  w-28 h-20
                  rounded-xl
                  border border-blue-400/20
                  bg-gradient-to-br from-blue-500/[0.12] to-indigo-500/[0.04]
                  backdrop-blur-md
                  rotate-[-7deg]
                  shadow-[0_15px_40px_rgba(37,99,235,0.15)]
                "
              >

                <div className="flex items-center justify-center h-full">

                  <div className="text-center">

                    <svg
                      className="w-7 h-7 mx-auto text-blue-400 mb-1"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M6 3H14L19 8V21H6V3Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M14 3V8H19"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />

                    </svg>

                    <span className="text-[9px] text-blue-300">
                      PDF
                    </span>

                  </div>

                </div>

              </div>


              {/* Flashcard */}

              <div
                className="
                  absolute
                  left-52
                  top-8
                  w-24 h-16
                  rounded-xl
                  border border-indigo-400/20
                  bg-indigo-500/[0.06]
                  backdrop-blur-md
                  rotate-[5deg]
                "
              >

                <div className="flex items-center justify-center h-full">

                  <svg
                    className="w-6 h-6 text-indigo-400"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <rect
                      x="5"
                      y="6"
                      width="14"
                      height="11"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />

                    <path
                      d="M8 19H16"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>

                </div>

              </div>

            </div>


            {/* Footer */}

            <p className="mt-8 text-xs text-slate-600">
              © {new Date().getFullYear()} CogniForge
            </p>

          </div>


          {/* =================================================
              RIGHT SIDE - LOGIN CARD
          ================================================= */}

          <div className="w-full max-w-[500px] mx-auto lg:mx-0 lg:ml-auto">

            <div
              className="
                relative
                rounded-2xl
                border border-blue-400/20
                bg-[#0B1220]/80
                backdrop-blur-2xl
                p-7 sm:p-9 lg:p-10
                shadow-[0_0_60px_rgba(37,99,235,0.08),0_25px_80px_rgba(0,0,0,0.45)]
              "
            >

              {/* Card inner glow */}

              <div
                className="
                  absolute
                  -top-20
                  right-10
                  w-40
                  h-40
                  bg-blue-500/10
                  rounded-full
                  blur-[70px]
                  pointer-events-none
                "
              />


              {/* =================================================
                  CARD HEADER
              ================================================= */}

              <div className="relative">

                {/* Small logo */}

                <div className="flex items-center gap-2.5 mb-9">

                  <div
                    className="
                      w-9 h-9
                      rounded-lg
                      bg-gradient-to-br from-blue-400 to-indigo-600
                      flex items-center justify-center
                      shadow-[0_0_20px_rgba(59,130,246,0.2)]
                    "
                  >

                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 3L19 7V17L12 21L5 17V7L12 3Z"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M8.5 9.2L12 11.2L15.5 9.2M12 11.2V16"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                  </div>

                  <span className="text-lg font-semibold">
                    Cogni<span className="text-blue-400">Forge</span>
                  </span>

                </div>


                <h2 className="text-3xl font-semibold tracking-tight text-white">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Log in to continue to your materials.
                </p>

              </div>


              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <div
                  className="
                    mt-6
                    flex items-start gap-3
                    rounded-xl
                    border border-red-500/20
                    bg-red-500/[0.06]
                    px-4 py-3
                  "
                >

                  <svg
                    className="w-5 h-5 text-red-400 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />

                    <path
                      d="M12 8V12"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="12"
                      cy="16"
                      r="0.7"
                      fill="currentColor"
                    />
                  </svg>

                  <p className="text-sm text-red-300">
                    {error}
                  </p>

                </div>
              )}


              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleSubmit}
                className="relative mt-8 space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-300 mb-2.5"
                  >
                    Email
                  </label>

                  <div className="relative">

                    {/* Icon */}

                    <div
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-500
                        pointer-events-none
                      "
                    >

                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />

                        <path
                          d="M3 7L12 13L21 7"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                      </svg>

                    </div>


                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="
                        w-full
                        h-14
                        rounded-xl
                        border border-slate-700/80
                        bg-[#0A1020]
                        pl-12
                        pr-4
                        text-sm
                        text-white
                        placeholder:text-slate-600
                        outline-none
                        transition-all duration-200
                        hover:border-slate-600
                        focus:border-blue-500
                        focus:ring-4
                        focus:ring-blue-500/10
                      "
                    />

                  </div>

                </div>


                {/* PASSWORD */}

                <div>

                  <div className="flex items-center justify-between mb-2.5">

                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-300"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="
                        text-xs
                        text-blue-400
                        hover:text-blue-300
                        transition-colors
                      "
                    >
                      Forgot password?
                    </button>

                  </div>


                  <div className="relative">

                    {/* Lock icon */}

                    <div
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-500
                        pointer-events-none
                      "
                    >

                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="10"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />

                        <path
                          d="M8 10V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V10"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />

                      </svg>

                    </div>


                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="
                        w-full
                        h-14
                        rounded-xl
                        border border-slate-700/80
                        bg-[#0A1020]
                        pl-12
                        pr-12
                        text-sm
                        text-white
                        placeholder:text-slate-600
                        outline-none
                        transition-all duration-200
                        hover:border-slate-600
                        focus:border-blue-500
                        focus:ring-4
                        focus:ring-blue-500/10
                      "
                    />


                    {/* Eye button */}

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-500
                        hover:text-slate-300
                        transition-colors
                      "
                    >

                      {showPassword ? (

                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M3 3L21 21"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />

                          <path
                            d="M10.6 10.6A2 2 0 0013.4 13.4"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />

                          <path
                            d="M9.9 4.2C10.6 4.05 11.3 4 12 4C17.5 4 21 12 21 12C20.5 13.5 19.5 15.1 18.2 16.4"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />

                          <path
                            d="M6.5 6.5C4.3 8.1 3.2 10.5 3 12C3 12 6.5 20 12 20C13.6 20 15 19.5 16.2 18.8"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>

                      ) : (

                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M3 12C3 12 6.5 5 12 5C17.5 5 21 12 21 12C21 12 17.5 19 12 19C6.5 19 3 12 3 12Z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />

                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                        </svg>

                      )}

                    </button>

                  </div>

                </div>


                {/* =================================================
                    LOGIN BUTTON
                ================================================= */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    w-full
                    h-14
                    mt-2
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-500
                    via-blue-500
                    to-indigo-500
                    text-white
                    font-semibold
                    text-sm
                    shadow-[0_10px_35px_rgba(59,130,246,0.20)]
                    hover:shadow-[0_10px_40px_rgba(59,130,246,0.35)]
                    hover:from-blue-400
                    hover:to-indigo-400
                    active:scale-[0.99]
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    transition-all duration-200
                  "
                >

                  {loading ? (

                    <span className="flex items-center justify-center gap-2">

                      <svg
                        className="w-5 h-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeOpacity="0.3"
                        />

                        <path
                          d="M21 12A9 9 0 0012 3"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>

                      Logging in...

                    </span>

                  ) : (

                    <span className="flex items-center justify-center gap-2">

                      Log in

                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5 12H19"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />

                        <path
                          d="M13 6L19 12L13 18"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                      </svg>

                    </span>

                  )}

                </button>

              </form>


              {/* =================================================
                  DIVIDER
              ================================================= */}

              <div className="flex items-center gap-4 my-7">

                <div className="h-px flex-1 bg-slate-800" />

                <span className="text-xs font-medium text-slate-600">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-800" />

              </div>


              {/* =================================================
                  SIGNUP
              ================================================= */}

              <p className="text-center text-sm text-slate-400">

                New here?{' '}

                <Link
                  to="/signup"
                  className="
                    text-blue-400
                    font-medium
                    hover:text-blue-300
                    transition-colors
                  "
                >
                  Create an account
                </Link>

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


/* =====================================================
   FEATURE COMPONENT
===================================================== */

function Feature({ title }) {
  return (
    <div className="flex items-center gap-3">

      <div
        className="
          w-6 h-6
          rounded-full
          bg-blue-500/10
          border border-blue-400/20
          flex items-center justify-center
          shrink-0
        "
      >

        <svg
          className="w-3.5 h-3.5 text-blue-400"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M5 12L10 17L19 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

      </div>

      <span className="text-sm text-slate-300">
        {title}
      </span>

    </div>
  );
}

export default Login;
