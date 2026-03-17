import React from "react";
import { act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import NewUserForm from "./NewUserForm";

import * as usersApi from "../../api/usersApi";

const mockRegister = jest.fn();

jest.mock("../../api/usersApi", () => ({
  patchUserPermissions: jest.fn(),
}));

jest.mock("../Contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isBootstrapping: false,
    PERMISSIONS: { ADMIN: 1, USER_READ: 2, USER_WRITE: 4 },
    hasPermission: () => true,
    register: mockRegister,
  }),
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => jest.fn(),
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("NewUserForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with all input fields", () => {
    renderWithRouter(<NewUserForm />);

    expect(screen.getByRole("textbox", { name: /username/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /admin/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /user_read/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /user_write/i })).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderWithRouter(<NewUserForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    mockRegister.mockResolvedValue({ id: 1 });

    renderWithRouter(<NewUserForm />);

    const usernameInput = screen.getByRole("textbox", { name: /username/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await userEvent.type(usernameInput, "john");
    await userEvent.type(passwordInput, "john123");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: "john",
        password: "john123",
      });
      expect(usersApi.patchUserPermissions).not.toHaveBeenCalled();
    });
  });

  it("submits permissions when any are selected", async () => {
    mockRegister.mockResolvedValue({ id: 7 });

    renderWithRouter(<NewUserForm />);

    const usernameInput = screen.getByRole("textbox", { name: /username/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const readCheckbox = screen.getByRole("checkbox", { name: /user_read/i });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await userEvent.type(usernameInput, "alice");
    await userEvent.type(passwordInput, "alice123");
    fireEvent.click(readCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: "alice",
        password: "alice123",
      });
      expect(usersApi.patchUserPermissions).toHaveBeenCalledWith(7, {
        add: ["USER_READ"],
        remove: [],
      });
    });
  });

  it("does not submit form with missing required fields", async () => {
    renderWithRouter(<NewUserForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).not.toHaveBeenCalled();
    });
  });


  it("form prevents default on submit", async () => {
    mockRegister.mockResolvedValue({ id: 1 });

    renderWithRouter(<NewUserForm />);

    const usernameInput = screen.getByRole("textbox", { name: /username/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen.getByRole("button", { name: /submit/i }).closest("form");

    await userEvent.type(usernameInput, "john");
    await userEvent.type(passwordInput, "john123");

    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(submitEvent, "preventDefault");

    await act(async () => {
      form.dispatchEvent(submitEvent);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
