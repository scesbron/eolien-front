import React from 'react';
import { screen, waitFor } from '@testing-library/react';

import Login from './login';
import { renderWithSetup } from '../tests/test-helpers';
import { FORGOTTEN_PASSWORD } from '../constants/routes';

const render = () => renderWithSetup(<Login />);

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Login', () => {
  it('renders correctly', () => {
    render();
    expect(screen.getByLabelText("Nom d'utilisateur")).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByLabelText('Se rappeler de moi')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connexion' })).toBeEnabled();
    expect(screen.getByRole('link', { name: 'Mot de passe oublié ?' })).toHaveAttribute(
      'href',
      FORGOTTEN_PASSWORD,
    );
  });

  it("shows an error if we don't set the username", async () => {
    const { user } = render();
    await user.type(screen.getByLabelText('Mot de passe'), 'inconnu');
    await user.click(screen.getByRole('button', { name: 'Connexion' }));
    expect(await screen.findByText("Le nom d'utilisateur est obligatoire")).toBeInTheDocument();
  });

  it("shows an error if we don't set the password", async () => {
    const { user } = render();
    await user.type(screen.getByLabelText("Nom d'utilisateur"), 'inconnu');
    await user.click(screen.getByRole('button', { name: 'Connexion' }));
    expect(await screen.findByText('Le mot de passe est obligatoire')).toBeInTheDocument();
  });

  it('disables the submit button while calling the api', async () => {
    const { user } = render();
    const button = screen.getByRole('button', { name: 'Connexion' });
    await user.type(screen.getByLabelText("Nom d'utilisateur"), 'inconnu');
    await user.type(screen.getByLabelText('Mot de passe'), 'inconnu');
    await user.click(button);
    await waitFor(() => expect(button).toBeDisabled());
  });

  it('returns an error if the username is incorrect', async () => {
    const { user } = render();
    await user.type(screen.getByLabelText("Nom d'utilisateur"), 'inconnu');
    await user.type(screen.getByLabelText('Mot de passe'), 'inconnu');
    await user.click(screen.getByRole('button', { name: 'Connexion' }));
    expect(
      await screen.findByText("Le nom d'utilisateur ou le mot de passe est incorrect"),
    ).toBeInTheDocument();
  });

  it('returns an error if the password is incorrect', async () => {
    const { user } = render();
    await user.type(screen.getByLabelText("Nom d'utilisateur"), 'scesbron');
    await user.type(screen.getByLabelText('Mot de passe'), 'inconnu');
    await user.click(screen.getByRole('button', { name: 'Connexion' }));
    expect(
      await screen.findByText("Le nom d'utilisateur ou le mot de passe est incorrect"),
    ).toBeInTheDocument();
  });

  it('shows the home page if the login succeeds', async () => {
    const { user } = render();
    await user.type(screen.getByLabelText("Nom d'utilisateur"), 'scesbron');
    await user.type(screen.getByLabelText('Mot de passe'), 'scesbron');
    await user.click(screen.getByRole('button', { name: 'Connexion' }));
    await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledWith('/', { replace: true }));
  });
});
