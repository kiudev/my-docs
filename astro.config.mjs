// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { reactItems } from "./src/content/items/react.js";
import { javascriptItems } from "./src/content/items/javascript.js";

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: "My React Docs",
            sidebar: [
                {
                    label: "JavaScript",
                    items: javascriptItems,
                },
                {
                    label: "React",
                    items: reactItems,
                },
            ],
        }),
    ],
});
