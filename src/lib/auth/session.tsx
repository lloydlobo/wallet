import { createSignal, onCleanup, onMount, Show } from 'solid-js';
import { z } from 'zod';

const mockUserSession = {
  isAuthenticated: true,
  user: {
    id: 1,
    email: 'example@example.com',
    avatar: 'path/to/avatar.jpg',
  },
};

type TUserSession = typeof mockUserSession;

type TUserStore = {
  session: null | TUserSession;
  setSession: (session: TUserSession) => void;
  clearSession: () => void;
};

const userStore: TUserStore = {
  session: null,
  setSession: (session) => {
    userStore.session = session;
    document.cookie = `userSession=${JSON.stringify(
      session
    )}; expires=Thu, 01 Jan 2024 00:00:00 UTC; path=/`;
  },
  clearSession: () => {
    userStore.session = null;
    document.cookie = 'userSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  },
};

const authService = {
  login: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    userStore.setSession(mockUserSession);
  },
  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    userStore.clearSession();
  },
};

const Header = () => {
  const [userSession, setUserSession] = createSignal<TUserStore['session']>(userStore.session);

  onCleanup(() => {
    setUserSession(null);
  });

  const handleLogin = async () => {
    await authService.login();
    setUserSession(userStore.session);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUserSession(userStore.session);
  };

  return (
    <header>
      <h1>My App</h1>
      <Show when={userSession()}>
        <div>
          <img src={userSession()?.user.avatar} alt="User Avatar" />
          <p>{userSession()?.user.email}</p>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </Show>
      <Show when={!userSession()}>
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </Show>
    </header>
  );
};

export const ExampleHeaderAuth = () => {
  const [_, setMounted] = createSignal(false);

  onMount(() => {
    const cookies = document.cookie.split(';');
    let storedUserSession;

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('userSession=')) {
        storedUserSession = JSON.parse(cookie.substring('userSession='.length));
        break;
      }
    }

    if (storedUserSession) {
      userStore.setSession(storedUserSession);
    }

    setMounted(true);
  });

  return (
    <Show when={_()}>
      <Header />
    </Show>
  );
};

//////

// // Assuming you have received the access and refresh tokens from Supabase
// const accessToken = '...'; // Access token provided by Supabase
// const refreshToken = '...'; // Refresh token provided by Supabase
//
// // Set the access token in a cookie
// document.cookie = `accessToken=${accessToken}; expires=Thu, 01 Jan 2024 00:00:00 UTC; path=/`;
//
// // Set the refresh token in a cookie
// document.cookie = `refreshToken=${refreshToken}; expires=Thu, 01 Jan 2024 00:00:00 UTC; path=/`;
//

// Get the stored tokens from the cookies
const cookies = document.cookie.split(';');
let storedAccessToken;
let storedRefreshToken;

for (let i = 0; i < cookies.length; i++) {
  const cookie = cookies[i].trim();
  if (cookie.startsWith('accessToken=')) {
    storedAccessToken = cookie.substring('accessToken='.length);
  } else if (cookie.startsWith('refreshToken=')) {
    storedRefreshToken = cookie.substring('refreshToken='.length);
  }
}

// Use the retrieved tokens as needed
console.log(storedAccessToken);
console.log(storedRefreshToken);

/*
 # Define the workflow steps

# Step 1: User login
- name: User Login
  steps:
    - name: Authenticate User
      run: |
        # Simulate the login process
        await authService.login()
        userSession(userStore.session)

# Step 2: User logout
- name: User Logout
  steps:
    - name: Log Out User
      run: |
        # Simulate the logout process
        await authService.logout()
        userSession(userStore.session)

# Step 3: Render Header Component
- name: Render Header Component
  steps:
    - name: Display Header
      run: |
        # Render the header component
        if userSession():
          # Render user avatar and email
          render(<Header userSession={userSession()} />)
        else:
          # Render login button
          render(<Header onLogin={handleLogin} />)

# Step 4: Render App Component
- name: Render App Component
  steps:
    - name: Display App
      run: |
        # Render the app component
        render(<App />)

# Execute the workflow
- name: Main Workflow
  steps:
    # Execute Step 1: User Login
    - name: Execute User Login Step
      run: |
        executeStep("User Login")

    # Execute Step 3: Render Header Component
    - name: Execute Render Header Component Step
      run: |
        executeStep("Render Header Component")

    # Execute Step 4: Render App Component
    - name: Execute Render App Component Step
      run: |
        executeStep("Render App Component")

    # Execute Step 2: User Logout
    - name: Execute User Logout Step
      run: |
        executeStep("User Logout")

 */
