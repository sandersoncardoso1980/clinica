import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Stethoscope } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials
  const demoUsers = [
    { role: 'Administrador', email: 'admin@clinica.com', password: '123456' },
    { role: 'Médico', email: 'joao@clinica.com', password: '123456' },
    { role: 'Recepcionista', email: 'maria@clinica.com', password: '123456' },
    { role: 'Paciente', email: 'carlos@email.com', password: '123456' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">ClinicaSaaS</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestão Médica</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-12 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Esqueceu sua senha?
            </a>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Credenciais de Demonstração:</h3>
          <div className="space-y-2 text-sm">
            {demoUsers.map((user, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{user.role}:</span>
                <button
                  onClick={() => {
                    setEmail(user.email);
                    setPassword(user.password);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-mono bg-white px-2 py-1 rounded border"
                >
                  {user.email}
                </button>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-2">
              Senha para todos: <code className="bg-white px-1 py-0.5 rounded">123456</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};