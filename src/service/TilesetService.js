import TilesetItem from '../class/TilesetItem';

const TILE_WIDTH = 128;
const TILE_HEIGHT = 64;

export default class TilesetService {
    
    constructor() {
        this.imgTilesetMap = new Map();
        this.tilesListMap = new Map();
        this.tilesetImageWaiting = 0;
    }

    loadTilesImages(tilesMapConfig, functionDone) {
        this.tilesetImageWaiting = tilesMapConfig.length;
        tilesMapConfig.forEach((config) => {
            this.imgTilesetMap[config.mapName] = new Image();
            this.imgTilesetMap[config.mapName].src = config.imageSrc;
            this.imgTilesetMap[config.mapName].onload = () => this.tilesImageLoaded(functionDone);
        });
    }

    tilesImageLoaded(functionDone) {
        this.tilesetImageWaiting--;
        if (this.tilesetImageWaiting==0) {
            functionDone(this);
        }
    }

    getImage(tilesName) {
        return this.imgTilesetMap[tilesName];
    }

    getTilesList(tilesetName) {
        let result = [];

        if (this.tilesListMap[tilesetName]) 
            return this.tilesListMap[tilesetName];

        let imgTileset = this.imgTilesetMap[tilesetName];

        const cols = Math.floor(imgTileset.width / TILE_WIDTH);
        const rows = Math.floor(imgTileset.height / TILE_HEIGHT);

        const canvas = document.createElement('canvas');
        canvas.width = TILE_WIDTH;
        canvas.height = TILE_HEIGHT;
        const ctx = canvas.getContext('2d');

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                ctx.clearRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
                ctx.drawImage(
                    imgTileset,
                    x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT, 
                    0, 0, TILE_WIDTH, TILE_HEIGHT                              
                );
                const dataUrl = canvas.toDataURL('image/png');
                result.push(new TilesetItem(tilesetName, x, y, dataUrl));
            }
        }

        this.tilesListMap[tilesetName] = result;

        return result;
    }

    getTileByName(tileName) {
        const tilesetName = tileName.split(':')[0];
        const tileList = this.getTilesList(tilesetName)
        return tileList.find((tile) => tile.name==tileName);
    }
}