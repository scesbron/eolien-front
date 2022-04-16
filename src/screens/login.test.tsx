import React from 'react';
import { screen } from '@testing-library/react';

import Login from './login';
import { renderWithSetup } from '../tests/test-helpers';

const render = () => renderWithSetup(<Login />);

describe('Login', () => {
  it('renders correctly', () => {
    render();
    expect(screen.getByText("Nom d'utilisateur")).toBeInTheDocument();
  });
});
