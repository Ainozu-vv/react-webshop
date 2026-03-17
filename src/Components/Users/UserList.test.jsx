import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserList from "./UserList";

import * as usersApi from "../../api/usersApi";

jest.mock("../../api/usersApi", () => ({
  listUsers: jest.fn(),
}));

jest.mock("../Contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isBootstrapping: false,
    PERMISSIONS: { ADMIN: 1 },
    hasPermission: () => true,
  }),
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("UserList Component", () => {
  const mockUsers = [
    {
      id: 1,
      username: "admin",
      permissions: 1,
    },
    {
      id: 2,
      username: "readuser",
      permissions: 2,
    },
    {
      id: 3,
      username: "writeuser",
      permissions: 6,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading message initially", () => {
    usersApi.listUsers.mockImplementation(() => new Promise(() => {})); // Never resolves
    renderWithRouter(<UserList />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays all users after loading", async () => {
    usersApi.listUsers.mockResolvedValue(mockUsers);
    renderWithRouter(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("admin")).toBeInTheDocument();
      expect(screen.getByText("readuser")).toBeInTheDocument();
      expect(screen.getByText("writeuser")).toBeInTheDocument();
    });
  });

  it("displays user permissions correctly", async () => {
    usersApi.listUsers.mockResolvedValue(mockUsers);
    renderWithRouter(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("ADMIN")).toBeInTheDocument();
      expect(screen.getByText("USER_READ")).toBeInTheDocument();
      expect(screen.getByText("USER_READ, USER_WRITE")).toBeInTheDocument();
    });
  });

  it("renders Add new User link", async () => {
    usersApi.listUsers.mockResolvedValue(mockUsers);
    renderWithRouter(<UserList />);

    await waitFor(() => {
      const addLink = screen.getByRole("link", { name: /add new user/i });
      expect(addLink).toHaveAttribute("href", "/new-user");
    });
  });

  it("renders UserCard for each user", async () => {
    usersApi.listUsers.mockResolvedValue(mockUsers);
    renderWithRouter(<UserList />);

    await waitFor(() => {
      const editLinks = screen.getAllByRole("link", { name: /edit/i });
      expect(editLinks).toHaveLength(3);
      expect(editLinks[0]).toHaveAttribute("href", "/edit-user/1");
      expect(editLinks[1]).toHaveAttribute("href", "/edit-user/2");
      expect(editLinks[2]).toHaveAttribute("href", "/edit-user/3");
    });
  });

  it("calls listUsers once", async () => {
    usersApi.listUsers.mockResolvedValue(mockUsers);
    renderWithRouter(<UserList />);

    await waitFor(() => {
      expect(usersApi.listUsers).toHaveBeenCalledTimes(1);
    });
  });

  it("handles empty user list", async () => {
    usersApi.listUsers.mockResolvedValue([]);
    renderWithRouter(<UserList />);

    await waitFor(() => {
      expect(usersApi.listUsers).toHaveBeenCalled();
      expect(screen.queryByText("admin")).not.toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    usersApi.listUsers.mockRejectedValue(new Error("API Error"));
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    
    renderWithRouter(<UserList />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      expect(screen.getByText(/failed to load users/i)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it("renders Edit links for each user", async () => {
    usersApi.listUsers.mockResolvedValue(mockUsers);
    renderWithRouter(<UserList />);

    await waitFor(() => {
      const editLinks = screen.getAllByRole("link", { name: /edit/i });
      expect(editLinks).toHaveLength(3);
      expect(editLinks[0]).toHaveAttribute("href", "/edit-user/1");
      expect(editLinks[1]).toHaveAttribute("href", "/edit-user/2");
      expect(editLinks[2]).toHaveAttribute("href", "/edit-user/3");
    });
  });
});
