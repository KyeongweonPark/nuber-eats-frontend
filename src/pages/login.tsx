import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../__generated__/LoginMutation";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
  resultError?: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();
  const onCompleted = (data: LoginMutation) => {
    const {
      login: { error, ok, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, { onCompleted });
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };
  return (
    <div className="h-screen flex items-center flex-col mt-32">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 px-5">
        <input
          {...register("email", { required: "Email is required" })}
          required
          type="email"
          placeholder="Email"
          className="input"
        />
        {errors.email?.message && (
          <FormError errorMessage={errors.email?.message} />
        )}
        <input
          {...register("password", {
            required: "Password is required",
            minLength: 4,
          })}
          required
          type="password"
          placeholder="Password"
          className="input"
        />
        {errors.password?.message && (
          <FormError errorMessage={errors.password?.message} />
        )}
        {errors.password?.type === "minLength" && (
          <FormError
            errorMessage={"Password must be more than 9 charactors."}
          />
        )}
        <button className="btn mt-3">
          {loading ? "Loading..." : "Log In"}
        </button>
        {loginMutationResult?.login.error && (
          <FormError errorMessage={loginMutationResult.login.error} />
        )}
      </form>
    </div>
  );
};
