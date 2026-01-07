// Game configuration and constants
export const GAME_CONFIG = {
    // Image URL - can be local or remote
    SCENE_URL: "./images/map/camp2_1980.png",

    // Game difficulty settings
    HIT_TOLERANCE: 0.06, // Distance tolerance for object detection
    MAX_COORDINATE: 0.98,
    MIN_COORDINATE: 0.02,

    // UI timing
    SUCCESS_MESSAGE_DURATION: 2000,
    ERROR_MESSAGE_DURATION: 700,

    // Coordinate precision
    COORDINATE_PRECISION: 2
} as const;

// Initial game objects configuration with image references
export const INITIAL_OBJECTS = [
    { id: "backpack", name: "Hátizsák", x: 0.41, y: 0.52, image: "./images/svg/backpack.svg" },
    { id: "backpack_blue", name: "Kék hátizsák", x: 0.21, y: 0.52, image: "./images/svg/backpack_blue.svg" },
    { id: "binoculars", name: "Távcső", x: 0.32, y: 0.28, image: "./images/svg/binoculars.svg" },
    { id: "boots", name: "Bakancs", x: 0.85, y: 0.65, image: "./images/svg/boots.svg" },
    { id: "bottle", name: "Kulacs", x: 0.55, y: 0.15, image: "./images/svg/bottle.svg" },
    { id: "lamp2", name: "Lámpa", x: 0.18, y: 0.72, image: "./images/svg/lamp2.svg" },
    { id: "campfire", name: "Tábortűz", x: 0.11, y: 0.42, image: "./images/svg/campfire.svg" },
    { id: "piknik_kosar", name: "Piknik kosár", x: 0.75, y: 0.33, image: "./images/svg/piknik_kosar.svg" },
    { id: "sajt", name: "Sajt", x: 0.36, y: 0.58, image: "./images/svg/sajt.svg" },
    { id: "szendvics", name: "Szendvics", x: 0.26, y: 0.78, image: "./images/svg/szendvics.svg" },
    { id: "termosz", name: "Termosz", x: 0.64, y: 0.18, image: "./images/svg/termosz.svg" },
    { id: "wrench", name: "Kulcs", x: 0.47, y: 0.39, image: "./images/svg/wrench.svg" },
] as const;

// Message constants
export const MESSAGES = {
    SUCCESS: "Talált!",
    NOT_HERE: "Nem itt — próbáld újra",
    GAME_COMPLETE: (time: number) => `Gratulálok! Megtaláltál minden tárgyat ${time}s alatt.`,
    MAP_ERROR: "Kép betöltése sikertelen. Kérlek, ellenőrizd az internetkapcsolatot.",
    RETRY_IMAGE: "Újra próbálkozás"
} as const;

export const TEXT = {
    NEW_GAME: "Új játék",
    TIME: (timeElapsed: number) => `Idő: ${timeElapsed}s`,
    REMAINING: (remaining: number, total: number) => `Hátralévő: ${remaining}/${total}`,
    RETRY_IMAGE: "Újra próbálkozás",
    IMAGE_ERROR: "Kép betöltése sikertelen. Kérlek, ellenőrizd az internetkapcsolatot.",
    OBJECTS: "Megtalálandó tárgyak"

} as const;
