import { useMutation } from 'react-query';
import { password } from '../../api';

const createPassword = async ({ username }: { username: string }) => {
  await password.create(username);
};

const useCreatePassword = () => useMutation(createPassword);

export default useCreatePassword;
