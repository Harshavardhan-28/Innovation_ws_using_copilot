import AuthForm from '@/components/AuthForm';

export default function AuthPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ResumeAI</h1>
          <p className="text-gray-600">Sign in to analyze your resume with AI</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
