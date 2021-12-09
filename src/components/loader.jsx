import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { green } from '@material-ui/core/colors';

import windTurbine from '../assets/images/wind-turbine.svg';

const keyFrame = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Svg = styled.img`
  width: ${(props) => `${props.$size}px`};
  height: ${(props) => `${props.$size}px`};
  fill: ${(props) => props.$color};
  display: inline-block;
  vertical-align: middle;
  animation: ${keyFrame} 1s linear infinite;
  transform-origin: 50% 50%;
`;

const Loader = ({ color, size }) => (
  <Svg src={windTurbine} $size={size} $color={color} />
);
Loader.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
};

Loader.defaultProps = {
  color: green[500],
  size: 100,
};

export default memo(Loader);
