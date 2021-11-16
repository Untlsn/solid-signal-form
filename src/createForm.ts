import { createEffect, createSignal } from 'solid-js';
import { Form, Input, Props, RegisterProps, RegisterErrors } from './types';
import { createStore } from 'solid-js/store';

const reactiveInput = () => {
  const [value, setValue] = createSignal('');
  return { value, setValue };
}


export const createForm = <Inputs extends Record<string, any>>(props?: Partial<Props<Inputs>>) => {
  let [wasFirstSubmit, setWasFirstSubmit] = createSignal(false);
  const inputs: Record<string, Input> = {}
  const [errors, setErrors] = createStore<Record<string, {
    message: string,
    type: keyof RegisterErrors
  } | undefined>>({});


  return {
    handleSubmit: (callback: Function)=> (ev) => {
      ev.preventDefault();
      setWasFirstSubmit(true);
      if (!Object.values(errors).length) {
        callback(
          Object.fromEntries(
            Object.values(inputs).map((input) => [input.name, input.value()])
          )
        )
      }

    },
    register: (name: string, registerProps: Partial<RegisterProps> = {}) => {
      return {
        ref(ref) {
          let input = inputs[name];

          if (!input) {
            inputs[name] = {
              name,
              defaultValue: props?.defaultValues?.[name] || '',
              ...reactiveInput(),
              reset() { inputs[name].setValue(inputs[name].defaultValue || '') }
            }
            input = inputs[name];
            input.setValue(input.defaultValue)
          }

          input.reset()

          createEffect(() => {
            ref.value = input.value();
          })

          const listener = () => {
            input.value() != ref.value && input.setValue(ref.value)
          }

          if (registerProps.validation) {
            createEffect(() => {
              wasFirstSubmit();


              setErrors(name, (error) => {
                const errorMessage = registerProps.validation!(input.value());

                return errorMessage && wasFirstSubmit()
                  ? {
                    type: 'validation',
                    message: errorMessage,
                  }
                  : error?.type == 'validation' ? undefined : error
              })
            })
          }

          if (registerProps.regexp) {
            const [regexp, errorMessage] = registerProps.regexp!

            createEffect(() => {
              wasFirstSubmit();
              setErrors(name, (error) => {
                return !regexp.test(input.value()) && wasFirstSubmit()
                  ? {
                    type: 'regexp',
                    message: errorMessage,
                  }
                  : error?.type == 'regexp' ? undefined : error
              })
            })
          }

          if (registerProps.require) {
            createEffect(() => {
              wasFirstSubmit();
              setErrors(name, (error) => !input.value() && wasFirstSubmit()
                ? {
                  type: 'require',
                  message: registerProps.require!,
                }
                : error?.type == 'require' ? undefined : error
              )
            })
          }

          ref.addEventListener('keyup', listener)
          ref.addEventListener('keydown', listener)
        }
      }
    },
    watch: (name: string) => {
      if (!inputs[name]) {
        inputs[name] = {
          name: name,
          watched: true,
          defaultValue: props?.defaultValues?.[name] || '',
          ...reactiveInput(),
          reset() { inputs[name].setValue(inputs[name].defaultValue || '') }
        };
        inputs[name].setValue(inputs[name].defaultValue)
      }

      return inputs[name].value;
    },
    reset: (ev) => {
      ev?.preventDefault();
      Object.values(inputs).forEach(input => input.reset())
    },
    setValue(name: string, dirtyValue?: any) {
      if (dirtyValue === undefined) return (dirtyValue: any) => {
        const value = String(dirtyValue);
        inputs[name].setValue(value);
      }
      else {
        const value = String(dirtyValue);
        inputs[name].setValue(value);
      }
    },
    unregister: (name: string) => {
      delete inputs[name]
    },
    resetField(name: string) {
      inputs[name].reset()
    },
    formState: {
      errors: errors as any,
    }
  } as Form<keyof Inputs>;
}