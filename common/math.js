const laplacian = [[0.05, 0.2, 0.05], [0.2, -1, 0.2], [0.05, 0.2, 0.05]]

export function convolveGrid(image, kernel = laplacian) {
    if (kernel.length === 0 || kernel[0].length === 0 || image.length === 0 || image[0].length === 0) {
        return image;
    }
    const imageWidth = image[0].length;
    const imageHeight = image.length;
    const result = new Array(imageHeight - 2).fill(0)
        .map(() => new Array(imageWidth - 2).fill(0));
    
    for (let y = 1; y < imageHeight - 1; y++) {
        for (let x = 1; x < imageWidth - 1; x++) {
            result[y - 1][x - 1] = convolveCell(image, x, y, kernel);
        }
    }
    
    return result;
}

export function convolveCell(image, x, y, kernel, product = (value, kernel) => value * kernel) {
    const kernelWidth = kernel[0].length
    const kernelHeight = kernel.length
    let sum = 0;
    for (let ky = 0; ky < kernelHeight; ky++) {
        for (let kx = 0; kx < kernelWidth; kx++) {
            sum += product(image[y + ky - 1][x + kx - 1], kernel[ky][kx]);
        }
    }
    return sum;
}
