import { Pixels } from "../common/pixels.js";
import {Tile} from "./tile.js";

window.P5 = p5;

new p5((p5) => {
    let image;
    let pixels;
    let tiles = []
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
    
    function extractTiles(pixels) {
        const tiles = [];
        
        pixels.forEach((value, x, y) => {
            const tilePixels = Pixels.slice(p5, pixels, { left: x, top: y, width: 3, height: 3 })
            const tile = new Tile(tilePixels);
            tiles.push(tile);
        })
        return tiles; 
    }
     
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height);
        image.loadPixels();
        pixels = new Pixels(p5, image.pixels, { width: image.width, height: image.height }, 1);
        tiles = extractTiles(pixels)
    }
    
    p5.preload = () => {
        image = p5.loadImage('./city.png');
    }
    
    p5.draw = () => {
        p5.background(220);
        
        // renderImage(pixels, {x: 0, y: 0});
        
        tiles.forEach((tile, index) => {
            renderImage(tile.image, { x: index % image.width * 20 * 4, y: Math.floor(index / image.width) * 20 * 4 });
        })
        
        p5.noLoop();
    }
}, document.querySelector('main'));
 
