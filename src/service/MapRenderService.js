const TILE_WIDTH = 128;
const TILE_HEIGHT = 64;

export default class MapRenderService {
    constructor(context2D, tilesetService, viewport) {
        this.tilesetService = tilesetService;
        this.ctx2d = context2D;
        this.viewport = viewport;
    }

    renderMap(map) {
        this.ctx2d.reset();
        let posMapX = 0;
        for (let cptX = this.viewport.x; cptX<=(this.viewport.x + this.viewport.width); cptX++) {
            let posMapY = 0;
            for (let cptY = this.viewport.y; cptY<=(this.viewport.y + this.viewport.height); cptY++) {
                const tileName = map.getTileAt(cptX, cptY);
                if (tileName) {
                    this.drawTile(posMapX, posMapY, tileName);
                }
                posMapY++;
            }
            posMapX++;
        }
    }

    setViewport(viewport) {
        this.viewport = viewport;
    }

    drawTile(x, y, tileName) {
        const arrayName = tileName.split(':');
        const mapName = arrayName[0]; 
        const tileX = arrayName[1]*TILE_WIDTH;
        const tileY = arrayName[2]*TILE_HEIGHT;

        const posX = (x-y)*TILE_WIDTH/2;
        const posY = (x+y)*TILE_HEIGHT/2;
        
        this.ctx2d.drawImage(this.tilesetService.getImage(mapName), 
            tileX, tileY, TILE_WIDTH, TILE_HEIGHT, 
            posX - (TILE_WIDTH/2), posY, TILE_WIDTH, TILE_HEIGHT);
    }

    getMapCoordinate(clicX, clicY) {
        const cX = clicX / (TILE_WIDTH/2);
        const cY = clicY / (TILE_HEIGHT/2);

        const x = (cX + cY)/2;
        const y = (cY - cX)/2;

        return {
            x: Math.floor(x) + this.viewport.x,
            y: Math.floor(y) + this.viewport.y
        };
    }
}