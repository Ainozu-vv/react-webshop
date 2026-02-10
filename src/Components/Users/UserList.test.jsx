import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import UserList from "./UserList";

jest.mock("axios");

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("UserList Component", () => {
  const mockUsers = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      img_Url: "https://example.com/john.jpg",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      img_Url: "https://example.com/jane.jpg",
    },
    {
      id: 3,
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob@example.com",
      img_Url: "https://example.com/bob.jpg",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading message initially", () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    renderWithRouter(<UserList />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays all users after loading", async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    renderWithRouter(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    });
  });

  it("displays user emails correctly", async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    renderWithRouter(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
      expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    });
  });

  it("renders Add new User link", async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    renderWithRouter(<UserList />);

    await waitFor(() => {
      const addLink = screen.getByRole("link", { name: /add new user/i });
      expect(addLink).toHaveAttribute("href", "/new-user");
    });
  });

  it("renders UserCard for each user", async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    renderWithRouter(<UserList />);

    await waitFor(() => {
      const editLinks = screen.getAllByRole("link", { name: /edit/i });
      expect(editLinks).toHaveLength(3);
      expect(editLinks[0]).toHaveAttribute("href", "/edit-user/1");
      expect(editLinks[1]).toHaveAttribute("href", "/edit-user/2");
      expect(editLinks[2]).toHaveAttribute("href", "/edit-user/3");
    });
  });

  it("calls axios.get with correct URL", async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    renderWithRouter(<UserList />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("http://localhost:3000/users");
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });

  it("handles empty user list", async () => {
    axios.get.mockResolvedValue({ data: [] });
    renderWithRouter(<UserList />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    axios.get.mockRejectedValue(new Error("API Error"));
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    
    renderWithRouter(<UserList />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it("displays user profile images", async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    renderWithRouter(<UserList />);

    await waitFor(() => {
      const images = screen.getAllByAltText("Profile image");
      expect(images).toHaveLength(3);
      expect(images[0]).toHaveAttribute("src", "https://example.com/john.jpg");
      expect(images[1]).toHaveAttribute("src", "https://example.com/jane.jpg");
      expect(images[2]).toHaveAttribute("src", "https://example.com/bob.jpg");
    });
  });
});
