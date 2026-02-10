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
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    img_Url: "https://example.com/john.jpg",
  };

  it("renders user information correctly", () => {
    renderWithRouter(
      <UserCard
        id={mockUser.id}
        firstName={mockUser.firstName}
        lastName={mockUser.lastName}
        email={mockUser.email}
        img_Url={mockUser.img_Url}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("renders default values when props are not provided", () => {
    renderWithRouter(<UserCard id={1} />);

    expect(screen.getByText("Lorem Ipsum")).toBeInTheDocument();
    expect(screen.getByText("a@b.c")).toBeInTheDocument();
  });

  it("displays the profile image with correct src", () => {
    renderWithRouter(
      <UserCard
        id={mockUser.id}
        firstName={mockUser.firstName}
        lastName={mockUser.lastName}
        email={mockUser.email}
        img_Url={mockUser.img_Url}
      />
    );

    const img = screen.getByAltText("Profile image");
    expect(img).toHaveAttribute("src", "https://example.com/john.jpg");
  });

  it("uses default profile image when img_Url is not provided", () => {
    renderWithRouter(<UserCard id={1} />);

    const img = screen.getByAltText("Profile image");
    expect(img).toHaveAttribute(
      "src",
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    );
  });

  it("renders Edit button with correct link", () => {
    renderWithRouter(<UserCard id={5} firstName="John" lastName="Doe" email="john@example.com" />);

    const editLink = screen.getByRole("link", { name: /edit/i });
    expect(editLink).toHaveAttribute("href", "/edit-user/5");
  });

  it("renders Message button", () => {
    renderWithRouter(<UserCard id={1} />);

    const messageButton = screen.getByRole("link", { name: /message/i });
    expect(messageButton).toBeInTheDocument();
  });

  it("renders all required elements", () => {
    renderWithRouter(
      <UserCard
        id={mockUser.id}
        firstName={mockUser.firstName}
        lastName={mockUser.lastName}
        email={mockUser.email}
        img_Url={mockUser.img_Url}
      />
    );

    expect(screen.getByAltText("Profile image")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /message/i })).toBeInTheDocument();
  });
});
