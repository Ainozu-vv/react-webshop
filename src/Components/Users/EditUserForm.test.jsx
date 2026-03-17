import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import EditUserForm from "./EditUserForm";

import * as usersApi from "../../api/usersApi";

jest.mock("../../api/usersApi", () => ({
  getUser: jest.fn(),
  patchUserPermissions: jest.fn(),
}));

jest.mock("../Contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isBootstrapping: false,
    PERMISSIONS: { ADMIN: 1, USER_READ: 2, USER_WRITE: 4 },
    hasPermission: () => true,
  }),
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: "1" }),
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("EditUserForm Component", () => {
  const mockUser = {
    id: 1,
    username: "readuser",
    permissions: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with all input fields", async () => {
    usersApi.getUser.mockResolvedValue(mockUser);
    renderWithRouter(<EditUserForm />);

    await screen.findByText(/username/i);
    expect(screen.getByRole("checkbox", { name: /admin/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /user_read/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /user_write/i })).toBeInTheDocument();
  });

  it("renders the submit button", async () => {
    usersApi.getUser.mockResolvedValue(mockUser);
    renderWithRouter(<EditUserForm />);

    const submitButton = await screen.findByRole("button", { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  it("fetches user data on mount", async () => {
    usersApi.getUser.mockResolvedValue(mockUser);
    renderWithRouter(<EditUserForm />);

    await waitFor(() => {
      expect(usersApi.getUser).toHaveBeenCalledWith("1");
    });
  });

  it("populates form fields with fetched user data", async () => {
    usersApi.getUser.mockResolvedValue(mockUser);
    renderWithRouter(<EditUserForm />);

    await waitFor(() => {
      expect(screen.getByText("readuser")).toBeInTheDocument();
      expect(screen.getByRole("checkbox", { name: /user_read/i })).toBeChecked();
    });
  });

  it("submits form with updated data", async () => {
    usersApi.getUser.mockResolvedValue(mockUser);
    usersApi.patchUserPermissions.mockResolvedValue({ ok: true });

    renderWithRouter(<EditUserForm />);

    await waitFor(() => {
      expect(screen.getByText("readuser")).toBeInTheDocument();
    });

    const adminCheckbox = screen.getByRole("checkbox", { name: /admin/i });
    fireEvent.click(adminCheckbox);

    const submitButton = await screen.findByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(usersApi.patchUserPermissions).toHaveBeenCalledWith("1", {
        add: ["ADMIN"],
        remove: [],
      });
    });
  });

  it("handles API errors when fetching user", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    usersApi.getUser.mockRejectedValue(new Error("Fetch Error"));

    renderWithRouter(<EditUserForm />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      expect(screen.getByText(/failed to load user/i)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it("handles API errors when updating permissions", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    usersApi.getUser.mockResolvedValue(mockUser);
    usersApi.patchUserPermissions.mockRejectedValue(new Error("Update Error"));

    renderWithRouter(<EditUserForm />);

    await waitFor(() => {
      expect(screen.getByText("readuser")).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      expect(screen.getByText(/failed to update permissions/i)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  

  it("calls get only once on component mount", async () => {
    usersApi.getUser.mockResolvedValue(mockUser);
    renderWithRouter(<EditUserForm />);

    await waitFor(() => {
      expect(usersApi.getUser).toHaveBeenCalledTimes(1);
    });
  });
});
