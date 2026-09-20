import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';

function Dashboard() {
  const [materials, setMaterials] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);
  const [studyAids, setStudyAids] = useState(null);
  const [userName, setUserName] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
  fetchMaterials();

  const storedUser = localStorage.getItem('user');

  if (storedUser) {
    const user = JSON.parse(storedUser);
    setUserName(user.name);
  }

  // Quiz history load
  const savedHistory = localStorage.getItem('quizHistory');

  if (savedHistory) {
    setQuizHistory(JSON.parse(savedHistory));
  }
}, []);

  const fetchMaterials = async () => {
    try {
      const res = await api.get('/materials');
      setMaterials(res.data.materials);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Choose a PDF file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('title', title || file.name);

    setLoading(true);

    try {
      await api.post('/materials/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTitle('');
      setFile(null);

      // reset file input
      e.target.reset();

      fetchMaterials();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Upload failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (materialId) => {
    setGeneratingId(materialId);
    setStudyAids(null);
    setError('');

    try {
      const res = await api.post(`/ai/generate/${materialId}`);
      setStudyAids(res.data);

      // Scroll to study aids
      setTimeout(() => {
        document
          .getElementById('study-aids')
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Generation failed.'
      );
    } finally {
      setGeneratingId(null);
    }
  };

  const handleAnswerSelect = (questionIndex, option) => {
    if (quizSubmitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleSubmitQuiz = () => {
    const score = calculateScore();
    const total = studyAids.quiz.length;

    const newAttempt = {
      score,
      total,
      percentage: Math.round((score / total) * 100),
      date: new Date().toLocaleString(),
    };

    const updatedHistory = [...quizHistory, newAttempt];

    setQuizHistory(updatedHistory);
    localStorage.setItem(
      'quizHistory',
      JSON.stringify(updatedHistory)
    );

    setQuizSubmitted(true);
  };
  const calculateScore = () => {
    if (!studyAids?.quiz) return 0;

    return studyAids.quiz.reduce((score, question, index) => {
      if (selectedAnswers[index] === question.correctAns) {
        return score + 1;
      }

      return score;
    }, 0);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#070B18] text-white">

      <Sidebar />
      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}

      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#070B18]/90 px-5 py-4 backdrop-blur-xl lg:hidden">

        <h1 className="text-lg font-bold">
          Cogni<span className="text-blue-500">Forge</span>
        </h1>

        <button
          onClick={handleLogout}
          className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400"
        >
          Log out
        </button>

      </div>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="lg:ml-64">

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">

          {/* =================================================
              TOP BAR
          ================================================== */}

          <div className="mb-8 flex items-center justify-between">

            <div>

              <p className="mb-1 text-sm text-blue-400">
                AI-powered learning workspace
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Hello, {userName || 'Student'}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Turn your study material into AI-powered learning.
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:text-white sm:block"
            >
              Log out
            </button>

          </div>


          {/* ERROR */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}


          {/* =================================================
              UPLOAD CARD
          ================================================== */}

          <section className="relative mb-10 overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-[#10182D] to-[#0B1020] p-6 shadow-2xl shadow-blue-950/20 sm:p-8">

            {/* Glow */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-violet-600/10 blur-3xl" />


            <div className="relative">

              <div className="mb-6 flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl ring-1 ring-blue-500/20">
                  📄
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Upload study material
                  </h2>

                  <p className="text-sm text-slate-400">
                    Upload a PDF and let AI transform it into study aids.
                  </p>
                </div>

              </div>


              <form onSubmit={handleUpload}>

                <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">

                  {/* Title */}

                  <div>

                    <label className="mb-2 block text-xs font-medium text-slate-400">
                      Material title
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Machine Learning Notes"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#080D1B] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                    />

                  </div>


                  {/* File */}

                  <div>

                    <label className="mb-2 block text-xs font-medium text-slate-400">
                      PDF document
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/15 bg-[#080D1B] px-4 py-3 transition hover:border-blue-500/50 hover:bg-blue-500/5">

                      <span className="text-lg">
                        📎
                      </span>

                      <span className="truncate text-sm text-slate-400">
                        {file ? file.name : 'Choose PDF file'}
                      </span>

                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                          setFile(e.target.files[0])
                        }
                        className="hidden"
                      />

                    </label>

                  </div>


                  {/* Upload */}

                  <div className="flex items-end">

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02] hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                    >
                      {loading
                        ? 'Uploading...'
                        : 'Upload material →'}
                    </button>

                  </div>

                </div>

              </form>

            </div>

          </section>


          {/* =================================================
              MATERIALS HEADER
          ================================================== */}

          <section className="mb-10">

            <div className="mb-4 flex items-end justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                  Library
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  Your materials
                </h2>

              </div>

              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400">
                {materials.length}{' '}
                {materials.length === 1
                  ? 'document'
                  : 'documents'}
              </span>

            </div>


            {/* MATERIAL LIST */}

            {materials.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">

                <div className="mb-3 text-4xl">
                  📚
                </div>

                <p className="text-sm text-slate-400">
                  Nothing uploaded yet.
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Upload your first PDF above to get started.
                </p>

              </div>

            ) : (

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1020]/80 shadow-xl">

                {materials.map((material, index) => (

                  <div
                    key={material.id}
                    className={`group flex flex-col gap-4 px-5 py-5 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between ${index !== materials.length - 1
                      ? 'border-b border-white/10'
                      : ''
                      }`}
                  >

                    <div className="flex min-w-0 items-center gap-4">

                      {/* PDF Icon */}

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-lg ring-1 ring-red-500/10">
                        📄
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-medium text-white">
                          {material.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Added{' '}
                          {new Date(
                            material.createdAt
                          ).toLocaleDateString()}
                        </p>

                      </div>

                    </div>


                    {/* Generate */}

                    <button
                      onClick={() =>
                        handleGenerate(material.id)
                      }
                      disabled={
                        generatingId === material.id
                      }
                      className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-2 text-sm font-medium text-blue-400 transition hover:border-blue-500/40 hover:bg-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {generatingId === material.id
                        ? 'Generating...'
                        : 'Generate study aids →'}
                    </button>

                  </div>

                ))}

              </div>

            )}

          </section>


          {/* =================================================
              STUDY AIDS
          ================================================== */}

          {studyAids && (

            <div id="study-aids" className="space-y-10">

              {/* SUMMARY */}

              <section>

                <div className="mb-4 flex items-center gap-3">

                  <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-400 to-violet-500" />

                  <div>

                    <p className="text-xs uppercase tracking-widest text-blue-400">
                      AI Generated
                    </p>

                    <h2 className="text-xl font-semibold text-white">
                      Summary
                    </h2>

                  </div>

                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0B1020] p-6 shadow-xl">

                  <p className="text-sm leading-7 text-slate-300">
                    {studyAids.summary}
                  </p>

                </div>

              </section>


              {/* FLASHCARDS */}

              <section id="flashcards">

                <div className="mb-4">

                  <p className="text-xs uppercase tracking-widest text-blue-400">
                    Practice
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Flashcards
                  </h2>

                </div>


                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                  {studyAids.flashcards.map(
                    (fc, index) => (

                      <div
                        key={index}
                        className="group rounded-2xl border border-white/10 bg-[#0B1020] p-6 transition hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-950/20"
                      >

                        <div className="mb-5 flex items-center justify-between">

                          <span className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400">
                            Card {index + 1}
                          </span>

                          <span className="text-slate-600">
                            ✦
                          </span>

                        </div>

                        <p className="mb-4 text-base font-semibold leading-6 text-white">
                          {fc.question}
                        </p>

                        <div className="border-t border-white/10 pt-4">

                          <p className="text-sm leading-6 text-slate-400">
                            {fc.answer}
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </section>


              {/* QUIZ */}

              <section id="quizzes">

                <div className="mb-4">

                  <p className="text-xs uppercase tracking-widest text-violet-400">
                    Test yourself
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Quiz
                  </h2>

                </div>


                <div className="space-y-4">


                  {studyAids.quiz.map((q, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-[#0B1020] p-6"
                    >
                      {/* Question */}
                      <div className="mb-5 flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-400">
                          {index + 1}
                        </span>

                        <p className="text-sm font-medium leading-6 text-white">
                          {q.question}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="grid gap-2 sm:grid-cols-2">
                        {q.options.map((opt, i) => {
                          const isSelected = selectedAnswers[index] === opt;
                          const isCorrect = opt === q.correctAns;

                          let optionClass =
                            'border-white/10 bg-white/[0.02] text-slate-400 hover:border-violet-500/30 hover:bg-white/[0.04]';

                          // Before submit → selected option only
                          if (!quizSubmitted && isSelected) {
                            optionClass =
                              'border-violet-500/50 bg-violet-500/10 text-violet-300';
                          }

                          // After submit
                          if (quizSubmitted) {
                            if (isCorrect) {
                              optionClass =
                                'border-emerald-500/50 bg-emerald-500/10 text-emerald-400';
                            } else if (isSelected && !isCorrect) {
                              optionClass =
                                'border-red-500/50 bg-red-500/10 text-red-400';
                            }
                          }

                          return (
                            <button
                              key={i}
                              type="button"
                              disabled={quizSubmitted}
                              onClick={() => handleAnswerSelect(index, opt)}
                              className={`rounded-xl border px-4 py-3 text-left text-sm transition ${optionClass}`}
                            >
                              <span className="mr-2 font-semibold">
                                {String.fromCharCode(65 + i)}.
                              </span>

                              {opt}

                              {!quizSubmitted && isSelected && (
                                <span className="float-right">✓</span>
                              )}

                              {quizSubmitted && isCorrect && (
                                <span className="float-right">✓</span>
                              )}

                              {quizSubmitted && isSelected && !isCorrect && (
                                <span className="float-right">✕</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Result */}
                      {quizSubmitted && (
                        <div className="mt-4">
                          {selectedAnswers[index] === q.correctAns ? (
                            <p className="text-sm font-medium text-emerald-400">
                              ✓ Correct answer!
                            </p>
                          ) : (
                            <p className="text-sm font-medium text-red-400">
                              ✕ Incorrect. Correct answer: {q.correctAns}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                </div>
                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-4">
                    <p className="text-sm font-medium text-emerald-400">
                      Quiz submitted successfully!
                    </p>
                  </div>
                )}
                {quizSubmitted && (
                  <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-6">
                    <p className="text-sm text-slate-400">
                      Your Score
                    </p>

                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-4xl font-bold text-white">
                        {calculateScore()}
                      </span>

                      <span className="mb-1 text-slate-400">
                        / {studyAids.quiz.length}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-violet-300">
                      {Math.round(
                        (calculateScore() / studyAids.quiz.length) * 100
                      )}% Score
                    </p>
                  </div>
                )}
              </section>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default Dashboard;