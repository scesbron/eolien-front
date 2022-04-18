import { rest } from 'msw';
import { User } from '../../types';

const users: Record<number, User> = {
  1: { username: 'scesbron', firstName: 'Sébastien', lastName: 'Cesbron', email: 'seb@cesbron.fr' },
};

const apiUrl = (path: string) => `${process.env.REACT_APP_API_BASE_URL}${path}`;

export const handlers = [
  rest.post(apiUrl('/login'), (req, res, ctx) => {
    // @ts-ignore
    const { username, password } = req.body.user;
    const user = Object.values(users).find((value) => value.username === username);
    if (user && username === password) {
      return res(ctx.status(200), ctx.json(user));
    }
    return res(
      ctx.status(422),
      ctx.json({
        errors: ["Le nom d'utilisateur ou le mot de passe est incorrect"],
      }),
    );
  }),
  rest.get(apiUrl('/user'), (req, res, ctx) => {
    const isAuthenticated = sessionStorage.getItem('is-authenticated');

    if (!isAuthenticated) {
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authorized',
        }),
      );
    }
    return res(
      ctx.status(200),
      ctx.json({
        username: 'admin',
      }),
    );
  }),
];
