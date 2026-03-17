import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserCard from "./UserCard";

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("UserCard Component", () => {
  const mockUser = {
    id: 1,
    username: "admin",
    permissions: 1,
  };

  it("renders user information correctly", () => {
    renderWithRouter(
      <UserCard
        id={mockUser.id}
        username={mockUser.username}
        permissions={mockUser.permissions}
      />
    );

    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("ADMIN")).toBeInTheDocument();
  });

  it("renders default values when props are not provided", () => {
    renderWithRouter(<UserCard id={1} />);

    expect(screen.getByText("user")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders Edit button with correct link", () => {
    renderWithRouter(<UserCard id={5} username="john" permissions={0} />);

    const editLink = screen.getByRole("link", { name: /edit/i });
    expect(editLink).toHaveAttribute("href", "/edit-user/5");
  });

  it("renders all required elements", () => {
    renderWithRouter(
      <UserCard
        id={mockUser.id}
        username={mockUser.username}
        permissions={mockUser.permissions}
      />
    );

    expect(screen.getByRole("link", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByText("ADMIN")).toBeInTheDocument();
  });
});
