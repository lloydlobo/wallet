import { createSignal, onCleanup, onMount, Show } from 'solid-js';
import { z } from 'zod';

/*
 * Handling Tokens:
 * The mockUserSession object contains the user session details, including the access token if applicable.
 * When the user logs in (authService.login), the userStore.setSession function is called to set the session, including the access token.
 * The access token can be accessed as userStore.session?.accessToken or userSession()?.accessToken within the components.
 *
 * Clearing Cookies:
 * When the user logs out (authService.logout), the userStore.clearSession function is called to clear the session, including removing the local cookie.
 * The userStore.clearSession function removes the userSession cookie by setting its expiration date to a past date, effectively deleting it.
 *
 * Handling Refresh:
 * The ExampleHeaderAuth component uses the onMount SolidJS function to run code when the component is mounted.
 * On mount, the component checks for the presence of the userSession cookie and restores the session if available.
 * If a valid stored user session is found, it is set using userStore.setSession to restore the session details, including the access token.
 */

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
    <header class="overflow-clip">
      <Show when={userSession()}>
        <div class="absolute">
          <img src={userSession()?.user.avatar} alt="User Avatar" />
          <p>{userSession()?.user.email}</p>
          <button type="button" onClick={handleLogout}>
            LocalLogout
          </button>
        </div>
      </Show>
      <Show when={!userSession()}>
        <div class="absolute">
          <button type="button" onClick={handleLogin}>
            LocalLogin
          </button>
        </div>
      </Show>
    </header>
  );
};

// The onMount function is used to check for the presence of the userSession cookie and restore
// the user session if available. The setMounted signal is used to control when to render the
// Header component, ensuring that the check for cookies is performed before rendering.
//
//
// The storedUserSession variable is used to store the parsed session details from the cookie.
//
//
// If a valid storedUserSession is found, it is set as the user session using the userStore.setSession method.
//
//
// The Header component is wrapped inside a <Show> component, which ensures that it is only
// rendered when the setMounted signal is true, indicating that the check for cookies has been performed.
//
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

// // Get the stored tokens from the cookies
// const cookies = document.cookie.split(';');
// let storedAccessToken;
// let storedRefreshToken;
//
// for (let i = 0; i < cookies.length; i++) {
//   const cookie = cookies[i].trim();
//   if (cookie.startsWith('accessToken=')) {
//     storedAccessToken = cookie.substring('accessToken='.length);
//   } else if (cookie.startsWith('refreshToken=')) {
//     storedRefreshToken = cookie.substring('refreshToken='.length);
//   }
// }

// Use the retrieved tokens as needed
// console.log(storedAccessToken);
// console.log(storedRefreshToken);

/*
 # Define the workflow steps

# Step 1: User login
- name: User Login
  steps:
    - name: Authenticate User
      run: |
        # Simulate the login process
        await authService.login()
        userStore.setSession(mockUserSession)

# Step 2: User logout
- name: User Logout
  steps:
    - name: Log Out User
      run: |
        # Simulate the logout process
        await authService.logout()
        userStore.clearSession()

# Step 3: Check for user session on mount
- name: Check User Session
  steps:
    - name: On Mount
      run: |
        # Check if user session cookie is present
        const storedUserSession = await cookies.get('userSession')
        if (storedUserSession) {
          userStore.setSession(JSON.parse(storedUserSession))
        }
        setMounted(true)

# Step 4: Render Header Component
- name: Render Header Component
  steps:
    - name: Display Header
      run: |
        # Render the header component only when mounted and user session is available
        render(
          <Show when={mounted && userStore.session}>
            <Header />
          </Show>
        )

# Step 5: Render App Component
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

    # Execute Step 3: Check User Session
    - name: Execute Check User Session Step
      run: |
        executeStep("Check User Session")

    # Execute Step 4: Render Header Component
    - name: Execute Render Header Component Step
      run: |
        executeStep("Render Header Component")

    # Execute Step 5: Render App Component
    - name: Execute Render App Component Step
      run: |
        executeStep("Render App Component")

    # Execute Step 2: User Logout
    - name: Execute User Logout Step
      run: |
        executeStep("User Logout")
 */
