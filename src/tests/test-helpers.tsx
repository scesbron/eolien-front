import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { ReactElement } from 'react';
import AppSetup from '../containers/app-setup';

type MockableFunction = (...args: any[]) => any;

// use generic constraints to restrict `mockedFunc` to be any type of function
export const asMock = <Func extends MockableFunction>(mockedFunc: Func) =>
  mockedFunc as jest.MockedFunction<typeof mockedFunc>;

export const renderWithSetup = (ui: ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent.setup(),
    ...render(<AppSetup initialize={false}>{ui}</AppSetup>),
  };
};
