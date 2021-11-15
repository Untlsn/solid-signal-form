import { Accessor, JSX } from 'solid-js';
import { Store } from 'solid-js/store';

export type SubmitCallback<Inputs> = (values: Inputs) => void

export type FormOnSubmit = JSX.EventHandlerUnion<HTMLFormElement, Event & {submitter: HTMLElement}>

export interface Form<Names extends string | number | symbol> {
  handleSubmit(callback: SubmitCallback<Record<Names, string>>): FormOnSubmit,
  register(name: Names, props?: Partial<RegisterProps>): JSX.InputHTMLAttributes<HTMLInputElement>,
  watch(name: Names): Accessor<string>
  reset(ev?: Event): void
  setValue(name: Names, value: any): void
  setValue(name: Names): (value: any) => void
  unregister(name: Names): void
  resetField(name: Names): void
  formState: {
    errors: Store<Record<Names, {message: string, type: keyof RegisterErrors}>>
  }
}

export interface Props<Inputs> {
  defaultValues: Partial<Inputs>
}

export interface Input {
  name: string,
  watched?: boolean,
  defaultValue: string,
  reset(): void
  setValue(value: string): void
  value: Accessor<string>
}

export interface RegisterErrors {
  require: string,
  validation: (value: string) => string|undefined|false,
  regexp: [RegExp, string]
}

export interface RegisterProps extends RegisterErrors {
}