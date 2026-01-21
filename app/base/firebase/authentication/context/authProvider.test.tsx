import { act, render, screen } from '@testing-library/react';
import AuthProvider, { useAuth } from 'app/base/firebase/authentication/context/authProvider';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  getAuth: () => ({}),
}));

const mockOnAuthStateChanged = onAuthStateChanged as unknown as ReturnType<typeof vi.fn>;

const TestComponent = () => {
  const { user, setUser } = useAuth();

  return (
    <div>
      <span>{user?.email ?? 'No user'}</span>
      <button onClick={() => setUser({ displayName: 'Foo', email: 'foo@bar.com', uid: '2' })}>Set User</button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => vi.clearAllMocks());

  it('Provides user context when a user is logged in', async () => {
    mockOnAuthStateChanged.mockImplementation((_, callback: any) => {
      Promise.resolve().then(() => callback({ displayName: 'Foo', email: 'foo@bar.com', uid: '1' } as User));
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const userEmail = await screen.findByText('foo@bar.com');

    expect(userEmail).toBeDefined();
    expect(onAuthStateChanged).toHaveBeenCalledTimes(1);
  });

  it('Provides null when a user logs out', async () => {
    mockOnAuthStateChanged.mockImplementation((_, callback) => {
      Promise.resolve().then(() => callback(null));
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const noUserText = await screen.findByText('No user');

    expect(noUserText).toBeDefined();
  });

  it('Updates the user state when setUser is called', async () => {
    mockOnAuthStateChanged.mockImplementation((_, callback) => {
      Promise.resolve().then(() => callback(null));
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await screen.findByText('No user');
    await act(async () => screen.getByText('Set User').click());
    const updatedUser = await screen.findByText('foo@bar.com');

    expect(updatedUser).toBeDefined();
  });
});
