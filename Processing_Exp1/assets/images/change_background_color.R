
recolor_background = function(input_dir, output_dir, color, rename = FALSE) {
  
  if (require("magick") == FALSE) {
    install.packages("magick")
    library("magick")
  }
  
  images = list.files(input_dir)
  
  # check the existence of the output directory
  dir.create(file.path(output_dir), showWarnings = FALSE)
  
  for (i in 1:length(images)) {
    
    # read the image
    img = image_read(stringr::str_glue("{input_dir}/{images[i]}"))
    
    # Create a solid background image with the same dimensions and the new color
    background = image_blank(image_info(img)$width, image_info(img)$height, color)
    
    # overlay the images to create a new image with the new background color:
    img_new = image_composite(img, background)
    
    # specify file-name for new image
    if (rename) {
      img_new_name = stringr::str_glue("{output_dir}/{rename}{i}.png")
    } else {
      img_new_name = stringr::str_glue("{output_dir}/{images[i]}")
      }
    
    # Write the new image to a file
    image_write(img_new, img_new_name)
    
  }
  
}

recolor_background(
  input_dir = "./images",
  output_dir = "./images_grey",
  color = "#bababa",
  rename = FALSE
)

library("tidyverse")


# read the size of the images
Data_size <- read_csv("./object_size.csv") %>% 
  mutate(size  = ifelse(size == "/", "0", size),
         size = as.numeric(size),
         size = ifelse(size >= 7, size - 1, size)
         )

# move the images to the corresponding folder
for (i in 1:nrow(Data_size)) {
  
  img <- Data_size$image[i]
  size <- Data_size$size[i]
  
  if (size == 0) {
    folder_new <- paste0("./images_grey/undefined")
    
    # check the existence of the output directory
    dir.create(file.path(folder_new), showWarnings = FALSE)
    
    # move the images to the corresponding folder
    file.rename(
      from = paste0("./images_grey/", img, ".png"),
      to = paste0(folder_new, "/", img, ".png"))
  } else {
    # rename the images
    file.rename(
      from = paste0("./images_grey/", str_to_title(img), ".PNG"),
      to = paste0("./images_grey/", img, ".png"))
  }
  
}



Data_size %>% 
  filter(size != 0) %>%
  pivot_wider(names_from = image, values_from = size) %>%
  jsonlite::write_json("./object_size.json")








