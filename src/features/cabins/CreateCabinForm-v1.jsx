/* eslint-disable react/prop-types */
import toast from "react-hot-toast";
import FormRow from "../../ui/FormRow";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";

import { createCabin } from "../../services/apiCabins";





function CreateCabinForm({ cabin }) {
  const { register, handleSubmit, reset, getValues, formState } = useForm()
  const { errors } = formState
  const queryClient = useQueryClient();
  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success("New Cobain Successfully Created.");
      queryClient.invalidateQueries({
        queryKey: ["cabins"]
      });
      reset()
    },
    onError: (err) => toast.error(err.message)
  })

  function onSubmit(data) {
    mutate({ ...data, image: data.image[0] })
  }
  function onError(errors) {
    console.log(errors)
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>


      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input type="text" id="name" disabled={isCreating} {...register("name", { required: "This Field is required." })} />
      </FormRow>







      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input type="number" id="maxCapacity" disabled={isCreating} {...register("maxCapacity", {
          required: "This Field is required.", min: {
            value: 1,
            message: "Capacity Should be at least 1."
          }
        })} />
      </FormRow>



      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input type="number" id="regularPrice" disabled={isCreating} {...register("regularPrice", {
          required: "This Field is required.", min: {
            value: 1,
            message: "Regular Price Should be at least 1."
          }
        })} />
      </FormRow>


      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isCreating}
          defaultValue={0}
          {...register("discount", {
            required: "This field is required.",
            validate: (value) => {
              const regularPrice = getValues().regularPrice;
              return (
                value <= regularPrice ||
                "Discount should be less than or equal to the regular price"
              );
            },
          })}
        />
      </FormRow>


      <FormRow label="Description for website" error={errors?.description?.message}>
        <Textarea type="number" id="description" disabled={isCreating} defaultValue="" {...register("description", { required: "This Field is required." })} />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput id="image" disabled={isCreating} accept="image/*" {...register("image", { required: "This Field is required." })} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isCreating}>Add cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;      
