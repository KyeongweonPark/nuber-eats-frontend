import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { category, categoryVariables } from "../../__generated__/category";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

interface IFormProps {
  searchTerm: string;
  name: string;
  search: string;
}

export const Category = () => {
  const [page, setPage] = useState(1);
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const navigate = useNavigate();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    navigate({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };
  let { slug } = useParams<Record<string, string | undefined>>();
  if (!slug) {
    slug = "";
  }

  const { data, loading } = useQuery<category, categoryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page,
          slug,
        },
      },
    }
  );

  console.log(slug);
  console.log(data?.category);
  return (
    <div>
      <Helmet>
        <title>Category | Nuber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-20 flex items-center justify-center"
      >
        <input
          {...register("searchTerm", {
            required: { value: true, message: "Keyword is required" },
            min: 3,
          })}
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          type="Search"
          placeholder="Search Restaurants..."
        />
      </form>
      <div className="max-w-screen-2xl mt-8">
        <div className="font-medium flex">
          <Link to={`/`}>
            <h2 className="ml-3 text-gray-500">All Categories</h2>
          </Link>
          <h2 className="ml-3 text-gray-500">{">"}</h2>
          <Link to={`/category/${slug}`}>
            <h2 className="ml-3">{slug}</h2>
          </Link>
        </div>
        {data?.category.category?.restaurantCount &&
        data?.category.category?.restaurantCount === 1 ? (
          <h4 className="ml-3 mt-5 text-xl">
            {data?.category.category?.restaurantCount} restaurant found.
          </h4>
        ) : (
          <h4 className="ml-3 mt-5 text-xl">
            {data?.category.category?.restaurantCount} restaurants found.
          </h4>
        )}
        <div className="border-t mt-5 py-2 text-xs opacity-50 border-gray-400"></div>
        {data?.category.restaurants && data?.category.restaurants.length > 1 ? (
          <div className="grid mt-5 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.category.restaurants?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
        ) : (
          <div>
            <h2 className="font-semibold text-2xl mb-3">
              Restaurants Not Found.
            </h2>
            <h4 className="font-medium text-base mb-5">
              The category you're looking for does not exist.
            </h4>
            <Link className="hover:underline text-lime-600" to="/">
              &larr; Go back
            </Link>
          </div>
        )}
        <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
          {page > 1 ? (
            <button
              onClick={onPrevPageClick}
              className="focus:outline-none font-medium text-2xl"
            >
              &larr;
            </button>
          ) : (
            <div></div>
          )}
          <span>
            Page {page} of {data?.category.totalPages}
          </span>
          {page !== data?.category.totalPages ? (
            <button
              onClick={onNextPageClick}
              className="focus:outline-none font-medium text-2xl"
            >
              &rarr;
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};
