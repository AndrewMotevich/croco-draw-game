export const WrongAnswer = {
  severity: 'error',
  summary: 'Error',
  detail: 'Wrong answer!',
};

export const SuccessAnswer = {
  severity: 'success',
  summary: 'Congratulation',
  detail: 'You are right!',
};

export const ShowRightAnswer = (riddleWord: string) => {
  return {
    severity: 'info',
    summary: 'Info',
    detail: `Right Answer is ${riddleWord}!`,
  };
};
