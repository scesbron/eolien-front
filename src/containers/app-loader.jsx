import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as userDuck from '../ducks/user';
import Loader from '../components/loader';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const AppLoader = ({
  children, initializing, initialized, load,
}) => {
  useEffect(() => {
    if (!initialized && !initializing) load();
  }, [initialized, initializing, load]);

  return (initializing || !initialized) ? (
    <Container>
      <Loader />
    </Container>
  ) : (
    children
  );
};

AppLoader.propTypes = {
  children: PropTypes.node.isRequired,
  initializing: PropTypes.bool.isRequired,
  initialized: PropTypes.bool.isRequired,
  load: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  initializing: state.user.initializing,
  initialized: state.user.initialized,
});

const mapDispatchToProps = {
  load: userDuck.load,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppLoader);
