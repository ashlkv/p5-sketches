import { Pixels } from "../common/pixels.js";
import {directions, Tile} from "./tile.js";

window.P5 = p5;

new p5((p5) => {
    let image;
    let pixels;
    let tiles = []
    const tileSize = 3;
    const pixelDensity = 1;
    const canvasSize = {width: window.innerWidth, height: window.innerHeight};
    const cellSize = 20
    window.save = (name) => p5.save(name)
    
    function renderImage(pixels, origin) {
        pixels.forEach((value, x, y) => {
            const {r, g, b} = value;
            p5.fill(r, g, b);
            p5.rect(x * cellSize + origin.x, y * cellSize + origin.y, cellSize);
        })
    }
     
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height);
        image.loadPixels();
        pixels = new Pixels(p5, image.pixels, { width: image.width, height: image.height }, pixelDensity);
        pixels.forEach((value, x, y) => {
            const tilePixels = Pixels.slice(p5, pixels, { left: x, top: y, width: 3, height: 3 }, true)
            const tile = new Tile(p5, tilePixels);
            tiles.push(tile);
        })
    }
    
    p5.preload = () => {
        image = p5.loadImage('./city.png');
    }
    
    p5.draw = () => {
        p5.background(220);
        
        // tiles.forEach((tile, index) => {
        //     renderImage(tile.pixels, { x: index % image.width * 20 * 4, y: Math.floor(index / image.width) * 20 * 4 });
        // })
        const index = 0;
        const tile = tiles[index];
        renderImage(tile.pixels, { x: index % image.width * 20 * 4, y: Math.floor(index / image.width) * 20 * 4 });
        const neighbors = tile.getNeighbors(tiles);
        const neighborIndex = neighbors[directions.right][0]
        const neighbor = tiles[neighborIndex];
        renderImage(neighbor.pixels, { x: 1 % image.width * 20 * 4, y: Math.floor(index / image.width) * 20 * 4 });
        
        // renderImage(pixels, {x: 0, y: cellSize * pixels.height * (tileSize + 1)});
        
        p5.noLoop();
    }
}, document.querySelector('main'));
 
