const form = document.querySelector('#form') as HTMLFormElement;

const getUserInfo = (): User => {
  const emailInputElement = document.querySelector('#email') as HTMLInputElement;
  const passwordInputElement = document.querySelector('#password') as HTMLInputElement;

  const email = emailInputElement.value;
  const password = passwordInputElement.value;

  return {
    email,
    password,
  };
};

const validate = (user: User) => {
  const emailRegex = /\w+@\w+\.[a-z]+/;
  const passwordRegex = /\w{8,}/;

  const emailMatch = user.email.match(emailRegex);
  const passwordMatch = user.password.match(passwordRegex);

  return Boolean(emailMatch && passwordMatch);
};

const signIn = async (user: User) => {
  return httpPost<Token | ErrorMessage>(`${API_URL}/login`, JSON.stringify(user), {
    'Content-Type': 'application/json',
  });
};

const submitEvent = async (event: Event) => {
  event.preventDefault();

  const user = getUserInfo();
  const valid = validate(user);

  if (!valid) {
    return alert(VALIDATION_FAILED);
  }

  const response = await signIn(user);

  if ('errorMessage' in response) {
    return alert(response.errorMessage);
  }

  setToken(response.token);

  form.removeEventListener(EVENT_TYPES.submit, submitEvent);
  document.location.replace('./gallery.html');
};

form.addEventListener(EVENT_TYPES.submit, submitEvent);
