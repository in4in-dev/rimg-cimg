# Image compressor and metadata remover

This is a very handy recursive image compressor and metadata remover! Simple to use!

### Aliases

```sh
alias cimg='node /path_to_project/cimg.js'
```

```sh
alias rimg='node /path_to_project/rimg.js'
```

## Compress image

### Compress one image

```sh
cimg /directory/image1.png
cimg /directory/image2.jpeg
cimg /directory/sub/image3.gif
cimg /directory/sub/sub/image4.svg
```

### Compress all images in directory (recursive)
```sh
# Some directory
cimg /directory

# Or current directory
cimg .
```

## Remove metadata from image

### Remove metadata from one image

```sh
rimg /directory/image1.png
rimg /directory/image2.jpeg
rimg /directory/sub/image3.gif
rimg /directory/sub/sub/image4.svg
```

### Remove metadata from all images in directory (recursive)
```sh
# Some directory
rimg /directory

# Or current directory
rimg .
```

# How it works?

We use API from this services:

- https://imagecompressor.com
- https://coding.tools/exif-remover
