import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { SearchBar } from "../../components/searchBar";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../__generated__/searchRestaurant";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const [page, setPage] = useState(1);
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  const location = useLocation();
  const navigate = useNavigate();
  const [queryReadyToStart, { loading, data }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);
  const [_, query] = location.search.split("?term=");
  useEffect(() => {
    if (!query) {
      return navigate("/", { replace: true });
    }
    queryReadyToStart({
      variables: {
        input: {
          page,
          query,
        },
      },
    });
  }, [query, page]);

  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      <SearchBar />
      {!loading && (
        <div className="max-w-screen-2xl mt-8">
          <h2 className="ml-3 mt-5 text-xl">{`Key Word: "${query}"`}</h2>
          {data?.searchRestaurant?.totalResults &&
          data?.searchRestaurant?.totalResults === 1 ? (
            <h4 className="ml-3 mt-5 text-xl">
              {data?.searchRestaurant?.totalResults} restaurant found.
            </h4>
          ) : (
            <h4 className="ml-3 mt-5 text-xl">
              {data?.searchRestaurant?.totalResults} restaurants found.
            </h4>
          )}
          <div className="border-t mt-5 py-2 text-xs opacity-50 border-gray-400"></div>
          <div className="grid mt-5 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.searchRestaurant.restaurants?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          {data?.searchRestaurant?.totalPages !== 0 && (
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
                Page {page} of {data?.searchRestaurant.totalPages}
              </span>
              {page !== data?.searchRestaurant.totalPages ? (
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
          )}
        </div>
      )}
    </div>
  );
};
