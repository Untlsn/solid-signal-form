<h1 style="text-align: center">Solid Signal Form</h1>
<p style="text-align: center">Solid-js forms library with api similar to react-hook-form</p>

## Install
```
npm i react-hook-form

yarn add react-hook-form
```

## Quickstart
```javascript
import { createForm } from 'solid-signal-form';
import { Show } from 'solid-js';

const App = () => {
  const { register, handleSubmit, formState: { errors } } = createForm();
  const submit = handleSubmit((values) => {
    console.log(values)
  })

  return (
    <form onSubmit={submit}>
      <input {...register('login', { require: 'Last name is required.' })} /> {/* register an input */}
      <Show when={errors.login}>
        <p>{errors.login.message}</p>
      </Show>
      <input {...register('password', {
        require: 'Please enter password.',
        validation: (value) => value.length < 8 && 'Password must have at least 8 characters.',
      })} />
      <Show when={errors.password}>
        <p>{errors.password.message}</p>
      </Show>
      <input type="submit" />
    </form>
  );
};

export default App;
```