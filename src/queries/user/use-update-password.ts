import { useMutation } from 'react-query';
import { password as passwordApi } from '../../api';

type PasswordParams = {
  token: string | null;
  password: string;
  confirmation: string;
};

const updatePassword = async ({ token, password, confirmation }: PasswordParams) => {
  await passwordApi.update(token, password, confirmation);
};

const useUpdatePassword = () => useMutation(updatePassword);

export default useUpdatePassword;
