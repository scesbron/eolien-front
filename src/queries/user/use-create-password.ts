import { useMutation } from 'react-query';
import { password } from '../../api';
import { CreatePasswordProps } from '../../types';

const createPassword = async ({ username }: CreatePasswordProps) => {
  await password.create(username);
};

const useCreatePassword = () => useMutation(createPassword);

export default useCreatePassword;
