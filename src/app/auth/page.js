'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Card from '@/components/ui/Card';

export default function AuthPage() {
  const router = useRouter();
  const [supabase] = useState(() => createSupabaseClient());
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    if (supabase) {
      setIsConfigured(true);
      
      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.push('/');
          router.refresh();
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [supabase, router]);

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication</h1>
          <div className="text-gray-400 mb-6">
            <p className="mb-4">Supabase is not configured yet.</p>
            <p className="text-sm">
              To enable authentication, please add your Supabase credentials to <code className="bg-gray-700 px-2 py-1 rounded">.env.local</code>:
            </p>
          </div>
          <div className="text-left bg-gray-800 p-4 rounded-lg mb-6">
            <code className="text-sm text-green-400">
              NEXT_PUBLIC_SUPABASE_URL=your_project_url<br/>
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
            </code>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Continue without Auth (Demo Mode)
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to track your learning journey</p>
        </div>
        
        <Card>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#374151',
                    defaultButtonBackgroundHover: '#4b5563',
                    defaultButtonBorder: '#6b7280',
                    defaultButtonText: 'white',
                    dividerBackground: '#4b5563',
                    inputBackground: '#374151',
                    inputBorder: '#6b7280',
                    inputBorderHover: '#9ca3af',
                    inputBorderFocus: '#2563eb',
                    inputText: 'white',
                    inputLabelText: '#d1d5db',
                    inputPlaceholder: '#9ca3af',
                    messageText: '#ef4444',
                    messageTextDanger: '#ef4444',
                    anchorTextColor: '#60a5fa',
                    anchorTextHoverColor: '#93c5fd',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              },
            }}
            providers={['google']}
            redirectTo={`${window.location.origin}/auth/callback`}
            onlyThirdPartyProviders={false}
            showLinks={true}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign In',
                  loading_button_label: 'Signing In...',
                  social_provider_text: 'Sign in with {{provider}}',
                  link_text: "Don't have an account? Sign up",
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign Up',
                  loading_button_label: 'Signing Up...',
                  social_provider_text: 'Sign up with {{provider}}',
                  link_text: 'Already have an account? Sign in',
                },
              },
            }}
          />
        </Card>
        
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Continue without signing in (Demo Mode)
          </button>
        </div>
      </div>
    </div>
  );
}