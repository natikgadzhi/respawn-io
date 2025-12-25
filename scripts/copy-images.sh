#!/bin/bash

# Copy function to handle each content type directory
copy_images() {
  echo "Copying images from $1 to public"
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
copy_images "src/content/posts"

# Process daily notes
copy_images "src/content/daily"

# Optimize all images in the public directory
echo "Optimizing images..."
find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -exec pnpm exec sharp --input {} --output {} --quality 80 \;
