import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormError } from "./form-error";

interface IFormProps {
  searchTerm: string;
  name: string;
  search: string;
}

export const SearchBar: React.FC = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IFormProps>();
  const navigate = useNavigate();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    navigate({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSearchSubmit)}
      className="bg-gray-800 w-full py-20 flex flex-col items-center justify-center"
    >
      <input
        {...register("searchTerm", {
          required: { value: true, message: "Keyword is required" },
          minLength: {
            value: 3,
            message: "Keyword shall be more than 3 charactors.",
          },
        })}
        className="input rounded-md border-0 w-3/4 md:w-3/12"
        type="Search"
        placeholder="Search Restaurants..."
      />
      {errors.searchTerm?.message && (
        <FormError errorMessage={errors.searchTerm?.message} />
      )}
    </form>
  );
};
