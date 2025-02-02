/* eslint-disable react/prop-types */
import FormRow from "../../ui/FormRow";
import { useForm } from "react-hook-form";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { useCreateCabin } from "./hooks/useCreateCabin";
import { useEditCabin } from "./hooks/useEditCabin";


function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;
  const { createCabin, isCreating } = useCreateCabin()
  const { editCabin, isEditing } = useEditCabin()



  const isWorking = isCreating || isEditing;
  function onSubmit(data) {
    console.log("data: ", data)
    const image = typeof data.image === "string" ? data.image : data.image[0];
    if (isEditSession)
      editCabin({ newCabinData: { ...data, image }, id: editId }, { onSuccess: (data) => reset() });
    else createCabin({ ...data, image: image }, {
      onSuccess: (data) => {
        reset()
        onCloseModal?.()
      }
    });
  }
  function onError(errors) {
    console.log(errors);
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? "modal" : "regular"}>
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", { required: "This Field is required." })}
        />
      </FormRow>
      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>

        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "This Field is required.",
            min: { value: 1, message: "Capacity Should be at least 1." },
          })}
        />
      </FormRow>
      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "This Field is required.",
            min: { value: 1, message: "Regular Price Should be at least 1." },
          })}
        />
      </FormRow>
      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
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
      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          {...register("description", { required: "This Field is required." })}
        />
      </FormRow>
      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          disabled={isWorking}
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "This Field is required.",
          })}
        />
      </FormRow>
      <FormRow>

        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" onClick={() => onCloseModal?.()}>

          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit Cabin" : "Create Cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}
export default CreateCabinForm;
