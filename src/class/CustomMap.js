export default class CustomMap {
    constructor(width, height) {
        this.map = new Map();
        this.width = width;
        this.height = height;
    }
    addTileToMap(x, y, tileName) {
        this.map[x + ":" + y] = tileName;
    }
    getTileAt(x,y) {
        return this.map[x + ":" + y];
    }
    getMap() {
        return {
            "map" : this.map
        }
    }
    saveMap(name) {
        this.name = name;
        localStorage.currentMap = JSON.stringify(this.getMap());
    }
    loadMap() {
        if (localStorage.currentMap) {
            const data = JSON.parse(localStorage.currentMap);
            this.map = data.map;
        } 
    }
}