import React, { PropsWithChildren, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as userDuck from '../ducks/user';
import Loader from '../components/loader';
import { RootState } from '../types';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

type AppLoaderProps = PropsWithChildren<{
  initializing: boolean;
  initialized: boolean;
  load: () => void;
}>;

const AppLoader = ({ children, initializing, initialized, load }: AppLoaderProps) => {
  useEffect(() => {
    if (!initialized && !initializing) load();
  }, [initialized, initializing, load]);

  return initializing || !initialized ? (
    <Container>
      <Loader />
    </Container>
  ) : (
    <>{children}</>
  );
};

const mapStateToProps = (state: RootState) => ({
  initializing: state.user.initializing,
  initialized: state.user.initialized,
});

const mapDispatchToProps = {
  load: userDuck.load,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppLoader);
