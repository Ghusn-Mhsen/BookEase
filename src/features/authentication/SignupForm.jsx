import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useSignUp } from "./hooks/useSignUp";

// Email regex: /\S+@\S+\.\S+/



function SignupForm() {
  const { register, formState: { errors }, getValues, handleSubmit, reset } = useForm();
  const { signUp, isLoading } = useSignUp();

  function onSubmit({ fullName, email, password }) {
    signUp({ fullName, email, password }, { onSettled: () => reset() })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input type="text" id="fullName" {...register("fullName", { required: "This Field Is Required" })} />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input type="email" id="email" disable={isLoading} {...register("email", {
          required: "This Field Is Required", pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
            message: "Invalid email address",
          },
        })} />
      </FormRow>

      <FormRow label="Password (min 8 characters)" error={errors?.password?.message}>
        <Input type="password" id="password" disable={isLoading} {...register("password", {
          required: "This Field Is Required", minLength: {
            value: 8,
            message: "Password needs a minimum 8 characters "
          }
        })} />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message} >
        <Input type="password" id="passwordConfirm" disable={isLoading}  {...register("passwordConfirm", {
          required: "This Field Is Required", validate: (value) =>
            value === getValues().password || "Passwords do not match",
        })} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" disable={isLoading} onClick={reset}>
          Cancel
        </Button>
        <Button disable={isLoading} >Create new user</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
