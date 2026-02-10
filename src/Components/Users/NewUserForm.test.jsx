import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import NewUserForm from "./NewUserForm";

jest.mock("axios");
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

    expect(screen.getByRole("textbox", { name: /first name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /last name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /profile image/i })).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderWithRouter(<NewUserForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const mockNavigate = jest.fn();
    jest.mock("react-router", () => ({
      ...jest.requireActual("react-router"),
      useNavigate: () => mockNavigate,
    }));

    axios.post.mockResolvedValue({ data: { id: 1 } });

    renderWithRouter(<NewUserForm />);

    const firstNameInput = screen.getByRole("textbox", { name: /first name/i });
    const lastNameInput = screen.getByRole("textbox", { name: /last name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const imgInput = screen.getByRole("textbox", { name: /profile image/i });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");
    await userEvent.type(emailInput, "john@example.com");
    await userEvent.type(imgInput, "https://example.com/john.jpg");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:3000/users", {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        img_Url: "https://example.com/john.jpg",
      });
    });
  });

  it("does not submit form with missing required fields", async () => {
    renderWithRouter(<NewUserForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it("does not submit when first name is empty", async () => {
    renderWithRouter(<NewUserForm />);

    const lastNameInput = screen.getByRole("textbox", { name: /last name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await userEvent.type(lastNameInput, "Doe");
    await userEvent.type(emailInput, "john@example.com");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it("does not submit when last name is empty", async () => {
    renderWithRouter(<NewUserForm />);

    const firstNameInput = screen.getByRole("textbox", { name: /first name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(emailInput, "john@example.com");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it("does not submit when email is empty", async () => {
    renderWithRouter(<NewUserForm />);

    const firstNameInput = screen.getByRole("textbox", { name: /first name/i });
    const lastNameInput = screen.getByRole("textbox", { name: /last name/i });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });


  it("form prevents default on submit", async () => {
    axios.post.mockResolvedValue({ data: { id: 1 } });

    renderWithRouter(<NewUserForm />);

    const firstNameInput = screen.getByRole("textbox", { name: /first name/i });
    const lastNameInput = screen.getByRole("textbox", { name: /last name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const form = screen.getByRole("button", { name: /submit/i }).closest("form");

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");
    await userEvent.type(emailInput, "john@example.com");

    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(submitEvent, "preventDefault");

    form.dispatchEvent(submitEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
