import { css, CSSObject, SimpleInterpolation } from 'styled-components';

export const MIN_SM = 576;
export const MIN_MD = 768;
export const MIN_LG = 992;
export const MIN_XL = 1200;

export const MIN_SM_PX = `${MIN_SM}px`;
export const MIN_MD_PX = `${MIN_MD}px`;
export const MIN_LG_PX = `${MIN_LG}px`;
export const MIN_XL_PX = `${MIN_XL}px`;

export const ALL_MIN = {
  sm: MIN_SM_PX,
  md: MIN_MD_PX,
  lg: MIN_LG_PX,
  xl: MIN_XL_PX,
};

export const minWidth = (Object.keys(ALL_MIN) as Array<keyof typeof ALL_MIN>).reduce(
  (accumulator, label) => {
    accumulator[label] = (
      first: TemplateStringsArray | CSSObject,
      ...args: SimpleInterpolation[]
    ) => css`
      @media (min-width: ${ALL_MIN[label]}) {
        ${css(first, ...args)};
      }
    `;
    return accumulator;
  },
  {} as { [index: string]: Function },
);
