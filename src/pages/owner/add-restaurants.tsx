import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__generated__/createRestaurant";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { name, categoryName, address } = getValues();
      setUploading(false);
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: "Category",
                },
                coverImg: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: "Restaurant",
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
      navigate("/", { replace: true });
    }
  };
  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    // refetchQueries: [{ query: MY_RESTAURANTS_QUERY }], : replaced by cache method
  });
  const {
    register,
    getValues,
    handleSubmit,
    formState: { isValid },
  } = useForm<IFormProps>({ mode: "onChange" });
  const [uploading, setUploading] = useState(false);
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = getValues();
      const actualfile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualfile);
      const { url: coverImg } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();
      setImageUrl(coverImg);
      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImg,
          },
        },
      });
    } catch (e) {}
  };
  return (
    <div>
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <div className="container flex flex-col items-center mt-52">
        <h4 className="font-semibold text-2xl mb-3">Add Restaurant</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
        >
          <input
            className="input"
            type="text"
            placeholder="Name"
            {...register("name", { required: "Name is required." })}
          />
          <input
            className="input"
            type="text"
            placeholder="Address"
            {...register("address", { required: "Address is required." })}
          />
          <input
            className="input"
            type="text"
            placeholder="Category Name"
            {...register("categoryName", { required: "Category is required." })}
          />
          <div>
            <input
              type="file"
              accept="image/*"
              {...register("file", { required: true })}
            />
          </div>
          <Button
            loading={uploading}
            canClick={isValid}
            actionText="Create Restaurant"
          />
          {data?.createRestaurant?.error && (
            <FormError errorMessage={data.createRestaurant.error} />
          )}
        </form>
      </div>
    </div>
  );
};
