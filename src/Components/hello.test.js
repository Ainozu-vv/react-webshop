import { render, screen } from '@testing-library/react';

describe('Hello Test', () => {
  test('renders a simple element', () => {
    render(<div>Hello, World!</div>);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });
});
