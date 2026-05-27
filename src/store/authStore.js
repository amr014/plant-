import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,

  // restore session
  initializeAuth: () => {
    try {
      const storedUser =
        localStorage.getItem("user");

      const storedToken =
        localStorage.getItem("token");

      if (storedUser && storedToken) {
        set({
          user: JSON.parse(storedUser),
          token: storedToken,
        });
      }
    } catch (error) {
      console.log(error);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  },

  // login
  login: (userData, token) => {
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem("token", token);

    set({
      user: userData,
      token,
    });
  },

  // logout
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
    });
  },
}));