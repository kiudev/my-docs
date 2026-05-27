// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: "My React Docs",
            sidebar: [
                {
                    label: "Inicio",
                    items: [{ autogenerate: { directory: "01-start" } }],
                },
                {
                    label: "Fundamentos",
                    items: [
                        {
                            label: "Virtual DOM",
                            slug: "02-fundamentals/virtual-dom",
                        },
                        { label: "JSX", slug: "02-fundamentals/jsx" },
                        {
                            label: "Componentes",
                            slug: "02-fundamentals/components",
                        },
                        {
                            label: "Props",
                            slug: "02-fundamentals/props",
                        },
                        {
                            label: "State",
                            slug: "02-fundamentals/state",
                        },
                    ],
                },
                {
                    label: "Renderizado",
                    items: [
                        {
                            label: "Component Lifecycle",
                            slug: "03-rendering/component-lifecycle",
                        },
                        {
                            label: "Conditional Rendering",
                            slug: "03-rendering/conditional-rendering",
                        },
                        {
                            label: "Events",
                            slug: "03-rendering/events",
                        },
                        {
                            label: "Forms",
                            slug: "03-rendering/forms",
                        },
                        {
                            label: "Lists and Keys",
                            slug: "03-rendering/lists-keys",
                        },
                        {
                            label: "Refs",
                            slug: "03-rendering/refs",
                        },
                        {
                            label: "Render Props",
                            slug: "03-rendering/render-props",
                        },
                        {
                            label: "Higher Order Components",
                            slug: "03-rendering/higher-order-components",
                        },
                    ],
                },
                {
                    label: "Hooks",
                    items: [
                        {
                            label: "Básicos",
                            items: [
                                {
                                    label: "useState",
                                    slug: "04-hooks/basic-hooks/use-state",
                                },
                                {
                                    label: "useEffect",
                                    slug: "04-hooks/basic-hooks/use-effect",
                                },
                                {
                                    label: "useContext",
                                    slug: "04-hooks/basic-hooks/use-context",
                                },
                                {
                                    label: "useRef",
                                    slug: "04-hooks/basic-hooks/use-ref",
                                },
                            ],
                        },
                        {
                            label: "Rendimiento",
                            items: [
                                {
                                    label: "useMemo",
                                    slug: "04-hooks/performance-hooks/use-memo",
                                },
                                {
                                    label: "useCallback",
                                    slug: "04-hooks/performance-hooks/use-callback",
                                },
                            ],
                        },
                        {
                            label: "Estado complejo",
                            items: [
                                {
                                    autogenerate: {
                                        directory:
                                            "04-hooks/complex-state-hooks",
                                    },
                                },
                            ],
                        },
                        {
                            label: "Avanzados",
                            items: [
                                {
                                    label: "useLayoutEffect",
                                    slug: "04-hooks/advanced-hooks/use-layout-effect",
                                }
                            ]
                        }
                    ],
                },
            ],
        }),
    ],
});
