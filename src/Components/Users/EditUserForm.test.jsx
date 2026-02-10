import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import EditUserForm from "./EditUserForm";

jest.mock("axios");
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
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    img_Url: "https://example.com/john.jpg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with all input fields", () => {
    axios.get.mockResolvedValue({ data: mockUser });
    renderWithRouter(<EditUserForm />);

    expect(screen.getByRole("textbox", { name: /first name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /last name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /profile image/i })).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    axios.get.mockResolvedValue({ data: mockUser });
    renderWithRouter(<EditUserForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  it("fetches user data on mount", async () => {
    axios.get.mockResolvedValue({ data: mockUser });
    renderWithRouter(<EditUserForm />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("http://localhost:3000/users/1");
    });
  });

  it("populates form fields with fetched user data", async () => {
    axios.get.mockResolvedValue({ data: mockUser });
    renderWithRouter(<EditUserForm />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("https://example.com/john.jpg")).toBeInTheDocument();
    });
  });

  it("submits form with updated data", async () => {
    axios.get.mockResolvedValue({ data: mockUser });
    axios.put.mockResolvedValue({ data: { id: 1 } });

    renderWithRouter(<EditUserForm />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    });

    const firstNameInput = screen.getByRole("textbox", { name: /first name/i });
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, "Jane");

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith("http://localhost:3000/users/1", {
        firstName: "Jane",
        lastName: "Doe",
        email: "john@example.com",
        img_Url: "https://example.com/john.jpg",
      });
    });
  });

  it("does not submit form with missing required fields", async () => {
    axios.get.mockResolvedValue({ data: mockUser });
    renderWithRouter(<EditUserForm />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    });

    const firstNameInput = screen.getByRole("textbox", { name: /first name/i });
    await userEvent.clear(firstNameInput);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.put).not.toHaveBeenCalled();
    });
  });

  it("allows editing all fields", async () => {
    axios.get.mockResolvedValue({ data: mockUser });
    axios.put.mockResolvedValue({ data: { id: 1 } });

    renderWithRouter(<EditUserForm />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    });

    const firstNameInput = screen.getByRole("textbox", { name: /first name/i });
    const lastNameInput = screen.getByRole("textbox", { name: /last name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const imgInput = screen.getByRole("textbox", { name: /profile image/i });

    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, "Johnny");

    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, "Smith");

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "johnny@example.com");

    await userEvent.clear(imgInput);
    await userEvent.type(imgInput, "https://example.com/johnny.jpg");

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith("http://localhost:3000/users/1", {
        firstName: "Johnny",
        lastName: "Smith",
        email: "johnny@example.com",
        img_Url: "https://example.com/johnny.jpg",
      });
    });
  });

  it("handles API errors when fetching user", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    axios.get.mockRejectedValue(new Error("Fetch Error"));

    renderWithRouter(<EditUserForm />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it("handles API errors when updating user", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    axios.get.mockResolvedValue({ data: mockUser });
    axios.put.mockRejectedValue(new Error("Update Error"));

    renderWithRouter(<EditUserForm />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  

  it("calls get only once on component mount", async () => {
    axios.get.mockResolvedValue({ data: mockUser });
    renderWithRouter(<EditUserForm />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });
});
