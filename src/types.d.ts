import { Accessor, JSX } from 'solid-js';
import { Store } from 'solid-js/store';

export type SubmitCallback<Inputs> = (values: Inputs) => void

export type FormOnSubmit = JSX.EventHandlerUnion<HTMLFormElement, Event & {submitter: HTMLElement}>

export interface Form<Names extends string | number | symbol> {
  /**
   * @summary give registered values to callback, and return function with ev.preventDefault()
   * @example
   * <form onSubmit={handleSubmit((value) => console.log(values)} />
   */
  handleSubmit(callback: SubmitCallback<Record<Names, string>>): FormOnSubmit,

  /**
   * @summary Will add input to form values
   * @example
   * <input {...register('name')} />
   */
  register(name: Names, props?: Partial<RegisterProps>): JSX.InputHTMLAttributes<HTMLInputElement>,

  /**
   * @summary return Accessor of provided name
   * @example
   * const value = watch('value');
   */
  watch(name: Names): Accessor<string>

  /**
   * @summary reset registered inputs values to default
   * @example
   * <button onClick={reset} />
   */
  reset(ev?: Event): void

  /**
   * @summary change value of resisered input with same name
   * @example
   * <button onClick={() => setValue('name', newValue)} />
   */
  setValue(name: Names, value: any): void
  /**
   * @summary change value of resisered input with same name
   * @example
   * <button onClick={() => setValue('name')(newValue)} />
   */
  setValue(name: Names): (value: any) => void

  /**
   * @summary remove from registred
   * @example
   * const removeInput = () => {
   *    unregister('input')
   *   // remove input from form
   * }
   */
  unregister(name: Names): void
  /**
   * reset value of filed to default
   * const resetName = () => {
   *   resetField('name')
   * }
   */
  resetField(name: Names): void
  /** values of form */
  formState: {
    /**
     * @summary All errors of Form provied by solid-js store.
     * @override Errors is not signal, learn more about solid-js store https://www.solidjs.com/docs/latest/api#using-stores
     * @example
     * createEffect(() => {
     *   console.log(
     *     errors.login.message
     *   )
     * })
     */
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