export default class TilesetItem {
    constructor(type, tilePosX, tilePosY, url) {
        this.name = type + ":" + tilePosX + ":" + tilePosY;
        this.posX = tilePosX;
        this.posY = tilePosY;
        this.url = url;
    }
}