import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  let { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("error in loading Cabins...");
  }
  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("Cabin Could not be deleted.");
  }
  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = hasImagePath
    ? newCabin.image
    : `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");

  const imagePath = hasImagePath
    ? imageName
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1- Create Cabin
  let query = supabase.from("cabins");
  // Create
  if (!id)
    query = query.insert([
      {
        ...newCabin,
        image: imagePath,
      },
    ]);
  // Edit
  else
    query = query
      .update({
        ...newCabin,
        image: imagePath,
      })
      .eq("id", id);

  const { data, error } = await query.select().single();
  if (error) {
    console.error(error);
    throw new Error("Cabin Could not be created.");
  }

  // 2 Upload Image
  if (hasImagePath) return data;
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);
  if (storageError) {
    // Delete the Cabin if there was an error
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error("Cabin Image Could not be Upload.");
  }

  return data;
}
