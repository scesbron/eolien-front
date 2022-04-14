import { useMutation } from 'react-query';
import { password as passwordApi } from '../../api';
import { UpdatePasswordProps } from '../../types';

type PasswordParams = UpdatePasswordProps & {
  token: string | null;
};

const updatePassword = async ({ token, password, confirmation }: PasswordParams) => {
  await passwordApi.update(token, password, confirmation);
};

const useUpdatePassword = () => useMutation(updatePassword);

export default useUpdatePassword;
