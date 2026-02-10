import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputField from "./InputField";

describe("InputField Component", () => {
  it("renders input field with correct field name", () => {
    const ref = React.createRef();
    render(
      <InputField field="firstName" field_name="First Name" refField={ref} />
    );

    const label = screen.getByText("First Name");
    expect(label).toBeInTheDocument();
  });

  it("renders input field with correct field id", () => {
    const ref = React.createRef();
    render(
      <InputField field="firstName" field_name="First Name" refField={ref} />
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "firstName");
  });

  it("renders input field with correct field name attribute", () => {
    const ref = React.createRef();
    render(
      <InputField field="firstName" field_name="First Name" refField={ref} />
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("name", "firstName");
  });

  it("renders with default type of text", () => {
    const ref = React.createRef();
    render(
      <InputField field="firstName" field_name="First Name" refField={ref} />
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "text");
  });

  it("renders with custom input type", () => {
    const ref = React.createRef();
    render(
      <InputField
        field="email"
        field_name="Email"
        type="email"
        refField={ref}
      />
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "email");
  });

  it("has required attribute", () => {
    const ref = React.createRef();
    render(
      <InputField field="firstName" field_name="First Name" refField={ref} />
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("required");
  });

  it("applies col-span-1 class when col_span is 1", () => {
    const ref = React.createRef();
    const { container } = render(
      <InputField
        field="firstName"
        field_name="First Name"
        col_span={1}
        refField={ref}
      />
    );

    const div = container.querySelector(".col-span-1");
    expect(div).toBeInTheDocument();
  });

  it("applies col-span-2 class when col_span is 2", () => {
    const ref = React.createRef();
    const { container } = render(
      <InputField
        field="firstName"
        field_name="First Name"
        col_span={2}
        refField={ref}
      />
    );

    const div = container.querySelector(".col-span-2");
    expect(div).toBeInTheDocument();
  });

  it("applies col-span-2 class by default", () => {
    const ref = React.createRef();
    const { container } = render(
      <InputField field="firstName" field_name="First Name" refField={ref} />
    );

    const div = container.querySelector(".col-span-2");
    expect(div).toBeInTheDocument();
  });

  it("applies default col-span-2 class for other values", () => {
    const ref = React.createRef();
    const { container } = render(
      <InputField
        field="firstName"
        field_name="First Name"
        col_span={5}
        refField={ref}
      />
    );

    const div = container.querySelector(".col-span-2");
    expect(div).toBeInTheDocument();
  });

  it("associates label with input (htmlFor attribute)", () => {
    const ref = React.createRef();
    render(
      <InputField field="firstName" field_name="First Name" refField={ref} />
    );

    const label = screen.getByText("First Name");
    expect(label).toHaveAttribute("for", "firstName");
  });

  it("accepts input value through ref", async () => {
    const ref = React.createRef();
    render(
      <InputField field="firstName" field_name="First Name" refField={ref} />
    );

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "John");

    expect(ref.current.value).toBe("John");
  });

  it("has placeholder empty by default", () => {
    const ref = React.createRef();
    render(
      <InputField field="firstName" field_name="First Name" refField={ref} />
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "");
  });

  it("applies focus styles correctly", () => {
    const ref = React.createRef();
    const { container } = render(
      <InputField field="firstName" field_name="First Name" refField={ref} />
    );

    const input = container.querySelector("input");
    expect(input).toHaveClass("focus:border-blue-600");
    expect(input).toHaveClass("focus:outline-none");
  });

  it("renders multiple input fields independently", () => {
    const ref1 = React.createRef();
    const ref2 = React.createRef();
    render(
      <>
        <InputField field="firstName" field_name="First Name" refField={ref1} />
        <InputField field="lastName" field_name="Last Name" refField={ref2} />
      </>
    );

    const labels = screen.getAllByRole("textbox");
    expect(labels).toHaveLength(2);
  });
});
