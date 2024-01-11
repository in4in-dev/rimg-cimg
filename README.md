# Image compressor and metadata remover

This is a very handy recursive image compressor and metadata remover! Simple to use!

### Install
```sh
npm i -g picture-compress
```

## Compress image

### Compress one image

```sh
cimg /directory/image1.png
cimg /directory/image2.jpeg
cimg /directory/sub/image3.gif
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
```

### Remove metadata from all images in directory (recursive)
```sh
# Some directory
rimg /directory

# Or current directory
rimg .
```
