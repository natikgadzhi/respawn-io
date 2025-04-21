#!/bin/bash

# Copy function to handle each content type directory
copy_images() {
  local source_dir=$1
  local dest_dir="public"

  # Create the destination directory if it does not exist
  mkdir -p $dest_dir

  # Find all .png and .jpg files in the source directory and its sub-directories
  find $source_dir -name "*.png" -o -name "*.jpg" | while read file; do
    # Replace the first occurrence of $source_dir with $dest_dir
    dest="${file/$source_dir/$dest_dir}"

    # Create the destination directory if it does not exist
    mkdir -p "$(dirname "$dest")"

    # Copy the file
    cp "$file" "$dest"
  done
}

# Process posts
copy_images "content/posts"

# Process daily notes
copy_images "content/daily"
