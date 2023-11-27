import * as Cesium from "cesium";

export class CesiumService {
    async loadTerrain(element: any) {
        return new Cesium.Viewer(element, {
            terrainProvider: await Cesium.createWorldTerrainAsync(),
        });
    }

    async loadTile() {
        try {
            const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(75343, {});
            return tileset;
        } catch (error) {
            console.error("Error loading tileset", error);
            throw error;
        }
    }
} 