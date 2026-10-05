import axios from 'axios';

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
  || window.location.hostname.endsWith('github.io');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const demoUsersKey = 'cogniforge_demo_users';
const demoMaterialsKey = 'cogniforge_demo_materials';

const read = (key, fallback = []) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const id = () => (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`);

const demoError = (message, status = 400) => {
  const error = new Error(message);
  error.response = { status, data: { message } };
  return error;
};

const demoUser = (user) => ({ id: user.id, name: user.name, email: user.email });

const demoRequest = async (method, url, data) => {
  const users = read(demoUsersKey);
  const currentUserId = localStorage.getItem('cogniforge_demo_user_id');

  if (method === 'post' && url === '/auth/signup') {
    if (users.some((user) => user.email.toLowerCase() === data.email.toLowerCase())) {
      throw demoError('User already exists');
    }
    const user = { id: id(), name: data.name, email: data.email, password: data.password };
    write(demoUsersKey, [...users, user]);
    localStorage.setItem('cogniforge_demo_user_id', user.id);
    return { data: { message: 'Demo account created', token: `demo-${user.id}`, user: demoUser(user) } };
  }

  if (method === 'post' && url === '/auth/login') {
    const user = users.find((candidate) => candidate.email.toLowerCase() === data.email.toLowerCase());
    if (!user || user.password !== data.password) throw demoError('Invalid credentials');
    localStorage.setItem('cogniforge_demo_user_id', user.id);
    return { data: { message: 'Demo login successful', token: `demo-${user.id}`, user: demoUser(user) } };
  }

  if (!currentUserId) throw demoError('Please log in to continue', 401);

  if (method === 'get' && url === '/materials') {
    return { data: { materials: read(demoMaterialsKey).filter((material) => material.userId === currentUserId) } };
  }

  if (method === 'post' && url === '/materials/upload') {
    const title = data.get('title') || data.get('pdf')?.name || 'Demo study material';
    const material = {
      id: id(),
      title,
      content: 'This is a GitHub Pages demo material. Connect a hosted backend to process real PDF text.',
      userId: currentUserId,
      createdAt: new Date().toISOString(),
    };
    write(demoMaterialsKey, [...read(demoMaterialsKey), material]);
    return { data: { message: 'Demo material added', material } };
  }

  if (method === 'post' && url.startsWith('/ai/generate/')) {
    const materialId = url.split('/').pop();
    const material = read(demoMaterialsKey).find((item) => item.id === materialId && item.userId === currentUserId);
    if (!material) throw demoError('Material not found', 404);
    const demoQuestions = [
      'What is the main subject of the uploaded material?',
      'Which statement best summarizes the uploaded material?',
      'What is the most important concept introduced in the material?',
      'Which conclusion is supported by the uploaded material?',
      'What is the primary purpose described in the material?',
      'Which term is most relevant to the uploaded material?',
      'What relationship is explained in the material?',
      'Which example best represents the material’s key idea?',
      'What should a learner remember from this material?',
      'Which statement is consistent with the uploaded material?',
    ].map((question, index) => ({
      id: `demo-question-${index + 1}`,
      question,
      options: [
        'The key idea described in the material',
        'An unrelated alternative',
        'A minor detail only',
        'None of the above',
      ],
      correctAns: 'The key idea described in the material',
    }));
    return {
      data: {
        message: 'Demo study aids generated',
        summary: `This is a demo summary for ${material.title}. Deploy the server and configure GEMINI_API_KEY for real AI-generated content.`,
        flashcards: [
          { topic: 'Document overview', importance: 'High', importanceNote: 'This establishes the central subject of the uploaded file.', question: 'What is this page?', answer: 'A GitHub Pages demo of CogniForge.' },
          { topic: 'Data and persistence', importance: 'High', importanceNote: 'Understanding storage is essential when moving from demo mode to production.', question: 'Where is the real database?', answer: 'In the deployed Express/Prisma backend.' },
          { topic: 'Key concepts', importance: 'High', importanceNote: 'These concepts are the foundation for understanding the material.', question: 'What should you identify first in the uploaded material?', answer: 'Its main concepts and definitions.' },
          { topic: 'Important details', importance: 'Medium', importanceNote: 'Important details support the main ideas and improve recall.', question: 'Why review supporting details?', answer: 'They explain and reinforce the main ideas.' },
          { topic: 'Relationships', importance: 'High', importanceNote: 'Relationships show how the major topics connect.', question: 'What should you look for between topics?', answer: 'Connections, causes, effects, and comparisons.' },
          { topic: 'Practical application', importance: 'Medium', importanceNote: 'Applications help transfer knowledge into real situations.', question: 'How can you strengthen understanding?', answer: 'Apply the ideas to examples or real problems.' },
          { topic: 'Review priorities', importance: 'High', importanceNote: 'Prioritizing high-value topics makes study time more effective.', question: 'Which topics should be reviewed first?', answer: 'The topics marked High importance.' },
          { topic: 'Exam preparation', importance: 'High', importanceNote: 'Exam-focused review turns the material into actionable study steps.', question: 'How should you use these flashcards?', answer: 'Recall the answer before revealing it and revisit difficult cards.' },
        ],
        quiz: demoQuestions,
      },
    };
  }

  throw demoError(`Demo API route not implemented: ${method.toUpperCase()} ${url}`, 404);
};

const request = (method, url, data, config) => {
  if (!isDemoMode) return api[method](url, data, config);
  return demoRequest(method, url, data, config);
};

const demoApi = {
  get: (url, config) => request('get', url, undefined, config),
  post: (url, data, config) => request('post', url, data, config),
};

export default isDemoMode ? demoApi : api;
