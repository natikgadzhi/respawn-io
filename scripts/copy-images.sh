#!/bin/bash

# The directory we are copying from
source_dir="content/posts"

# The directory we are copying to
dest_dir="public"

# Create the destination directory if it does not exist
mkdir -p $dest_dir

# Find all .png files in the source directory and its sub-directories
find $source_dir -name "*.png" | while read file; do
  # Replace the first occurrence of $source_dir with $dest_dir
  dest="${file/$source_dir/$dest_dir}"

  # Create the destination directory if it does not exist
  mkdir -p "$(dirname "$dest")"

  # Copy the file
  cp "$file" "$dest"
done
